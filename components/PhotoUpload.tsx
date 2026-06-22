"use client";

import { useState, useRef, useCallback } from "react";
import { useResume } from "@/context/ResumeContext";

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Props {
  onPhotoChange?: (photo: string | null) => void;
}

export default function PhotoUpload({ onPhotoChange }: Props) {
  const { state, setState } = useResume();
  const [preview, setPreview] = useState<string | null>(state.userPhoto);
  const [isDragging, setIsDragging] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [cropArea, setCropArea] = useState<CropArea>({ x: 0, y: 0, width: 100, height: 100 });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be under 5 MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setOriginalImage(dataUrl);
      setShowCropModal(true);
      // Reset editing state
      setZoom(1);
      setRotation(0);
      setBrightness(100);
      setContrast(100);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    imgRef.current = img;
    setImageSize({ width: img.naturalWidth, height: img.naturalHeight });
    // Default crop to center square
    const size = Math.min(img.naturalWidth, img.naturalHeight);
    setCropArea({
      x: (img.naturalWidth - size) / 2,
      y: (img.naturalHeight - size) / 2,
      width: size,
      height: size,
    });
  }, []);

  const applyCrop = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const outputSize = 400; // Fixed output size for consistency
    canvas.width = outputSize;
    canvas.height = outputSize;

    // Apply filters
    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;

    // Handle rotation
    ctx.save();
    ctx.translate(outputSize / 2, outputSize / 2);
    ctx.rotate((rotation * Math.PI) / 180);

    // Draw cropped and zoomed region
    const scaleX = outputSize / (cropArea.width / zoom);
    const scaleY = outputSize / (cropArea.height / zoom);
    const scale = Math.min(scaleX, scaleY);

    ctx.drawImage(
      img,
      cropArea.x, cropArea.y, cropArea.width, cropArea.height,
      (-cropArea.width * scale) / 2,
      (-cropArea.height * scale) / 2,
      cropArea.width * scale,
      cropArea.height * scale,
    );
    ctx.restore();

    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    setPreview(dataUrl);
    setState((prev) => ({ ...prev, userPhoto: dataUrl }));
    onPhotoChange?.(dataUrl);
    setShowCropModal(false);
    setOriginalImage(null);
  }, [cropArea, zoom, rotation, brightness, contrast, setState, onPhotoChange]);

  const removePhoto = useCallback(() => {
    setPreview(null);
    setState((prev) => ({ ...prev, userPhoto: null }));
    onPhotoChange?.(null);
  }, [setState, onPhotoChange]);

  const cancelCrop = useCallback(() => {
    setShowCropModal(false);
    setOriginalImage(null);
  }, []);

  // Simple click-to-crop handler for the modal
  const handleCropClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const relX = (x / rect.width) * imageSize.width;
    const relY = (y / rect.height) * imageSize.height;

    const size = Math.min(imageSize.width, imageSize.height) * 0.7;
    setCropArea({
      x: Math.max(0, Math.min(relX - size / 2, imageSize.width - size)),
      y: Math.max(0, Math.min(relY - size / 2, imageSize.height - size)),
      width: size,
      height: size,
    });
  }, [imageSize]);

  return (
    <div className="space-y-4">
      {/* Current photo preview */}
      {preview && !showCropModal && (
        <div className="flex items-center gap-4">
          <div className="relative group">
            <img
              src={preview}
              alt="Profile photo"
              className="w-24 h-24 rounded-2xl object-cover border-2 border-violet-200 dark:border-violet-800 shadow-md"
            />
            <button
              type="button"
              onClick={removePhoto}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
              aria-label="Remove photo"
            >
              ×
            </button>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Profile photo</p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">
              This photo will be used in resume themes that support photos.
            </p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-2 text-xs font-bold text-violet-600 dark:text-violet-400 hover:underline"
            >
              Replace photo
            </button>
          </div>
        </div>
      )}

      {/* Upload area */}
      {!preview && !showCropModal && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200
            ${isDragging
              ? "border-violet-500 bg-violet-50 dark:bg-violet-950/20"
              : "border-gray-250 dark:border-gray-700 hover:border-violet-400 dark:hover:border-violet-600 hover:bg-violet-50/50 dark:hover:bg-violet-950/10"
            }`}
        >
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-2xl bg-violet-50 dark:bg-violet-950/30 flex items-center justify-center text-3xl border border-violet-100/50 dark:border-violet-900/20">
              📷
            </div>
            <div>
              <p className="text-sm font-bold text-gray-700 dark:text-gray-300">
                Upload your photo
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                Drag & drop or click to browse. JPG/PNG, max 5 MB.
              </p>
              <p className="text-xs text-violet-500 dark:text-violet-400 font-semibold mt-2">
                This photo will be used in resumes with photo support
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />

      {/* Crop/Edit Modal */}
      {showCropModal && originalImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="p-5 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Edit Photo</h3>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                Click on the image to reposition the crop area. Use sliders to adjust.
              </p>
            </div>

            {/* Image preview with crop overlay */}
            <div className="p-5">
              <div
                className="relative rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 cursor-crosshair"
                onClick={handleCropClick}
              >
                <img
                  src={originalImage}
                  alt="Original"
                  onLoad={handleImageLoad}
                  className="w-full h-auto max-h-64 object-contain"
                  style={{
                    filter: `brightness(${brightness}%) contrast(${contrast}%)`,
                    transform: `rotate(${rotation}deg) scale(${zoom})`,
                  }}
                />
                {/* Crop overlay */}
                {imageSize.width > 0 && (
                  <div
                    className="absolute border-2 border-violet-500 bg-violet-500/10 pointer-events-none"
                    style={{
                      left: `${(cropArea.x / imageSize.width) * 100}%`,
                      top: `${(cropArea.y / imageSize.height) * 100}%`,
                      width: `${(cropArea.width / imageSize.width) * 100}%`,
                      height: `${(cropArea.height / imageSize.height) * 100}%`,
                    }}
                  >
                    <div className="absolute inset-0 border border-white/30" />
                  </div>
                )}
              </div>
            </div>

            {/* Editing controls */}
            <div className="px-5 space-y-4">
              {/* Zoom */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                  <span>Zoom</span>
                  <span>{zoom.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.1"
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full h-1.5 rounded-full appearance-none bg-gray-200 dark:bg-gray-700 accent-violet-600 cursor-pointer"
                />
              </div>

              {/* Rotation */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                  <span>Rotation</span>
                  <span>{rotation}°</span>
                </div>
                <input
                  type="range"
                  min="-180"
                  max="180"
                  step="5"
                  value={rotation}
                  onChange={(e) => setRotation(Number(e.target.value))}
                  className="w-full h-1.5 rounded-full appearance-none bg-gray-200 dark:bg-gray-700 accent-violet-600 cursor-pointer"
                />
              </div>

              {/* Brightness */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                  <span>Brightness</span>
                  <span>{brightness}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="150"
                  step="5"
                  value={brightness}
                  onChange={(e) => setBrightness(Number(e.target.value))}
                  className="w-full h-1.5 rounded-full appearance-none bg-gray-200 dark:bg-gray-700 accent-violet-600 cursor-pointer"
                />
              </div>

              {/* Contrast */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                  <span>Contrast</span>
                  <span>{contrast}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="150"
                  step="5"
                  value={contrast}
                  onChange={(e) => setContrast(Number(e.target.value))}
                  className="w-full h-1.5 rounded-full appearance-none bg-gray-200 dark:bg-gray-700 accent-violet-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Action buttons */}
            <div className="p-5 border-t border-gray-100 dark:border-gray-800 flex gap-3">
              <button
                type="button"
                onClick={cancelCrop}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={applyCrop}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700 shadow-md shadow-violet-500/20 transition-all"
              >
                Apply & Save
              </button>
            </div>
          </div>
          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}
    </div>
  );
}
