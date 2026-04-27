import { GoogleGenAI } from '@google/genai';

// Initialize the Gemini API client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateThankYouMessage(
  guestName: string,
  menuType: string,
  observations: string
): Promise<string> {
  const prompt = `Eres un asistente amable que está ayudando en el bautizo de un niño llamado Liam.
Acaba de confirmar su asistencia un invitado llamado ${guestName}.
Ha elegido el menú: ${menuType}.
Sus observaciones son: ${observations || 'Ninguna'}.

Escribe un mensaje de agradecimiento corto (máximo 3 oraciones), cálido y muy emotivo por su confirmación. 
Si el invitado tiene observaciones (como alergias), menciónale de forma sutil que las tendremos en cuenta para que disfrute sin preocupaciones.
El tono debe ser angelical, familiar y relacionado con la celebración de un bautizo (usa palabras como luz, bendición, alegría, amor).
No uses comillas al principio ni al final.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash',
      contents: prompt,
    });
    
    return response.text || "¡Gracias por confirmar tu asistencia, te esperamos con mucha ilusión!";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "¡Gracias por confirmar tu asistencia, te esperamos con mucha ilusión y alegría!";
  }
}
