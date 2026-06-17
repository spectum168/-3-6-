/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useRef, useEffect, useState } from 'react';
import { RotateCw, CheckCircle2 } from 'lucide-react';

interface SignaturePadProps {
  label: string;
  sublabel: string;
  canvasId: string;
  value?: string;
  onSave: (base64: string) => void;
  onClear: () => void;
}

export default function SignaturePad({ label, sublabel, canvasId, value, onSave, onClear }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hasSigned, setHasSigned] = useState(false);
  const isDrawing = useRef(false);

  const onSaveRef = useRef(onSave);
  const onClearRef = useRef(onClear);
  const lastSavedValueRef = useRef<string | null>(null);

  useEffect(() => {
    onSaveRef.current = onSave;
  }, [onSave]);

  useEffect(() => {
    onClearRef.current = onClear;
  }, [onClear]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resizing relative to container width without losing content
    const handleResize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        const newWidth = parent.clientWidth;
        const newHeight = 176; // Default standard height

        if (canvas.width !== newWidth || canvas.height !== newHeight) {
          let tempImgData: string | null = null;
          try {
            if (canvas.width > 0 && canvas.height > 0) {
              tempImgData = canvas.toDataURL('image/png');
            }
          } catch (e) {
            // ignore
          }

          canvas.width = newWidth;
          canvas.height = newHeight;
          ctx.lineWidth = 2.5;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.strokeStyle = '#1e3a8a'; // Institutional Navy blue sign

          if (tempImgData) {
            const img = new Image();
            img.onload = () => {
              ctx.drawImage(img, 0, 0);
            };
            img.src = tempImgData;
          } else if (value) {
            const img = new Image();
            img.onload = () => {
              ctx.drawImage(img, 0, 0);
            };
            img.src = value;
          }
        }
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const getCoordinates = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      if ('touches' in e) {
        if (e.touches.length > 0) {
          return {
            x: e.touches[0].clientX - rect.left,
            y: e.touches[0].clientY - rect.top,
          };
        }
      } else {
        return {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        };
      }
      return null;
    };

    const startDraw = (e: MouseEvent | TouchEvent) => {
      const coords = getCoordinates(e);
      if (!coords) return;
      isDrawing.current = true;
      ctx.beginPath();
      ctx.moveTo(coords.x, coords.y);
      setHasSigned(true);
      if (e.cancelable) e.preventDefault();
    };

    const draw = (e: MouseEvent | TouchEvent) => {
      if (!isDrawing.current) return;
      const coords = getCoordinates(e);
      if (!coords) return;
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
      if (e.cancelable) e.preventDefault();
    };

    const stopDraw = () => {
      if (isDrawing.current) {
        isDrawing.current = false;
        ctx.closePath();
        const dataUrl = canvas.toDataURL('image/png');
        lastSavedValueRef.current = dataUrl;
        onSaveRef.current(dataUrl);
      }
    };

    // Attach mouse interaction
    canvas.addEventListener('mousedown', startDraw);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDraw);
    canvas.addEventListener('mouseleave', stopDraw);

    // Attach touchscreen events
    canvas.addEventListener('touchstart', startDraw, { passive: false });
    canvas.addEventListener('touchmove', draw, { passive: false });
    canvas.addEventListener('touchend', stopDraw);

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousedown', startDraw);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseup', stopDraw);
      canvas.removeEventListener('mouseleave', stopDraw);
      canvas.removeEventListener('touchstart', startDraw);
      canvas.removeEventListener('touchmove', draw);
      canvas.removeEventListener('touchend', stopDraw);
    };
  }, [value]);

  // Watch signature value prop from top level explicitly and sync canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (value && value !== lastSavedValueRef.current) {
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        setHasSigned(true);
      };
      img.src = value;
    } else if (!value) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setHasSigned(false);
      lastSavedValueRef.current = null;
    } else {
      setHasSigned(true);
    }
  }, [value]);

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSigned(false);
    lastSavedValueRef.current = null;
    onClearRef.current();
  };

  return (
    <div className="flex flex-col w-full" id={`signature-container-${canvasId}`}>
      <div className="flex justify-between items-center mb-2">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
          {label}
        </label>
        {hasSigned ? (
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" /> ลงนามแล้ว ✓
          </span>
        ) : (
          <span className="text-[10px] text-slate-400">ยังไม่ลงทะเบียน</span>
        )}
      </div>

      <div className="relative w-full">
        <canvas
          id={canvasId}
          ref={canvasRef}
          className="border-2 border-dashed border-slate-200 bg-slate-50/50 hover:bg-slate-50/30 rounded-xl transition-all cursor-crosshair shadow-inner h-44"
          style={{ touchAction: 'none' }}
        />
      </div>

      <div className="mt-2.5 flex items-center justify-between">
        <span className="text-[10px] text-slate-400 italic">
          {sublabel}
        </span>
        <button
          type="button"
          onClick={handleClear}
          className="px-2.5 py-1 text-xs border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-800 bg-white hover:bg-slate-50 rounded-lg flex items-center gap-1 transition-all focus:outline-none"
        >
          <RotateCw className="w-3 h-3" /> ล้างหน้าจอเซ็นใหม่
        </button>
      </div>
    </div>
  );
}
