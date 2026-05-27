import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { Locale, t } from '../i18n';

const CLOUD_NAME = 'dzirz4hyk';
const UPLOAD_PRESET = 'liamBautizo';
const FOLDER = 'bautizo';

interface PhotoGalleryProps {
  locale: Locale;
}

export default function PhotoGallery({ locale }: PhotoGalleryProps) {
  const [photos, setPhotos] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const [loadingPhotos, setLoadingPhotos] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    try {
      const res = await fetch(
        `https://res.cloudinary.com/${CLOUD_NAME}/image/list/${FOLDER}.json`
      );
      if (res.ok) {
        const data = await res.json();
        const urls = data.resources.map(
          (r: { public_id: string }) =>
            `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_800,q_auto,f_auto/${r.public_id}`
        );
        setPhotos(urls.reverse());
      }
    } catch (error) {
      console.error('Error loading photos:', error);
    } finally {
      setLoadingPhotos(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', UPLOAD_PRESET);
        formData.append('folder', FOLDER);
        formData.append('tags', FOLDER);

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
          { method: 'POST', body: formData }
        );
        const data = await res.json();
        return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_800,q_auto,f_auto/${data.public_id}`;
      });

      const newUrls = await Promise.all(uploadPromises);
      setPhotos((prev) => [...newUrls, ...prev]);
    } catch (error) {
      console.error('Error uploading:', error);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <section className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-[32px] shadow-xl border border-blue-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-8 text-center text-white">
          <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Camera size={28} className="text-white" />
          </div>
          <h2 className="text-2xl font-serif font-semibold mb-1">
            {t(locale, 'galleryTitle')}
          </h2>
          <p className="text-blue-100 text-sm">
            {t(locale, 'gallerySubtitle')}
          </p>
        </div>

        {/* Upload button */}
        <div className="p-6 border-b border-blue-50">
          <label className="flex items-center justify-center gap-2 w-full py-4 rounded-full font-semibold text-base bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer">
            {uploading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>{t(locale, 'galleryUploading')}</span>
              </>
            ) : (
              <>
                <Upload size={20} />
                <span>{t(locale, 'galleryUploadBtn')}</span>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>

        {/* Photo grid */}
        <div className="p-6">
          {loadingPhotos ? (
            <div className="flex items-center justify-center py-12 text-blue-400">
              <Loader2 size={24} className="animate-spin" />
            </div>
          ) : photos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <ImageIcon size={48} className="mb-3 opacity-50" />
              <p className="text-sm">{t(locale, 'galleryEmpty')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {photos.map((url, i) => (
                <motion.button
                  key={url}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setLightboxUrl(url.replace('/w_800,', '/w_1600,'))}
                  className="aspect-square rounded-2xl overflow-hidden hover:scale-[1.03] transition-transform shadow-sm"
                >
                  <img
                    src={url}
                    alt={`${t(locale, 'galleryPhotoAlt')} ${i + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </motion.button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4"
            onClick={() => setLightboxUrl(null)}
          >
            <button
              onClick={() => setLightboxUrl(null)}
              className="absolute top-4 right-4 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              aria-label={t(locale, 'galleryClose')}
            >
              <X size={24} />
            </button>
            <motion.img
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              src={lightboxUrl}
              alt=""
              className="max-w-full max-h-[90vh] rounded-xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
