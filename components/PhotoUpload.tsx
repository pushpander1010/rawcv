"use client";

import { useState, useRef, useCallback } from "react";
import { useResume } from "@/context/ResumeContext";

interface CropArea {
  // All values in percentages (0-100) relative to the image container
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
  const [cropArea, setCropArea] = useState<CropArea>({ x: 10, y: 10, width: 80, height: 80 });
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });
  const [displaySize, setDisplaySize] = useState({ width: 0, height: 0 });
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const lastDragEndRef = useRef(0);

  // Drag state — everything in percentage coords
  const dragRef = useRef<{
    type: "move" | "tl" | "tr" | "bl" | "br" | "t" | "b" | "l" | "r" | null;
    startX: number;
    startY: number;
    startCrop: CropArea;
  } | null>(null);

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
    const natW = img.naturalWidth;
    const natH = img.naturalHeight;
    setNaturalSize({ width: natW, height: natH });

    // Actual rendered size (no CSS transform zoom — just natural layout)
    const displayW = img.clientWidth;
    const displayH = img.clientHeight;
    setDisplaySize({ width: displayW, height: displayH });

    // Default crop: centered square, 80%
    const size = 80;
    setCropArea({
      x: (100 - size) / 2,
      y: (100 - size) / 2,
      width: size,
      height: size,
    });
  }, []);

  // Pointer down: record drag start in screen coords
  const handlePointerDown = useCallback((e: React.PointerEvent, type: "move" | "tl" | "tr" | "bl" | "br" | "t" | "b" | "l" | "r") => {
    e.preventDefault();
    e.stopPropagation();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragRef.current = {
      type,
      startX: e.clientX,
      startY: e.clientY,
      startCrop: { ...cropArea },
    };
  }, [cropArea]);

  // Pointer move: compute delta as percentage of the container's on-screen size
  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragRef.current) return;
    e.preventDefault();

    const container = (e.currentTarget as HTMLElement);
    const rect = container.getBoundingClientRect();
    const dxPercent = ((e.clientX - dragRef.current.startX) / rect.width) * 100;
    const dyPercent = ((e.clientY - dragRef.current.startY) / rect.height) * 100;

    const { type, startCrop } = dragRef.current;
    const MIN_PCT = 5; // minimum 5% of container

    let newCrop = { ...startCrop };

    if (type === "move") {
      newCrop.x = clamp(startCrop.x + dxPercent, 0, 100 - startCrop.width);
      newCrop.y = clamp(startCrop.y + dyPercent, 0, 100 - startCrop.height);
    } else if (type === "br") {
      newCrop.width = clamp(startCrop.width + dxPercent, MIN_PCT, 100 - startCrop.x);
      newCrop.height = clamp(startCrop.height + dyPercent, MIN_PCT, 100 - startCrop.y);
    } else if (type === "tl") {
      const w = clamp(startCrop.width - dxPercent, MIN_PCT, startCrop.x + startCrop.width);
      const h = clamp(startCrop.height - dyPercent, MIN_PCT, startCrop.y + startCrop.height);
      newCrop.x = startCrop.x + startCrop.width - w;
      newCrop.y = startCrop.y + startCrop.height - h;
      newCrop.width = w;
      newCrop.height = h;
    } else if (type === "tr") {
      newCrop.width = clamp(startCrop.width + dxPercent, MIN_PCT, 100 - startCrop.x);
      const h = clamp(startCrop.height - dyPercent, MIN_PCT, startCrop.y + startCrop.height);
      newCrop.y = startCrop.y + startCrop.height - h;
      newCrop.height = h;
    } else if (type === "bl") {
      const w = clamp(startCrop.width - dxPercent, MIN_PCT, startCrop.x + startCrop.width);
      newCrop.x = startCrop.x + startCrop.width - w;
      newCrop.width = w;
      newCrop.height = clamp(startCrop.height + dyPercent, MIN_PCT, 100 - startCrop.y);
    } else if (type === "t") {
      const h = clamp(startCrop.height - dyPercent, MIN_PCT, startCrop.y + startCrop.height);
      newCrop.y = startCrop.y + startCrop.height - h;
      newCrop.height = h;
    } else if (type === "b") {
      newCrop.height = clamp(startCrop.height + dyPercent, MIN_PCT, 100 - startCrop.y);
    } else if (type === "l") {
      const w = clamp(startCrop.width - dxPercent, MIN_PCT, startCrop.x + startCrop.width);
      newCrop.x = startCrop.x + startCrop.width - w;
      newCrop.width = w;
    } else if (type === "r") {
      newCrop.width = clamp(startCrop.width + dxPercent, MIN_PCT, 100 - startCrop.x);
    }

    setCropArea(newCrop);
  }, []);

  const handlePointerUp = useCallback(() => {
    dragRef.current = null;
    lastDragEndRef.current = Date.now();
  }, []);

  // Click to reposition crop center
  const handleCropClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (dragRef.current) return;
    if (Date.now() - lastDragEndRef.current < 150) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickXPct = ((e.clientX - rect.left) / rect.width) * 100;
    const clickYPct = ((e.clientY - rect.top) / rect.height) * 100;

    setCropArea((prev) => ({
      ...prev,
      x: clamp(clickXPct - prev.width / 2, 0, 100 - prev.width),
      y: clamp(clickYPct - prev.height / 2, 0, 100 - prev.height),
    }));
  }, []);

  // Apply crop: convert percentage crop back to natural image coords and draw
  const applyCrop = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img || naturalSize.width === 0 || displaySize.width === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // The displayed image uses object-fit: contain inside the container.
    // We need to compute where the actual image pixels are within the container.
    const containerAspect = displaySize.width / displaySize.height;
    const imageAspect = naturalSize.width / naturalSize.height;

    // Compute the actual drawn region within the container (object-fit: contain)
    let drawX = 0, drawY = 0, drawW = displaySize.width, drawH = displaySize.height;
    if (imageAspect > containerAspect) {
      // Image is wider — fit to width, letterbox vertically
      drawW = displaySize.width;
      drawH = displaySize.width / imageAspect;
      drawY = (displaySize.height - drawH) / 2;
    } else {
      // Image is taller — fit to height, pillarbox horizontally
      drawH = displaySize.height;
      drawW = displaySize.height * imageAspect;
      drawX = (displaySize.width - drawW) / 2;
    }

    // Convert percentage crop to pixels within the container
    const cropXPx = (cropArea.x / 100) * displaySize.width;
    const cropYPx = (cropArea.y / 100) * displaySize.height;
    const cropWPx = (cropArea.width / 100) * displaySize.width;
    const cropHPx = (cropArea.height / 100) * displaySize.height;

    // Convert container pixels to natural image pixels
    // Only the drawX/drawY/drawW/drawH region contains image data
    const natScaleX = naturalSize.width / drawW;
    const natScaleY = naturalSize.height / drawH;

    const srcX = (cropXPx - drawX) * natScaleX;
    const srcY = (cropYPx - drawY) * natScaleY;
    const srcW = cropWPx * natScaleX;
    const srcH = cropHPx * natScaleY;

    // Clamp to natural image bounds
    const clampedX = Math.max(0, srcX);
    const clampedY = Math.max(0, srcY);
    const clampedW = Math.min(srcW, naturalSize.width - clampedX);
    const clampedH = Math.min(srcH, naturalSize.height - clampedY);

    if (clampedW <= 0 || clampedH <= 0) return;

    const outputSize = 400;
    canvas.width = outputSize;
    canvas.height = outputSize;

    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;

    // Fill with white background (in case crop doesn't fill the square)
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, outputSize, outputSize);

    // Scale the cropped region to fit the square output
    const fitScale = Math.min(outputSize / clampedW, outputSize / clampedH);
    const scaledW = clampedW * fitScale;
    const scaledH = clampedH * fitScale;
    const offsetX = (outputSize - scaledW) / 2;
    const offsetY = (outputSize - scaledH) / 2;

    ctx.drawImage(
      img,
      clampedX, clampedY, clampedW, clampedH,
      offsetX, offsetY, scaledW, scaledH,
    );

    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    setPreview(dataUrl);
    setState((prev) => ({ ...prev, userPhoto: dataUrl }));
    onPhotoChange?.(dataUrl);
    setShowCropModal(false);
    setOriginalImage(null);
  }, [cropArea, brightness, contrast, naturalSize, displaySize, setState, onPhotoChange]);

  const removePhoto = useCallback(() => {
    setPreview(null);
    setState((prev) => ({ ...prev, userPhoto: null }));
    onPhotoChange?.(null);
  }, [setState, onPhotoChange]);

  const cancelCrop = useCallback(() => {
    setShowCropModal(false);
    setOriginalImage(null);
  }, []);

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
                Drag the crop box to move it. Drag corners/edges to resize.
              </p>
            </div>

            {/* Image preview with crop overlay — percentage-based, no CSS zoom */}
            <div className="p-5">
              <div
                className="relative rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 select-none"
                style={{ maxHeight: "50vh" }}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
                onClick={handleCropClick}
              >
                {/* The actual image — no transform, just natural layout */}
                <img
                  src={originalImage}
                  alt="Original"
                  onLoad={handleImageLoad}
                  className="w-full h-auto pointer-events-none"
                  style={{
                    maxHeight: "50vh",
                    filter: `brightness(${brightness}%) contrast(${contrast}%)`,
                  }}
                  draggable={false}
                />

                {/* Crop overlay — all percentage-based on the container */}
                {displaySize.width > 0 && (
                  <>
                    {/* Dim overlay with transparent hole for crop area */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        boxShadow: `0 0 0 9999px rgba(0,0,0,0.55)`,
                        left: `${cropArea.x}%`,
                        top: `${cropArea.y}%`,
                        width: `${cropArea.width}%`,
                        height: `${cropArea.height}%`,
                      }}
                    />

                    {/* Crop border */}
                    <div
                      className="absolute border-2 border-white shadow-lg pointer-events-none"
                      style={{
                        left: `${cropArea.x}%`,
                        top: `${cropArea.y}%`,
                        width: `${cropArea.width}%`,
                        height: `${cropArea.height}%`,
                      }}
                    />

                    {/* Drag handle: move (center) */}
                    <div
                      className="absolute cursor-move"
                      style={{
                        left: `${cropArea.x}%`,
                        top: `${cropArea.y}%`,
                        width: `${cropArea.width}%`,
                        height: `${cropArea.height}%`,
                      }}
                      onPointerDown={(e) => handlePointerDown(e, "move")}
                    />

                    {/* Corner handles */}
                    <Handle pos="tl" crop={cropArea} onDown={handlePointerDown} />
                    <Handle pos="tr" crop={cropArea} onDown={handlePointerDown} />
                    <Handle pos="bl" crop={cropArea} onDown={handlePointerDown} />
                    <Handle pos="br" crop={cropArea} onDown={handlePointerDown} />

                    {/* Edge handles */}
                    <Handle pos="t" crop={cropArea} onDown={handlePointerDown} />
                    <Handle pos="b" crop={cropArea} onDown={handlePointerDown} />
                    <Handle pos="l" crop={cropArea} onDown={handlePointerDown} />
                    <Handle pos="r" crop={cropArea} onDown={handlePointerDown} />

                    {/* Grid lines (rule of thirds) */}
                    <div className="absolute pointer-events-none" style={{
                      left: `${cropArea.x}%`, top: `${cropArea.y}%`,
                      width: `${cropArea.width}%`, height: `${cropArea.height}%`,
                    }}>
                      <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white/30" />
                      <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white/30" />
                      <div className="absolute top-1/3 left-0 right-0 h-px bg-white/30" />
                      <div className="absolute top-2/3 left-0 right-0 h-px bg-white/30" />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Editing controls — brightness and contrast only (no zoom/rotation needed for a profile photo) */}
            <div className="px-5 space-y-4">
              <Slider label="Brightness" value={brightness} min={50} max={150} step={5}
                displayValue={`${brightness}%`}
                onChange={setBrightness} />
              <Slider label="Contrast" value={contrast} min={50} max={150} step={5}
                displayValue={`${contrast}%`}
                onChange={setContrast} />
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

// ─── Helpers ─────────────────────────────────────────────────────────────────

function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val));
}

function Slider({ label, value, min, max, step, displayValue, onChange }: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  displayValue: string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex justify-between text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
        <span>{label}</span>
        <span>{displayValue}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none bg-gray-200 dark:bg-gray-700 accent-violet-600 cursor-pointer"
      />
    </div>
  );
}

// ─── Crop resize handles ─────────────────────────────────────────────────────

type HandlePos = "tl" | "tr" | "bl" | "br" | "t" | "b" | "l" | "r";

function Handle({ pos, crop, onDown }: {
  pos: HandlePos;
  crop: CropArea;
  onDown: (e: React.PointerEvent, type: HandlePos) => void;
}) {
  const SIZE = 16;
  const DOT = 10;
  const offset = -DOT / 2;

  const cursors: Record<HandlePos, string> = {
    tl: "nwse-resize", tr: "nesw-resize", bl: "nesw-resize", br: "nwse-resize",
    t: "ns-resize", b: "ns-resize", l: "ew-resize", r: "ew-resize",
  };

  // Position using calc() with percentage-based crop coords
  let left: string;
  let top: string;

  switch (pos) {
    case "tl":
      left = `calc(${crop.x}% + ${offset}px)`;
      top = `calc(${crop.y}% + ${offset}px)`;
      break;
    case "tr":
      left = `calc(${crop.x}% + ${crop.width}% + ${offset}px)`;
      top = `calc(${crop.y}% + ${offset}px)`;
      break;
    case "bl":
      left = `calc(${crop.x}% + ${offset}px)`;
      top = `calc(${crop.y}% + ${crop.height}% + ${offset}px)`;
      break;
    case "br":
      left = `calc(${crop.x}% + ${crop.width}% + ${offset}px)`;
      top = `calc(${crop.y}% + ${crop.height}% + ${offset}px)`;
      break;
    case "t":
      left = `calc(${crop.x}% + ${crop.width}% / 2 + ${offset}px)`;
      top = `calc(${crop.y}% + ${offset}px)`;
      break;
    case "b":
      left = `calc(${crop.x}% + ${crop.width}% / 2 + ${offset}px)`;
      top = `calc(${crop.y}% + ${crop.height}% + ${offset}px)`;
      break;
    case "l":
      left = `calc(${crop.x}% + ${offset}px)`;
      top = `calc(${crop.y}% + ${crop.height}% / 2 + ${offset}px)`;
      break;
    case "r":
      left = `calc(${crop.x}% + ${crop.width}% + ${offset}px)`;
      top = `calc(${crop.y}% + ${crop.height}% / 2 + ${offset}px)`;
      break;
  }

  return (
    <div
      style={{ position: "absolute", left, top, width: SIZE, height: SIZE, cursor: cursors[pos], pointerEvents: "auto", zIndex: 20 }}
      onPointerDown={(e) => onDown(e, pos)}
    >
      <div
        className="bg-white border-2 border-violet-500 rounded-full shadow-md"
        style={{ width: DOT, height: DOT, margin: (SIZE - DOT) / 2 }}
      />
    </div>
  );
}
