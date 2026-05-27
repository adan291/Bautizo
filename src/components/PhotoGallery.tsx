import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, X, Loader2, Image as ImageIcon, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { db } from '../firebase';
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { Locale, t } from '../i18n';

const CLOUD_NAME = 'dzirz4hyk';
const UPLOAD_PRESET = 'liamBautizo';
const FOLDER = 'bautizo';

interface PhotoGalleryProps {
  locale: Locale;
}

// Compress image before upload — critical for mobile
function compressImage(file: File, maxWidth = 1200, quality = 0.75): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;
      if (width > maxWidth) {
        height = (height / width) * maxWidth;
        width = maxWidth;
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => blob ? resolve(blob) : reject(new Error('Compression failed')),
        'image/jpeg',
        quality
      );
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

export default function PhotoGallery({ locale }: PhotoGalleryProps) {
  const [photos, setPhotos] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadCount, setUploadCount] = useState({ done: 0, total: 0 });
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [loadingPhotos, setLoadingPhotos] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const touchStartX = useRef(0);

  // Listen to Firestore for real-time photo updates
  useEffect(() => {
    const q = query(collection(db, 'photos'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const urls = snapshot.docs.map((doc) => doc.data().url as string);
      setPhotos(urls);
      setLoadingPhotos(false);
    }, () => {
      setLoadingPhotos(false);
    });
    return () => unsubscribe();
  }, []);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') setLightboxIndex((i) => i !== null ? Math.min(i + 1, photos.length - 1) : null);
      if (e.key === 'ArrowLeft') setLightboxIndex((i) => i !== null ? Math.max(i - 1, 0) : null);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxIndex, photos.length]);

  // Upload files one by one (sequential to avoid saturating mobile connection)
  const uploadFiles = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (fileArray.length === 0) return;

    setUploading(true);
    setUploadCount({ done: 0, total: fileArray.length });

    for (let i = 0; i < fileArray.length; i++) {
      try {
        const compressed = await compressImage(fileArray[i]);
        const formData = new FormData();
        formData.append('file', compressed, 'photo.jpg');
        formData.append('upload_preset', UPLOAD_PRESET);
        formData.append('folder', FOLDER);

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
          { method: 'POST', body: formData }
        );
        const data = await res.json();
        const url = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_800,q_auto,f_auto/${data.public_id}`;

        await addDoc(collection(db, 'photos'), {
          url,
          publicId: data.public_id,
          createdAt: new Date()
        });

        setUploadCount({ done: i + 1, total: fileArray.length });
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }

    setUploading(false);
    setUploadCount({ done: 0, total: 0 });
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, []);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) uploadFiles(e.target.files);
  };

  // Swipe handlers for lightbox on mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 60) {
      if (diff > 0 && lightboxIndex !== null && lightboxIndex < photos.length - 1) {
        setLightboxIndex(lightboxIndex + 1);
      } else if (diff < 0 && lightboxIndex !== null && lightboxIndex > 0) {
        setLightboxIndex(lightboxIndex - 1);
      }
    }
  };

  return (
    <section className="max-w-5xl mx-auto px-3 sm:px-4 py-4">
      {/* Upload area — compact on mobile */}
      <div className="relative rounded-2xl sm:rounded-[28px] border-2 border-dashed border-blue-200 bg-white overflow-hidden">
        {/* Progress bar */}
        {uploading && (
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-blue-100 z-10">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full"
              animate={{ width: `${uploadCount.total > 0 ? (uploadCount.done / uploadCount.total) * 100 : 0}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        )}

        <label className="flex items-center gap-4 p-5 sm:p-6 cursor-pointer active:bg-blue-50 transition-colors">
          <div className={`w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-full flex items-center justify-center transition-all ${
            uploading ? 'bg-blue-100' : 'bg-blue-50'
          }`}>
            {uploading ? (
              <Loader2 size={24} className="text-blue-500 animate-spin" />
            ) : (
              <Camera size={24} className="text-blue-500" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-slate-700 text-sm sm:text-base">
              {uploading
                ? `${t(locale, 'galleryUploading')} ${uploadCount.done}/${uploadCount.total}`
                : t(locale, 'galleryUploadBtn')
              }
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              {uploading
                ? t(locale, 'galleryPleaseWait')
                : t(locale, 'galleryTapToSelect')
              }
            </p>
          </div>
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

      {/* Photo counter */}
      {photos.length > 0 && (
        <div className="flex items-center gap-2 mt-6 mb-3 px-1">
          <ImageIcon size={14} className="text-blue-400" />
          <span className="text-xs sm:text-sm font-medium text-slate-500">
            {photos.length} {photos.length === 1
              ? (locale === 'ro' ? 'fotografie' : 'foto')
              : (locale === 'ro' ? 'fotografii' : 'fotos')
            }
          </span>
        </div>
      )}

      {/* Photo grid */}
      <div className="mt-3">
        {loadingPhotos ? (
          <div className="flex items-center justify-center py-16 text-blue-400">
            <Loader2 size={24} className="animate-spin" />
          </div>
        ) : photos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-300">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-3">
              <ImageIcon size={32} className="text-blue-200" />
            </div>
            <p className="text-sm text-slate-400 text-center">{t(locale, 'galleryEmpty')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 gap-1.5 sm:gap-2">
            {/* Add photo card */}
            <label className="aspect-square rounded-xl sm:rounded-2xl border-2 border-dashed border-blue-200 flex flex-col items-center justify-center gap-1 cursor-pointer active:bg-blue-50 transition-all">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Plus size={18} className="text-blue-500" />
              </div>
              <span className="text-[10px] sm:text-xs font-medium text-blue-400">{t(locale, 'galleryAddMore')}</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>

            {photos.map((url, i) => (
              <button
                key={url}
                onClick={() => setLightboxIndex(i)}
                className="aspect-square rounded-xl sm:rounded-2xl overflow-hidden active:scale-95 transition-transform shadow-sm"
              >
                <img
                  src={url}
                  alt={`${t(locale, 'galleryPhotoAlt')} ${i + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
            onClick={() => setLightboxIndex(null)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Close */}
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-4 right-4 w-9 h-9 bg-white/10 rounded-full flex items-center justify-center text-white z-10"
              aria-label={t(locale, 'galleryClose')}
            >
              <X size={20} />
            </button>

            {/* Counter */}
            <div className="absolute top-4 left-4 px-3 py-1 bg-white/10 rounded-full text-white text-xs font-medium z-10">
              {lightboxIndex + 1} / {photos.length}
            </div>

            {/* Navigation arrows — hidden on mobile (use swipe) */}
            {lightboxIndex > 0 && (
              <button
                onClick={(e) => { e.stopPropagation(); setLightboxIndex(lightboxIndex - 1); }}
                className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 rounded-full items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
                aria-label="Previous"
              >
                <ChevronLeft size={22} />
              </button>
            )}
            {lightboxIndex < photos.length - 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); setLightboxIndex(lightboxIndex + 1); }}
                className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 rounded-full items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
                aria-label="Next"
              >
                <ChevronRight size={22} />
              </button>
            )}

            {/* Image */}
            <AnimatePresence mode="wait">
              <motion.img
                key={photos[lightboxIndex]}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                src={photos[lightboxIndex].replace('/w_800,', '/w_1600,')}
                alt=""
                className="max-w-full max-h-[90vh] object-contain px-2"
                onClick={(e) => e.stopPropagation()}
              />
            </AnimatePresence>

            {/* Swipe hint on mobile */}
            <div className="absolute bottom-6 left-0 right-0 text-center sm:hidden">
              <span className="text-white/40 text-xs">{t(locale, 'gallerySwipe')}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
