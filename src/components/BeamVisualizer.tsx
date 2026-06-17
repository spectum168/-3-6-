/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CheckCircle, AlertTriangle } from 'lucide-react';

interface BeamVisualizerProps {
  sid: number;
  errorX: number;
  errorY: number;
}

export default function BeamVisualizer({ sid, errorX, errorY }: BeamVisualizerProps) {
  // 2% of SID is the tolerance threshold limit
  const toleranceLimit = (2 / 100) * sid;
  const maxError = Math.max(Math.abs(errorX), Math.abs(errorY));
  const isPass = maxError <= toleranceLimit;

  // Coordinate scales for SVG (centered around 100, 100).
  // Visual limit boundary rect size is 80x80 inside 200x200 viewport.
  // 40px corresponds to the tolerance limit size.
  // Scale factor translates cm to SVG pixel offset: limit cm maps to 40px.
  const scale = toleranceLimit > 0 ? 40 / toleranceLimit : 40;
  const targetOffsetX = errorX * scale;
  const targetOffsetY = -errorY * scale; // Cartesian upwards Y maps to negative SVG Y

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center" id="collimator-visualization-block">
      {/* Inputs Calculations Scorecard */}
      <div className="md:col-span-5 space-y-4">
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3.5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500 font-medium">เกณฑ์คลาดเคลื่อนปลอดภัย (2% ของ SID)</span>
            <span className="font-bold text-slate-800 bg-amber-100/60 text-amber-800 px-2.5 py-0.5 rounded-full" id="collimator-limit-label">
              ±{toleranceLimit.toFixed(1)} cm
            </span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500 font-medium">ค่าเบี่ยงเบนแนวพิกัดสูงสุดที่วัดได้</span>
            <span className={`font-bold px-2.5 py-0.5 rounded-full ${isPass ? 'text-emerald-800 bg-emerald-50' : 'text-rose-800 bg-rose-50'}`} id="collimator-actual-error-label">
              {maxError.toFixed(1)} cm
            </span>
          </div>

          <div
            id="collimator-status-badge"
            className={`py-3 rounded-xl flex items-center justify-center gap-2 text-white font-bold tracking-wider text-xs shadow-sm transition-all duration-300 ${
              isPass
                ? 'bg-emerald-600 shadow-emerald-100'
                : 'bg-red-600 shadow-red-100'
            }`}
          >
            {isPass ? (
              <>
                <CheckCircle className="w-4 h-4 text-emerald-100" /> ผ่านมาตรฐานตามเกณฑ์ (PASS)
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4 text-red-100 animate-bounce" /> ตกเกณฑ์ด้านพิกัด (FAIL)
              </>
            )}
          </div>
        </div>
      </div>

      {/* SVG Real-time alignment simulation graphic */}
      <div className="md:col-span-7 flex flex-col items-center justify-center p-5 bg-slate-900 border border-slate-800 rounded-xl max-w-sm mx-auto w-full relative overflow-hidden shadow-inner">
        <span className="absolute top-3 left-4 text-slate-500 text-[9px] font-mono uppercase tracking-widest">
          Collimator Target Sim
        </span>

        <svg viewBox="0 0 200 200" className="w-48 h-48 mt-3" id="beam-alignment-svg">
          {/* Circular dial grids */}
          <circle cx="100" cy="100" r="90" stroke="rgba(255,255,255,0.03)" strokeWidth="1.5" fill="none" />
          <circle cx="100" cy="100" r="65" stroke="rgba(255,255,255,0.05)" strokeWidth="1.5" fill="none" />
          <line x1="100" y1="10" x2="100" y2="190" stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="3,3" />
          <line x1="10" y1="100" x2="190" y2="100" stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="3,3" />

          {/* Yellow Safety Limit Box (2% border) */}
          <rect
            x="60"
            y="60"
            width="80"
            height="80"
            stroke="#eab308"
            strokeWidth="1.2"
            strokeDasharray="4,3"
            fill="rgba(234,179,8,0.02)"
            id="collimator-safety-rect"
          />
          <text x="144" y="65" fill="#eab308" fontSize="5.5" fontWeight="semibold" fontFamily="sans-serif">
            LIMIT (2%)
          </text>

          {/* Core visual target dot */}
          <circle cx="100" cy="100" r="4.5" fill="#3b82f6" />
          <circle cx="100" cy="100" r="25" stroke="rgba(59,130,246,0.12)" strokeWidth="1.2" fill="none" />

          {/* Real simulated beam offset */}
          <rect
            x={100 + targetOffsetX - 12}
            y={100 + targetOffsetY - 12}
            width="24"
            height="24"
            stroke={isPass ? '#10b981' : '#f43f5e'}
            strokeWidth="2"
            fill={isPass ? 'rgba(16,185,129,0.12)' : 'rgba(244,63,94,0.12)'}
            className="transition-all duration-300"
            id="collimator-beam-offset-box"
          />
          <circle
            cx={100 + targetOffsetX}
            cy={100 + targetOffsetY}
            r="3"
            fill={isPass ? '#10b981' : '#f43f5e'}
            className="transition-all duration-300"
            id="collimator-beam-offset-point"
          />
        </svg>

        <div className="mt-4 text-center">
          <p className="text-[10px] font-medium text-slate-400">
            แกนพิกัดค่าคลาดเคลื่อนวัดจริง: X = <strong className={isPass ? 'text-emerald-400' : 'text-rose-400'}>{errorX.toFixed(1)} cm</strong>, Y = <strong className={isPass ? 'text-emerald-400' : 'text-rose-400'}>{errorY.toFixed(1)} cm</strong>
          </p>
          <span className="text-[9px] text-slate-600 block mt-0.5">
            กรอบประจุดสีเหลืองคือกรอบความปลอดภัยขีดจำกัดสูงสุด
          </span>
        </div>
      </div>
    </div>
  );
}
