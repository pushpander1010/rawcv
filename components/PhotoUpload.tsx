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
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });
  const [displaySize, setDisplaySize] = useState({ width: 0, height: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const renderedImageRef = useRef<{ width: number; height: number }>({ width: 0, height: 0 });
  const lastDragEndRef = useRef(0);

  // Drag state
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
    const natW = img.naturalWidth;
    const natH = img.naturalHeight;
    setNaturalSize({ width: natW, height: natH });

    // Compute actual rendered size from the element
    const displayW = img.clientWidth;
    const displayH = img.clientHeight;
    setDisplaySize({ width: displayW, height: displayH });
    renderedImageRef.current = { width: displayW, height: displayH };

    // Set initial crop to center 80% of display area
    const size = Math.min(displayW, displayH) * 0.8;
    setCropArea({
      x: (displayW - size) / 2,
      y: (displayH - size) / 2,
      width: size,
      height: size,
    });
  }, []);

  // Convert display crop to percentages for overlay positioning
  const getCropDisplay = useCallback(() => {
    if (displaySize.width === 0 || displaySize.height === 0) return null;
    return {
      left: (cropArea.x / displaySize.width) * 100,
      top: (cropArea.y / displaySize.height) * 100,
      width: (cropArea.width / displaySize.width) * 100,
      height: (cropArea.height / displaySize.height) * 100,
    };
  }, [cropArea, displaySize]);

  // Unified pointer down handler for move + all 8 resize handles
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

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragRef.current || displaySize.width === 0) return;
    e.preventDefault();

    // The crop is in display pixels, so we compute delta in display pixels
    // But the image has zoom transform — we need to account for that
    const imgEl = imgRef.current;
    if (!imgEl) return;

    // The image is rendered with CSS transform scale(zoom).
    // clientWidth/clientHeight don't change with CSS transforms,
    // so the actual on-screen size is displaySize * zoom.
    const onScreenW = displaySize.width * zoom;
    const onScreenH = displaySize.height * zoom;
    const scaleX = displaySize.width / onScreenW;
    const scaleY = displaySize.height / onScreenH;

    const dx = (e.clientX - dragRef.current.startX) * scaleX;
    const dy = (e.clientY - dragRef.current.startY) * scaleY;

    const { type, startCrop } = dragRef.current;
    const MIN_SIZE = 30;

    let newCrop = { ...startCrop };

    if (type === "move") {
      newCrop.x = clamp(startCrop.x + dx, 0, displaySize.width - startCrop.width);
      newCrop.y = clamp(startCrop.y + dy, 0, displaySize.height - startCrop.height);
    } else if (type === "br") {
      newCrop.width = clamp(startCrop.width + dx, MIN_SIZE, displaySize.width - startCrop.x);
      newCrop.height = clamp(startCrop.height + dy, MIN_SIZE, displaySize.height - startCrop.y);
    } else if (type === "tl") {
      const w = clamp(startCrop.width - dx, MIN_SIZE, startCrop.x + startCrop.width);
      const h = clamp(startCrop.height - dy, MIN_SIZE, startCrop.y + startCrop.height);
      newCrop.x = startCrop.x + startCrop.width - w;
      newCrop.y = startCrop.y + startCrop.height - h;
      newCrop.width = w;
      newCrop.height = h;
    } else if (type === "tr") {
      newCrop.width = clamp(startCrop.width + dx, MIN_SIZE, displaySize.width - startCrop.x);
      const h = clamp(startCrop.height - dy, MIN_SIZE, startCrop.y + startCrop.height);
      newCrop.y = startCrop.y + startCrop.height - h;
      newCrop.height = h;
    } else if (type === "bl") {
      const w = clamp(startCrop.width - dx, MIN_SIZE, startCrop.x + startCrop.width);
      newCrop.x = startCrop.x + startCrop.width - w;
      newCrop.width = w;
      newCrop.height = clamp(startCrop.height + dy, MIN_SIZE, displaySize.height - startCrop.y);
    } else if (type === "t") {
      const h = clamp(startCrop.height - dy, MIN_SIZE, startCrop.y + startCrop.height);
      newCrop.y = startCrop.y + startCrop.height - h;
      newCrop.height = h;
    } else if (type === "b") {
      newCrop.height = clamp(startCrop.height + dy, MIN_SIZE, displaySize.height - startCrop.y);
    } else if (type === "l") {
      const w = clamp(startCrop.width - dx, MIN_SIZE, startCrop.x + startCrop.width);
      newCrop.x = startCrop.x + startCrop.width - w;
      newCrop.width = w;
    } else if (type === "r") {
      newCrop.width = clamp(startCrop.width + dx, MIN_SIZE, displaySize.width - startCrop.x);
    }

    setCropArea(newCrop);
  }, [displaySize, zoom]);

  const handlePointerUp = useCallback(() => {
    dragRef.current = null;
    lastDragEndRef.current = Date.now();
  }, []);

  // Click on image to reposition crop center
  const handleCropClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (dragRef.current) return;
    if (Date.now() - lastDragEndRef.current < 150) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    // Convert screen coords to display coords (accounting for zoom)
    const relX = (x / rect.width) * displaySize.width;
    const relY = (y / rect.height) * displaySize.height;

    setCropArea((prev) => ({
      ...prev,
      x: clamp(relX - prev.width / 2, 0, displaySize.width - prev.width),
      y: clamp(relY - prev.height / 2, 0, displaySize.height - prev.height),
    }));
  }, [displaySize]);

  const applyCrop = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img || naturalSize.width === 0 || displaySize.width === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Convert display crop coords back to natural image coords
    const scaleX = naturalSize.width / displaySize.width;
    const scaleY = naturalSize.height / displaySize.height;

    // When zoomed, the visible area is smaller — account for zoom
    const visibleNatW = (displaySize.width / zoom) * scaleX;
    const visibleNatH = (displaySize.height / zoom) * scaleY;
    const visibleNatX = ((displaySize.width - displaySize.width / zoom) / 2) * scaleX;
    const visibleNatY = ((displaySize.height - displaySize.height / zoom) / 2) * scaleY;

    // Crop area in natural coords, clamped to visible area
    const srcX = clamp(visibleNatX + (cropArea.x / displaySize.width) * visibleNatW, 0, naturalSize.width);
    const srcY = clamp(visibleNatY + (cropArea.y / displaySize.height) * visibleNatH, 0, naturalSize.height);
    const srcW = (cropArea.width / displaySize.width) * visibleNatW;
    const srcH = (cropArea.height / displaySize.height) * visibleNatH;

    const outputSize = 400;
    canvas.width = outputSize;
    canvas.height = outputSize;

    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;

    ctx.save();
    ctx.translate(outputSize / 2, outputSize / 2);
    ctx.rotate((rotation * Math.PI) / 180);

    // Fit the cropped region into the square output
    const fitScale = Math.min(outputSize / srcW, outputSize / srcH);

    ctx.drawImage(
      img,
      srcX, srcY, srcW, srcH,
      (-srcW * fitScale) / 2,
      (-srcH * fitScale) / 2,
      srcW * fitScale,
      srcH * fitScale,
    );
    ctx.restore();

    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    setPreview(dataUrl);
    setState((prev) => ({ ...prev, userPhoto: dataUrl }));
    onPhotoChange?.(dataUrl);
    setShowCropModal(false);
    setOriginalImage(null);
  }, [cropArea, zoom, rotation, brightness, contrast, naturalSize, displaySize, setState, onPhotoChange]);

  const removePhoto = useCallback(() => {
    setPreview(null);
    setState((prev) => ({ ...prev, userPhoto: null }));
    onPhotoChange?.(null);
  }, [setState, onPhotoChange]);

  const cancelCrop = useCallback(() => {
    setShowCropModal(false);
    setOriginalImage(null);
  }, []);

  const cropDisplay = getCropDisplay();

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

            {/* Image preview with crop overlay */}
            <div className="p-5">
              <div
                className="relative rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 select-none"
                style={{
                  // Constrain container to fit in modal
                  maxHeight: "50vh",
                }}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
                onClick={handleCropClick}
              >
                <img
                  src={originalImage}
                  alt="Original"
                  onLoad={handleImageLoad}
                  className="w-full h-auto pointer-events-none"
                  style={{
                    maxHeight: "50vh",
                    objectFit: "contain",
                    filter: `brightness(${brightness}%) contrast(${contrast}%)`,
                    transform: `rotate(${rotation}deg) scale(${zoom})`,
                    transformOrigin: "center center",
                  }}
                  draggable={false}
                />

                {/* Dark overlay outside crop area */}
                {cropDisplay && displaySize.width > 0 && (
                  <>
                    {/* Dim overlay using 4 rectangles around the crop area */}
                    <div className="absolute inset-0 bg-black/50 pointer-events-none" />
                    {/* Clear the crop area by putting the image back on top */}
                    <div
                      className="absolute overflow-hidden pointer-events-none"
                      style={{
                        left: `${cropDisplay.left}%`,
                        top: `${cropDisplay.top}%`,
                        width: `${cropDisplay.width}%`,
                        height: `${cropDisplay.height}%`,
                      }}
                    >
                      <img
                        src={originalImage}
                        alt=""
                        className="absolute pointer-events-none"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          filter: `brightness(${brightness}%) contrast(${contrast}%)`,
                        }}
                        draggable={false}
                      />
                    </div>

                    {/* Crop border */}
                    <div
                      className="absolute border-2 border-white shadow-lg pointer-events-none"
                      style={{
                        left: `${cropDisplay.left}%`,
                        top: `${cropDisplay.top}%`,
                        width: `${cropDisplay.width}%`,
                        height: `${cropDisplay.height}%`,
                      }}
                    />

                    {/* Drag handle: move (center) */}
                    <div
                      className="absolute cursor-move"
                      style={{
                        left: `${cropDisplay.left}%`,
                        top: `${cropDisplay.top}%`,
                        width: `${cropDisplay.width}%`,
                        height: `${cropDisplay.height}%`,
                      }}
                      onPointerDown={(e) => handlePointerDown(e, "move")}
                    />

                    {/* Corner handles */}
                    <Handle pos="tl" display={cropDisplay} onDown={handlePointerDown} />
                    <Handle pos="tr" display={cropDisplay} onDown={handlePointerDown} />
                    <Handle pos="bl" display={cropDisplay} onDown={handlePointerDown} />
                    <Handle pos="br" display={cropDisplay} onDown={handlePointerDown} />

                    {/* Edge handles */}
                    <Handle pos="t" display={cropDisplay} onDown={handlePointerDown} />
                    <Handle pos="b" display={cropDisplay} onDown={handlePointerDown} />
                    <Handle pos="l" display={cropDisplay} onDown={handlePointerDown} />
                    <Handle pos="r" display={cropDisplay} onDown={handlePointerDown} />

                    {/* Grid lines (rule of thirds) */}
                    <div className="absolute pointer-events-none" style={{
                      left: `${cropDisplay.left}%`, top: `${cropDisplay.top}%`,
                      width: `${cropDisplay.width}%`, height: `${cropDisplay.height}%`,
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

            {/* Editing controls */}
            <div className="px-5 space-y-4">
              <Slider label="Zoom" value={zoom} min={0.5} max={3} step={0.1}
                displayValue={`${zoom.toFixed(1)}x`}
                onChange={setZoom} />
              <Slider label="Rotation" value={rotation} min={-180} max={180} step={5}
                displayValue={`${rotation}°`}
                onChange={setRotation} />
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

function Handle({ pos, display, onDown }: {
  pos: HandlePos;
  display: { left: number; top: number; width: number; height: number };
  onDown: (e: React.PointerEvent, type: HandlePos) => void;
}) {
  const style: React.CSSProperties = {
    position: "absolute",
    pointerEvents: "auto" as const,
    zIndex: 20,
  };

  const SIZE = 16;
  const DOT = 10;

  const cursors: Record<HandlePos, string> = {
    tl: "nwse-resize", tr: "nesw-resize", bl: "nesw-resize", br: "nwse-resize",
    t: "ns-resize", b: "ns-resize", l: "ew-resize", r: "ew-resize",
  };

  const offset = -DOT / 2;
  switch (pos) {
    case "tl":
      style.left = `calc(${display.left}% + ${offset}px)`;
      style.top = `calc(${display.top}% + ${offset}px)`;
      break;
    case "tr":
      style.left = `calc(${display.left}% + ${display.width}% + ${offset}px)`;
      style.top = `calc(${display.top}% + ${offset}px)`;
      break;
    case "bl":
      style.left = `calc(${display.left}% + ${offset}px)`;
      style.top = `calc(${display.top}% + ${display.height}% + ${offset}px)`;
      break;
    case "br":
      style.left = `calc(${display.left}% + ${display.width}% + ${offset}px)`;
      style.top = `calc(${display.top}% + ${display.height}% + ${offset}px)`;
      break;
    case "t":
      style.left = `calc(${display.left}% + ${display.width}% / 2 + ${offset}px)`;
      style.top = `calc(${display.top}% + ${offset}px)`;
      break;
    case "b":
      style.left = `calc(${display.left}% + ${display.width}% / 2 + ${offset}px)`;
      style.top = `calc(${display.top}% + ${display.height}% + ${offset}px)`;
      break;
    case "l":
      style.left = `calc(${display.left}% + ${offset}px)`;
      style.top = `calc(${display.top}% + ${display.height}% / 2 + ${offset}px)`;
      break;
    case "r":
      style.left = `calc(${display.left}% + ${display.width}% + ${offset}px)`;
      style.top = `calc(${display.top}% + ${display.height}% / 2 + ${offset}px)`;
      break;
  }

  return (
    <div
      style={{ ...style, width: SIZE, height: SIZE, cursor: cursors[pos] }}
      onPointerDown={(e) => onDown(e, pos)}
    >
      <div
        className="bg-white border-2 border-violet-500 rounded-full shadow-md"
        style={{ width: DOT, height: DOT, margin: (SIZE - DOT) / 2 }}
      />
    </div>
  );
}
