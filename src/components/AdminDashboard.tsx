import React, { useState, useEffect } from 'react';
import { getAllResponses } from '../lib/firestore';
import { motion } from 'motion/react';
import { Users, Utensils, AlertCircle, Download, FileText, BarChart3 } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';

export default function AdminDashboard() {
  const [responses, setResponses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllResponses();
        setResponses(data || []);
      } catch (error) {
        console.error("Error fetching responses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = {
    total: responses.length,
    adult_standard: responses.filter(r => r.selectedMenu === 'adult_standard').length,
    adult_vegan: responses.filter(r => r.selectedMenu === 'adult_vegan').length,
    kids: responses.filter(r => r.selectedMenu === 'kids').length,
  };

  const chartData = [
    { name: 'Adulto Clásico', value: stats.adult_standard, color: '#2563EB' },
    { name: 'Adulto Vegano', value: stats.adult_vegan, color: '#10B981' },
    { name: 'Infantil', value: stats.kids, color: '#F59E0B' },
  ];

  const exportToCSV = () => {
    const headers = ["Nombre", "Email", "Menu", "Observaciones", "Fecha"];
    const rows = responses.map(r => [
      r.userName,
      r.userEmail,
      r.selectedMenu,
      r.observations.replace(/,/g, ';'), 
      r.submittedAt?.toDate?.()?.toLocaleString() || ''
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `respuestas_bautizo_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-blue-600">
        <span className="animate-pulse font-medium">Cargando datos del administrador...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 mt-24">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-4xl font-bold text-deep-blue">Panel de Control</h2>
          <p className="text-gray-500 font-sans text-sm">Resumen de asistencia y elecciones de menú.</p>
        </div>
        <button
          onClick={exportToCSV}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all font-bold text-sm shadow-md"
        >
          <Download size={18} />
          <span>Exportar CSV</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard icon={<Users size={20} />} label="Total Invitados" value={stats.total} />
        <StatCard icon={<Utensils size={20} />} label="Adultos Clásicos" value={stats.adult_standard} />
        <StatCard icon={<Utensils size={20} />} label="Adultos Veganos" value={stats.adult_vegan} />
        <StatCard icon={<FileText size={20} />} label="Menús Infantiles" value={stats.kids} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-1 bg-white rounded-[24px] p-6 shadow-sm border border-blue-100">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 size={18} className="text-blue-600" />
            <h3 className="font-bold text-deep-blue">Distribución</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={100} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748B' }} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-[24px] shadow-sm border border-blue-100 overflow-hidden">
          <div className="p-6 border-b border-blue-50 bg-gray-50/30">
            <h3 className="font-bold text-deep-blue">Listado Detallado</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-sm">
              <thead>
                <tr className="bg-gray-50/50 text-gray-500 uppercase tracking-wider text-[10px] font-bold">
                  <th className="px-6 py-4">Invitado</th>
                  <th className="px-6 py-4">Menú</th>
                  <th className="px-6 py-4">Observaciones</th>
                  <th className="px-6 py-4 text-right">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {responses.map((response) => (
                  <tr key={response.id} className="hover:bg-blue-50/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">{response.userName}</div>
                      <div className="text-xs text-gray-400">{response.userEmail}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                        response.selectedMenu === 'kids' ? 'bg-orange-50 text-orange-600' :
                        response.selectedMenu === 'adult_vegan' ? 'bg-green-50 text-green-600' :
                        'bg-blue-50 text-blue-600'
                      }`}>
                        {response.selectedMenu.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      {response.observations ? (
                        <div className="flex items-start gap-2 text-red-500">
                          <AlertCircle size={14} className="mt-0.5 shrink-0" />
                          <span className="italic leading-relaxed">{response.observations}</span>
                        </div>
                      ) : (
                        <span className="text-gray-300 italic">Sin observaciones</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right text-gray-400 text-xs">
                      {response.submittedAt?.toDate?.()?.toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {responses.length === 0 && (
              <div className="p-12 text-center text-gray-400 italic">
                Aún no hay respuestas registradas.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode, label: string, value: number }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm flex items-center gap-4">
      <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
        {icon}
      </div>
      <div>
        <div className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">{label}</div>
        <div className="text-2xl font-bold text-deep-blue">{value}</div>
      </div>
    </div>
  );
}
