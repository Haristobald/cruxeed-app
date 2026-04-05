"use client";

import { useRef, useState, useCallback } from "react";
import { compressImage } from "@/lib/utils";

type Props = {
  onPhotoTaken: (dataUrl: string) => void;
  onBack: () => void;
};

export default function Step3Camera({ onPhotoTaken, onBack }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState(false);
  const [loading, setLoading] = useState(false);

  const startCamera = useCallback(async () => {
    setCameraError(false);
    setLoading(true);
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1920 }, height: { ideal: 1080 } },
      });
      setStream(s);
      if (videoRef.current) {
        videoRef.current.srcObject = s;
        await videoRef.current.play();
      }
    } catch {
      setCameraError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  const stopCamera = useCallback(() => {
    stream?.getTracks().forEach((t) => t.stop());
    setStream(null);
  }, [stream]);

  const capturePhoto = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")!.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
    const compressed = await compressImage(dataUrl);
    stopCamera();
    setPreview(compressed);
  }, [stopCamera]);

  const handleFileUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = async (ev) => {
        const raw = ev.target?.result as string;
        const compressed = await compressImage(raw);
        setPreview(compressed);
      };
      reader.readAsDataURL(file);
    },
    []
  );

  const reset = () => {
    setPreview(null);
    stopCamera();
  };

  const confirm = () => {
    if (preview) onPhotoTaken(preview);
  };

  return (
    <div className="flex flex-col min-h-[85vh] px-6 pt-6 pb-10">
      <button
        onClick={() => { stopCamera(); onBack(); }}
        className="text-stone-400 text-sm mb-6 text-left hover:text-stone-700 transition-colors"
      >
        ← Retour
      </button>

      <h2 className="text-2xl font-bold text-stone-900 mb-1">Photographiez votre main</h2>
      <p className="text-sm text-stone-500 mb-6">Feuille A4 sous la main, photo de dessus.</p>

      {/* ── Preview mode ── */}
      {preview ? (
        <div className="flex-1 flex flex-col">
          <div className="relative rounded-2xl overflow-hidden border border-stone-200 flex-1 min-h-64 bg-stone-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="Aperçu" className="w-full h-full object-contain" />
          </div>
          <div className="mt-6 space-y-3">
            <button
              onClick={confirm}
              className="w-full bg-stone-900 text-white font-semibold py-4 rounded-2xl text-base hover:bg-stone-700 active:scale-95 transition-all"
            >
              Utiliser cette photo →
            </button>
            <button
              onClick={reset}
              className="w-full border border-stone-300 text-stone-700 font-medium py-3 rounded-2xl text-sm hover:bg-stone-50 transition-all"
            >
              Recommencer
            </button>
          </div>
        </div>
      ) : stream ? (
        /* ── Live camera mode ── */
        <div className="flex-1 flex flex-col">
          <div className="relative rounded-2xl overflow-hidden bg-black flex-1 min-h-64">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              playsInline
              muted
            />
            {/* Overlay guide */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="border-2 border-white border-dashed rounded-2xl opacity-50"
                style={{ width: "85%", height: "75%" }} />
              <span className="absolute bottom-6 text-white text-xs font-medium bg-black/40 px-3 py-1 rounded-full">
                Centrez votre main dans le cadre
              </span>
            </div>
          </div>
          <canvas ref={canvasRef} className="hidden" />
          <div className="mt-6 space-y-3">
            <button
              onClick={capturePhoto}
              className="w-full bg-stone-900 text-white font-semibold py-4 rounded-2xl text-base hover:bg-stone-700 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span className="text-xl">📸</span> Prendre la photo
            </button>
            <button
              onClick={stopCamera}
              className="w-full border border-stone-300 text-stone-700 font-medium py-3 rounded-2xl text-sm hover:bg-stone-50 transition-all"
            >
              Annuler
            </button>
          </div>
        </div>
      ) : (
        /* ── Initial choice ── */
        <div className="flex-1 flex flex-col justify-center gap-4">
          <button
            onClick={startCamera}
            disabled={loading}
            className="w-full bg-stone-900 text-white font-semibold py-5 rounded-2xl text-base hover:bg-stone-700 active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            <span className="text-2xl">📷</span>
            {loading ? "Ouverture de la caméra…" : "Ouvrir la caméra"}
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-stone-200" />
            <span className="text-xs text-stone-400 font-medium">ou</span>
            <div className="flex-1 h-px bg-stone-200" />
          </div>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full border-2 border-dashed border-stone-300 text-stone-600 font-medium py-5 rounded-2xl text-base hover:border-stone-500 hover:bg-stone-50 transition-all flex items-center justify-center gap-3"
          >
            <span className="text-2xl">🖼️</span>
            Importer depuis la galerie
          </button>

          {cameraError && (
            <p className="text-center text-sm text-red-500 mt-2">
              Impossible d'accéder à la caméra. Utilisez l'import depuis la galerie.
            </p>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>
      )}
    </div>
  );
}
