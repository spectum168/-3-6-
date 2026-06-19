/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, ChangeEvent } from 'react';
import { 
  ShieldCheck, 
  ClipboardList, 
  PieChart, 
  Settings, 
  Info, 
  User, 
  UserCheck, 
  Drill, 
  Plus, 
  Trash, 
  ImageUp, 
  Send, 
  Trash2, 
  Calendar, 
  CheckCircle2, 
  ShieldAlert, 
  History, 
  Activity, 
  CheckSquare, 
  Database,
  Printer,
  ChevronRight,
  Sparkles,
  Search,
  ExternalLink
} from 'lucide-react';

import { MechanicalCheck, EquipmentRow, InspectionReport } from './types';
import SignaturePad from './components/SignaturePad';
import BeamVisualizer from './components/BeamVisualizer';

// --- VISUAL HIGH-FIDELITY SAMPLE DIAGRAM COMPONENTS (100% OFFLINE & IFRAME-SAFE FALLBACKS) ---

interface CollimatorSampleSVGProps {
  sid: number;
  errorX: number;
  errorY: number;
  alignmentResult: string;
}

const CollimatorSampleSVG: React.FC<CollimatorSampleSVGProps> = ({ sid, errorX, errorY, alignmentResult }) => {
  const isPass = alignmentResult === 'PASS';
  const strokeColor = isPass ? '#10b981' : '#f43f5e';
  
  // Exaggerate errors slightly for a clear visual shift
  const offsetX = isPass ? errorX * 6 : errorX * 14;
  const offsetY = isPass ? errorY * 6 : errorY * 14;

  return (
    <div className="w-full h-full min-h-[140px] flex items-center justify-center bg-slate-900 border border-slate-700/60 rounded-lg overflow-hidden relative shadow-inner">
      <svg viewBox="0 0 200 200" className="w-full h-full p-2" strokeLinecap="round" strokeLinejoin="round">
        <defs>
          <radialGradient id="collimatorGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={isPass ? '#10b981' : '#f43f5e'} stopOpacity="0.25" />
            <stop offset="100%" stopColor={isPass ? '#10b981' : '#f43f5e'} stopOpacity="0" />
          </radialGradient>
        </defs>
        
        {/* Subtle grid pattern background */}
        <line x1="10" y1="100" x2="190" y2="100" stroke="#334155" strokeWidth="0.5" strokeDasharray="3 3" />
        <line x1="100" y1="10" x2="100" y2="190" stroke="#334155" strokeWidth="0.5" strokeDasharray="3 3" />
        <circle cx="100" cy="100" r="30" fill="none" stroke="#1e293b" strokeWidth="0.75" />
        <circle cx="100" cy="100" r="60" fill="none" stroke="#1e293b" strokeWidth="0.75" strokeDasharray="4 4" />
        <circle cx="100" cy="100" r="80" fill="none" stroke="#1e293b" strokeWidth="0.75" />

        {/* Outer alignment limit margin line (2% of SID standard) */}
        <circle cx="100" cy="100" r="70" fill="none" stroke="#475569" strokeWidth="1" strokeDasharray="1 3" />
        <text x="105" y="165" fill="#475569" fontSize="6" fontFamily="monospace">LIMIT REGION (2% SID)</text>

        {/* Center alignment boundary box */}
        <rect x="65" y="65" width="70" height="70" fill="none" stroke="#334155" strokeWidth="1" />

        {/* Light field boundary representing actual physical light (has shifted offset) */}
        <g transform={`translate(${offsetX}, ${-offsetY})`}>
          <circle cx="100" cy="100" r="42" fill="url(#collimatorGlow)" />
          <rect x="58" y="58" width="84" height="84" fill="none" stroke="#0ea5e9" strokeWidth="1.25" />
          <circle cx="100" cy="100" r="2.5" fill="#0ea5e9" />
          <line x1="100" y1="92" x2="100" y2="108" stroke="#0ea5e9" strokeWidth="0.75" />
          <line x1="92" y1="100" x2="108" y2="100" stroke="#0ea5e9" strokeWidth="0.75" />
        </g>

        {/* Target X-Ray Field perfect Center (solid static green/red lines) */}
        <circle cx="100" cy="100" r="4" fill="none" stroke={strokeColor} strokeWidth="1.5" />
        <path d="M 100,80 L 100,120 M 80,100 L 120,100" stroke={strokeColor} strokeWidth="1" />

        {/* Informative text metrics overlays on top corner */}
        <text x="12" y="24" fill="#94a3b8" fontSize="8" fontFamily="sans-serif" fontWeight="bold">COLLIMATOR ALIGNMENT</text>
        <text x="12" y="34" fill="#64748b" fontSize="7" fontFamily="monospace">SID: {sid} cm</text>
        <text x="12" y="44" fill={strokeColor} fontSize="7" fontFamily="monospace" fontWeight="bold">
          BIAS: X={errorX.toFixed(1)}cm | Y={errorY.toFixed(1)}cm
        </text>

        {/* Diagnostics badge inside bottom */}
        <g transform="translate(130, 20)">
          <rect x="0" y="0" width="55" height="16" rx="3" fill={isPass ? 'rgba(16, 185, 129, 0.12)' : 'rgba(244, 63, 94, 0.12)'} stroke={strokeColor} strokeWidth="0.75" />
          <text x="27.5" y="11" fill={strokeColor} fontSize="7" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
            {isPass ? 'QC PASS' : 'QC FAIL'}
          </text>
        </g>

        {/* Technical branding accent */}
        <text x="12" y="185" fill="#475569" fontSize="6" fontFamily="monospace">ภาพจำลองวิเคราะห์ตรวจพิกัดลําแสง</text>
      </svg>
    </div>
  );
};

interface ShieldSampleSVGProps {
  equipmentId: string;
  visualStatus: string;
  crackStatus: string;
}

const ShieldSampleSVG: React.FC<ShieldSampleSVGProps> = ({ equipmentId, visualStatus, crackStatus }) => {
  const isCrack = crackStatus === 'Cracks Found';
  const isNormalVisual = visualStatus === 'Normal';
  const hasFailure = isCrack || !isNormalVisual;
  const statusColor = hasFailure ? '#f43f5e' : '#10b981';
  
  const lowerName = equipmentId.toLowerCase();
  const isCollar = lowerName.includes('collar') || lowerName.includes('throat') || lowerName.includes('neck') || lowerName.includes('shield');
  const isGlove = lowerName.includes('glove');

  return (
    <div className="w-full h-full min-h-[140px] flex items-center justify-center bg-slate-900 border border-slate-700/60 rounded-lg overflow-hidden relative shadow-inner">
      <svg viewBox="0 0 200 200" className="w-full h-full p-2" strokeLinecap="round" strokeLinejoin="round">
        <defs>
          <linearGradient id="shieldFill" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={isCollar ? '#c084fc' : isGlove ? '#38bdf8' : '#60a5fa'} stopOpacity="0.25" />
            <stop offset="100%" stopColor={isCollar ? '#a855f7' : isGlove ? '#0ea5e9' : '#2563eb'} stopOpacity="0.03" />
          </linearGradient>
        </defs>

        {/* Circular Radar Background */}
        <circle cx="100" cy="100" r="92" fill="none" stroke="#1e293b" strokeWidth="0.5" />
        <circle cx="100" cy="100" r="62" fill="none" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="4 4" />
        <line x1="10" y1="100" x2="190" y2="100" stroke="#334155" strokeWidth="0.5" strokeDasharray="3 3" />
        <line x1="100" y1="10" x2="100" y2="190" stroke="#334155" strokeWidth="0.5" strokeDasharray="3 3" />

        {/* Interactive Radiography Silhouettes */}
        {isCollar ? (
          // Thyroid collar silhouette
          <g transform="translate(0, 10)">
            <path 
              d="M 60,60 L 140,60 C 150,85 145,102 130,112 L 115,130 L 85,130 L 70,112 C 55,102 50,85 60,60 Z" 
              fill="url(#shieldFill)" 
              stroke="#c084fc" 
              strokeWidth="1.5" 
            />
            {/* Soft inner texture */}
            <path d="M 72,75 Q 100,90 128,75" fill="none" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="1 3" />
            <path d="M 75,90 Q 100,105 125,90" fill="none" stroke="#1e293b" strokeWidth="1" />
            
            {/* Draw cracks if fail */}
            {isCrack && (
              <g transform="translate(85, 95)">
                <path d="M 0,0 L 8,-12 L 15,-2 L 25,-15" fill="none" stroke="#f43f5e" strokeWidth="2" />
                <circle cx="10" cy="-8" r="14" fill="none" stroke="#f43f5e" strokeWidth="0.75" strokeDasharray="2 2" />
                <text x="26" y="5" fill="#f43f5e" fontSize="6" fontFamily="monospace" fontWeight="black" letterSpacing="0.5">CRACK</text>
              </g>
            )}
          </g>
        ) : isGlove ? (
          // Lead protective gloves
          <g transform="translate(10, 20)">
            {/* Left Hand Glove */}
            <path 
              d="M 45,105 L 45,65 Q 45,48 55,50 Q 60,38 67,41 Q 73,38 77,43 L 80,105 Z" 
              fill="url(#shieldFill)" 
              stroke="#38bdf8" 
              strokeWidth="1.25" 
            />
            {/* Right Hand Glove */}
            <path 
              d="M 135,105 L 135,65 Q 135,48 125,50 Q 120,38 113,41 Q 107,38 103,43 L 100,105 Z" 
              fill="url(#shieldFill)" 
              stroke="#38bdf8" 
              strokeWidth="1.25" 
            />
            
            {/* Draw cracks if fail */}
            {isCrack && (
              <g transform="translate(110, 60)">
                <path d="M -5,5 L 5,-8 L 10,-3" fill="none" stroke="#f43f5e" strokeWidth="2" />
                <circle cx="2" cy="-2" r="12" fill="none" stroke="#f43f5e" strokeWidth="0.75" strokeDasharray="1 1" />
                <text x="14" y="2" fill="#f43f5e" fontSize="6" fontFamily="monospace" fontWeight="black">LEAK</text>
              </g>
            )}
          </g>
        ) : (
          // Default heavy Lead Apron hanger layout
          <g transform="translate(0, -2)">
            {/* Hanger neck support hook */}
            <path d="M 100,15 L 100,32" stroke="#475569" strokeWidth="1.5" />
            <path d="M 92,19 Q 100,12 108,19" fill="none" stroke="#475569" strokeWidth="1.5" />
            
            {/* Apron Core */}
            <path 
              d="M 85,35 L 115,35 C 115,41 120,46 130,46 L 142,43 C 146,55 142,70 132,75 L 132,150 L 68,150 L 68,75 C 58,70 54,55 58,43 L 70,45 C 80,45 85,41 85,35 Z" 
              fill="url(#shieldFill)" 
              stroke="#38bdf8" 
              strokeWidth="1.5" 
            />
            {/* Heavy lead waist band belt */}
            <rect x="73" y="78" width="54" height="6" rx="2" fill="#0369a1" stroke="#38bdf8" strokeWidth="0.5" />
            <line x1="68" y1="110" x2="132" y2="110" stroke="#1e293b" strokeWidth="0.75" strokeDasharray="2 2" />
            
            {/* Draw cracks if fail */}
            {isCrack && (
              <g transform="translate(85, 105)">
                <path d="M -6,5 L 2,-6 L 8,-3 L 16,-10" fill="none" stroke="#f43f5e" strokeWidth="2.2" />
                <circle cx="4" cy="-3" r="12" fill="none" stroke="#f43f5e" strokeWidth="0.75" strokeDasharray="2 2" />
                <text x="18" y="2" fill="#f43f5e" fontSize="6" fontFamily="monospace" fontWeight="black">CRACK</text>
              </g>
            )}
          </g>
        )}

        {/* Calibration specs overlay labels */}
        <text x="12" y="24" fill="#94a3b8" fontSize="8" fontFamily="sans-serif" fontWeight="bold">SHIELD RADIOGRAPHY</text>
        <text x="12" y="34" fill="#64748b" fontSize="7" fontFamily="monospace" truncate>{equipmentId.slice(0, 22)}</text>
        
        {/* Physical readings display HUD style */}
        <g transform="translate(12, 162)">
          <text x="0" y="8" fill={isNormalVisual ? '#10b981' : '#f43f5e'} fontSize="6.5" fontFamily="monospace">
            VISUAL-STB: {isNormalVisual ? 'STABLE' : 'DAMAGED'}
          </text>
          <text x="0" y="15" fill={!isCrack ? '#10b981' : '#f43f5e'} fontSize="6.5" fontFamily="monospace">
            LEAD-EQUIV: 0.50mmPb
          </text>
        </g>

        {/* Analysis outcome badge */}
        <g transform="translate(130, 165)">
          <rect x="0" y="0" width="58" height="18" rx="3" fill={hasFailure ? 'rgba(244, 63, 94, 0.12)' : 'rgba(16, 185, 129, 0.12)'} stroke={statusColor} strokeWidth="1" />
          <text x="29" y="12" fill={statusColor} fontSize="8" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
            {hasFailure ? 'FAIL' : 'PASS'}
          </text>
        </g>
      </svg>
    </div>
  );
};

interface InspectionImageProps {
  src?: string;
  type: 'collimator' | 'shield';
  equipmentId?: string;
  visualStatus?: string;
  crackStatus?: string;
  sid?: number;
  errorX?: number;
  errorY?: number;
  alignmentResult?: string;
}

const InspectionImage: React.FC<InspectionImageProps> = ({
  src,
  type,
  equipmentId = '',
  visualStatus = 'Normal',
  crackStatus = 'No Cracks',
  sid = 100,
  errorX = 0,
  errorY = 0,
  alignmentResult = 'PASS'
}) => {
  const [hasError, setHasError] = useState(false);
  const directUrl = src ? getDirectImageUrl(src) : '';

  useEffect(() => {
    setHasError(false);
  }, [src]);

  // If there is no image URL, render a clean, professional empty state placeholder
  if (!directUrl) {
    return (
      <div className="w-full h-full min-h-[140px] flex flex-col items-center justify-center bg-slate-50 border border-slate-200 border-dashed rounded-lg p-3 text-center text-slate-400">
        <span className="text-lg">📷</span>
        <span className="text-[10px] font-bold font-sans mt-1">ไม่ได้แนบรูปภาพอ้างอิง</span>
        <span className="text-[8px] text-slate-400 font-mono">No image attached</span>
      </div>
    );
  }

  // If there is an image URL, we ALWAYS render the actual <img> element to load the user's real image.
  // If Chrome / browser blocks loading due to CORS/referrer-policy, show a transparent helpful warning with click-to-open instructions.
  if (hasError) {
    return (
      <div className="w-full h-full min-h-[140px] p-3 flex flex-col items-center justify-center bg-slate-50 border border-slate-200 rounded-lg text-slate-500 text-center relative hover:bg-slate-100 transition-colors">
        <span className="text-base text-amber-500 mb-1">⚠️</span>
        <span className="text-[10px] font-bold text-slate-700 leading-tight">ลิงก์ไม่รองรับการแสดงผลตรงในเว็บเบราว์เซอร์</span>
        <p className="text-[8px] text-slate-400 mt-1 leading-snug max-w-[90%] px-1 font-sans">
          (มีข้อกำหนด CORS หรือสิทธิ์แชร์ในไดรฟ์) คลิกกรอบนี้เพื่อเปิดรูปต้นฉบับในแท็บใหม่
        </p>
        <div className="absolute bottom-1 right-1 left-1 bg-indigo-50 border border-indigo-100/50 py-0.5 px-1 truncate rounded text-[7px] font-mono text-indigo-700 text-center">
          คลิกเปิดดู: {src.substring(0, 35)}...
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative group min-h-[140px] rounded-lg overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center">
      <img
        src={directUrl}
        alt={type === 'collimator' ? 'Collimator Alignment' : equipmentId}
        className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
        referrerPolicy="no-referrer"
        onError={() => setHasError(true)}
      />
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center pointer-events-none print:hidden">
        <span className="bg-slate-900/80 text-white text-[8px] tracking-wider font-bold px-2 py-1 rounded shadow">
          คลิกเปิดดูรูปความละเอียดสูง ↗
        </span>
      </div>
    </div>
  );
};

// Default checklists template
const DEFAULT_CHECKS: MechanicalCheck[] = [
  { id: 1, name: 'stability', thaiLabel: 'ความมั่นคงของตัวเครื่องและหน้ากากปุ่มกดปุ่มเลื่อน (Control & System Body)', status: 'PASS', comments: '' },
  { id: 2, name: 'braking', thaiLabel: 'ระบบเบรกและล็อคแกนมุมการเคลื่อนที่ต่างๆ (Locking & Braking Systems)', status: 'PASS', comments: '' },
  { id: 3, name: 'collimator', thaiLabel: 'ระบบคอลลิเมเตอร์ หลอดไฟส่องทาง และไฟกริดนำแสง (Collimator Indicator Alignment)', status: 'PASS', comments: '' },
  { id: 4, name: 'cables', thaiLabel: 'สวิตช์สายเคเบิลไฟฟ้ากำลังและความปลอดภัยภายนอก (High Tension Cables & Switches)', status: 'PASS', comments: '' },
  { id: 5, name: 'display', thaiLabel: 'การจัดตำแหน่งแสดงผลบนหน้าต่างคอนโทรลและความคมชัดดิจิตอล (Control Board Displays)', status: 'PASS', comments: '' }
];

// Initial pre-populated logs representing Maetha Hospital data
const INITIAL_HISTORY: InspectionReport[] = [
  {
    timestamp: "16/06/2026, 09:24:12",
    operatorName: "นายสมชาย แสนดี",
    reviewerName: "นพ.เอกลักษณ์ ประคองกิจ",
    machineId: "XRAY-GEN-01",
    mechanicalChecks: [
      { id: 1, name: 'stability', thaiLabel: 'ความเสถียรเครื่องหลัก', status: 'PASS', comments: 'สภาพปกติ แน่นหนาดี' },
      { id: 2, name: 'braking', thaiLabel: 'เบรกแกนเคลื่อนตัว', status: 'PASS', comments: 'ยึดแน่นทุกแกนพิกัด' },
      { id: 3, name: 'collimator', thaiLabel: 'ไฟคอลลิเมเตอร์', status: 'PASS', comments: 'ความเรืองแสงสว่างดีเยี่ยม' },
      { id: 4, name: 'cables', thaiLabel: 'สายเคเบิล', status: 'PASS', comments: 'ไม่มีสายถลอกหรือแตกหัก' },
      { id: 5, name: 'display', thaiLabel: 'หน้าจอควบคุม', status: 'PASS', comments: 'ไอคอนและไฟขึ้นครบครัน' }
    ],
    sid: 100,
    errorX: 0.4,
    errorY: 0.6,
    alignmentResult: "PASS",
    protectionGear: [
      { equipmentId: "Lead Apron #01 (ยี่ห้อ Bar-Ray)", visualStatus: "Normal", crackStatus: "No Cracks" },
      { equipmentId: "Thyroid Shield #02 (ห้องตรวจ 1)", visualStatus: "Normal", crackStatus: "No Cracks" }
    ],
    operatorSignature: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='30'><path d='M10,20 Q30,5 60,25 T90,10' stroke='navy' stroke-width='2' fill='none'/></svg>",
    reviewerSignature: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='30'><path d='M15,15 C45,25 70,5 85,20' stroke='indigo' stroke-width='2.5' fill='none'/></svg>",
    suggestions: "เครื่องสมบูรณ์ดีมาก สปริงพยุงน้ำหนักตึงสม่ำเสมอ แนะนำใช้ตรวจสอบปกติ",
    collimatorLinks: [
      "https://images.unsplash.com/photo-1579154204601-01588f351166?auto=format&fit=crop&q=80&w=500"
    ]
  },
  {
    timestamp: "12/06/2026, 14:15:33",
    operatorName: "น.ส.อารี วงศ์วาน",
    reviewerName: "นพ.เอกลักษณ์ ประคองกิจ",
    machineId: "XRAY-PORT-01",
    mechanicalChecks: [
      { id: 1, name: 'stability', thaiLabel: 'ความเสถียรเครื่องหลัก', status: 'PASS', comments: 'เสาล้อเลื่อนลื่นไหลดี' },
      { id: 2, name: 'braking', thaiLabel: 'เบรกแกนเคลื่อนตัว', status: 'PASS', comments: 'เบรกล้อหลังแน่น' },
      { id: 3, name: 'collimator', thaiLabel: 'ไฟคอลลิเมเตอร์', status: 'PASS', comments: 'ไฟแจ้งตำแหน่งทำงานถูกต้อง' },
      { id: 4, name: 'cables', thaiLabel: 'สายเคเบิล', status: 'PASS', comments: 'สายสปริงม้วนปกติ' },
      { id: 5, name: 'display', thaiLabel: 'หน้าจอควบคุม', status: 'PASS', comments: 'หน้าปัดดิจิตอลชัดเจนตามมาตรฐาน' }
    ],
    sid: 100,
    errorX: 1.1,
    errorY: 1.5,
    alignmentResult: "PASS",
    protectionGear: [
      { equipmentId: "Lead Gloves C (คลินิกศัลยกรรม)", visualStatus: "Damaged", crackStatus: "Cracks Found" }
    ],
    operatorSignature: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='30'><path d='M5,15 Q30,25 50,15 T95,15' stroke='navy' stroke-width='2' fill='none'/></svg>",
    reviewerSignature: "",
    suggestions: "พบถุงมือตะกั่วด้านขวามีรอยร้าวรังสีรั่วบริเวณโคนนิ้วโป้ง ได้คัดแยกรอทำลายและจัดหาชิ้นสำรองทดแทนแล้ว",
    collimatorLinks: [
      "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=500"
    ]
  },
  {
    timestamp: "05/06/2026, 10:02:11",
    operatorName: "นายสมชาย แสนดี",
    reviewerName: "นพ.เอกลักษณ์ ประคองกิจ",
    machineId: "XRAY-GEN-02",
    mechanicalChecks: [
      { id: 1, name: 'stability', thaiLabel: 'ความเสถียรเครื่องหลัก', status: 'PASS', comments: '' },
      { id: 2, name: 'braking', thaiLabel: 'เบรกแกนเคลื่อนตัว', status: 'PASS', comments: '' },
      { id: 3, name: 'collimator', thaiLabel: 'ไฟคอลลิเมเตอร์', status: 'FAIL', comments: 'หลอดนำแสงหรี่ขุ่นมัว' },
      { id: 4, name: 'cables', thaiLabel: 'สายเคเบิล', status: 'PASS', comments: '' },
      { id: 5, name: 'display', thaiLabel: 'หน้าจอควบคุม', status: 'PASS', comments: '' }
    ],
    sid: 100,
    errorX: 2.4,
    errorY: 1.8,
    alignmentResult: "FAIL",
    protectionGear: [
      { equipmentId: "Lead Apron #04 (ยี่ห้อ Mavig)", visualStatus: "Normal", crackStatus: "No Cracks" }
    ],
    operatorSignature: "",
    reviewerSignature: "",
    suggestions: "ค่าเบี่ยงเบน Collimator แกน X เกินเกณฑ์ 2% ของ SID (วัดได้ 2.4 cm) แนะนำแจ้งประสานช่างบำรุงเปลี่ยนตัวเบี่ยงทิศและตรวจเช็คหลอดส่องใหม่",
    collimatorLinks: []
  }
];

const getDirectImageUrl = (url: string | undefined): string => {
  if (!url) return '';
  const trimmed = url.trim();
  if (!trimmed) return '';
  
  if (trimmed.startsWith('data:')) return trimmed;
  
  // Convert Google Drive sharing link to a highly reliable, cookie-wall and CORS-friendly thumbnail URL
  const driveFilePattern = /\/file\/d\/([a-zA-Z0-9_-]+)/;
  const driveOpenPattern = /[?&]id=([a-zA-Z0-9_-]+)/;
  
  let match = trimmed.match(driveFilePattern);
  if (match && match[1]) {
    return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1000`;
  }
  
  match = trimmed.match(driveOpenPattern);
  if (match && match[1]) {
    return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1000`;
  }
  
  return trimmed;
};

export default function App() {
  // Tab control
  const [activeTab, setActiveTab] = useState<'form' | 'dashboard'>('form');

  // Form Fields
  const [operatorName, setOperatorName] = useState('');
  const [reviewerName, setReviewerName] = useState('');
  const [machineId, setMachineId] = useState('XRAY-GEN-01');
  const [suggestions, setSuggestions] = useState('');
  const [sid, setSid] = useState(100);
  const [errorX, setErrorX] = useState(0.5);
  const [errorY, setErrorY] = useState(0.8);

  // Collimator Links State
  const [collimatorLinks, setCollimatorLinks] = useState<string[]>(['']);

  const handleAddCollimatorLink = () => {
    setCollimatorLinks(prev => [...prev, '']);
  };

  const handleUpdateCollimatorLink = (index: number, val: string) => {
    setCollimatorLinks(prev => prev.map((lnk, i) => i === index ? val : lnk));
  };

  const handleRemoveCollimatorLink = (index: number) => {
    setCollimatorLinks(prev => prev.filter((_, i) => i !== index));
  };

  const [mechanicalChecks, setMechanicalChecks] = useState<MechanicalCheck[]>(DEFAULT_CHECKS);
  const [equipmentRows, setEquipmentRows] = useState<EquipmentRow[]>([
    { rowId: 'row_1', equipmentId: 'Lead Apron #01', visualStatus: 'Normal', crackStatus: 'No Cracks', base64File: '', fileName: '', driveLink: '' },
    { rowId: 'row_2', equipmentId: 'Thyroid Collar #01', visualStatus: 'Normal', crackStatus: 'No Cracks', base64File: '', fileName: '', driveLink: '' }
  ]);

  // Signatures State (retained for backward compatibility and reset state)
  const [operatorSig, setOperatorSig] = useState('');
  const [reviewerSig, setReviewerSig] = useState('');

  // History Database List
  const [history, setHistory] = useState<InspectionReport[]>(() => {
    const saved = localStorage.getItem('maetha_inspection_history');
    return saved ? JSON.parse(saved) : INITIAL_HISTORY;
  });

  // Filter Categories for historical reports view
  const [filterCategory, setFilterCategory] = useState<'ALL' | 'PASS' | 'FAIL' | 'DEFECTIVE-GEAR'>('ALL');

  // Target report chosen to render official printable page
  const [activeReportIndex, setActiveReportIndex] = useState<number | null>(null);

  // Toast System state
  const [toast, setToast] = useState<{ show: boolean; title: string; body: string; status: 'success' | 'error' | 'default' }>({
    show: false,
    title: '',
    body: '',
    status: 'default'
  });

  const showToast = (title: string, body: string, status: 'success' | 'error' | 'default' = 'success') => {
    setToast({ show: true, title, body, status });
  };

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast(prev => ({ ...prev, show: false }));
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  // Sync to local persistent storage on update
  useEffect(() => {
    localStorage.setItem('maetha_inspection_history', JSON.stringify(history));
  }, [history]);

  // Mechanical Checkbox radio change
  const handleMechanicalStatusChange = (id: number, status: 'PASS' | 'FAIL') => {
    setMechanicalChecks(prev => prev.map(item => item.id === id ? { ...item, status } : item));
  };

  const handleMechanicalCommentChange = (id: number, comments: string) => {
    setMechanicalChecks(prev => prev.map(item => item.id === id ? { ...item, comments } : item));
  };

  // Add Row in Radiation Shield Protection
  const handleAddEquipmentRow = (predefinedName = '') => {
    const uniqId = 'row_' + Date.now() + Math.random().toString(36).substr(2, 4);
    const newEntry: EquipmentRow = {
      rowId: uniqId,
      equipmentId: predefinedName,
      visualStatus: 'Normal',
      crackStatus: 'No Cracks',
      base64File: '',
      fileName: '',
      driveLink: ''
    };
    setEquipmentRows(prev => [...prev, newEntry]);
  };

  const handleDeleteEquipmentRow = (rowId: string) => {
    setEquipmentRows(prev => prev.filter(r => r.rowId !== rowId));
  };

  // Row update handlers
  const handleRowValueChange = (rowId: string, field: keyof EquipmentRow, value: any) => {
    setEquipmentRows(prev => prev.map(r => r.rowId === rowId ? { ...r, [field]: value } : r));
  };

  // Convert File Input to Base64 blob string
  const handleFileChange = (rowId: string, e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setEquipmentRows(prev => prev.map(r => r.rowId === rowId ? {
          ...r,
          base64File: event.target!.result as string,
          fileName: file.name
        } : r));
        showToast("เพิ่มรูปภาพเรียบร้อย", `แนบไฟล์ภาพ ${file.name} เข้าระบบความจำคลื่นความเร็วสมบูรณ์`, "success");
      }
    };
    reader.readAsDataURL(file);
  };

  // Form Submition simulation
  const handleSubmitForm = () => {
    if (!operatorName.trim()) {
      showToast("กรอกข้อมูลไม่ครบถ้วน", "กรุณาระบุชื่อพนักงานรังสีเทคนิคผู้ร่วมตรวจวิเคราะห์", "error");
      const element = document.getElementById('operator-name-input');
      element?.focus();
      return;
    }

    // Collimator alignment calculations
    const limit = (2 / 100) * sid;
    const computedMaxError = Math.max(Math.abs(errorX), Math.abs(errorY));
    const alignmentResult = computedMaxError <= limit ? "PASS" : "FAIL";

    const reportPayload: InspectionReport = {
      timestamp: new Date().toLocaleString("th-TH", { timeZone: "Asia/Bangkok" }),
      operatorName: operatorName.trim(),
      reviewerName: reviewerName.trim() || 'รอพิจารณาตรวจสอบ',
      machineId,
      mechanicalChecks: [...mechanicalChecks],
      sid,
      errorX,
      errorY,
      alignmentResult,
      protectionGear: equipmentRows.map(row => ({
        equipmentId: row.equipmentId || 'อุปกรณ์ป้องกันไม่ระบุรหัส',
        visualStatus: row.visualStatus,
        crackStatus: row.crackStatus,
        fileName: row.fileName || undefined,
        imageUrl: row.driveLink || row.base64File || undefined
      })),
      operatorSignature: operatorSig,
      reviewerSignature: reviewerSig,
      suggestions: suggestions.trim(),
      collimatorLinks: collimatorLinks.filter(l => l.trim() !== '')
    };

    // Prepend to history logs state tree
    setHistory(prev => [reportPayload, ...prev]);

    showToast(
      "บันทึกข้อมูลสำเร็จ ✅", 
      `ข้อมูลเครื่อง ${machineId} และรายการคำนวณทั้งหมดได้รับการบันทึกเก็บประวัติย้อนหลังเรียบร้อยแล้ว`, 
      "success"
    );

    // Reset Form Fields ready for next inspection
    setOperatorName('');
    setReviewerName('');
    setSuggestions('');
    setSid(100);
    setErrorX(0);
    setErrorY(0);
    setCollimatorLinks(['']);
    setMechanicalChecks(DEFAULT_CHECKS.map(item => ({ ...item, status: 'PASS', comments: '' })));
    setEquipmentRows([
      { rowId: 'row_1', equipmentId: 'Lead Apron #01', visualStatus: 'Normal', crackStatus: 'No Cracks', base64File: '', fileName: '', driveLink: '' }
    ]);
    setOperatorSig('');
    setReviewerSig('');

    // Switch table directly to review reports metrics panel
    setActiveTab('dashboard');
  };

  // Wipe Form completely
  const handleWipeForm = () => {
    setOperatorName('');
    setReviewerName('');
    setSuggestions('');
    setSid(100);
    setErrorX(0);
    setErrorY(0);
    setCollimatorLinks(['']);
    setMechanicalChecks(DEFAULT_CHECKS.map(item => ({ ...item, status: 'PASS', comments: '' })));
    setEquipmentRows([
      { rowId: 'row_1', equipmentId: 'Lead Apron #01', visualStatus: 'Normal', crackStatus: 'No Cracks', base64File: '', fileName: '', driveLink: '' }
    ]);
    setOperatorSig('');
    setReviewerSig('');
    showToast("ล้างข้อมูลแล้ว", "ฟอร์มตรวจประเมินปัจจุบันกลับคืนสถานะว่างเปล่าแล้ว", "default");
  };

  // Delete a specific report from local and simulated cloud state
  const handleDeleteHistoryItem = (originalIndex: number, mId: string) => {
    if (window.confirm(`คุณต้องการลบรายงานประวัติการตรวจสอบของเครื่อง ${mId} ใช่หรือไม่?`)) {
      setHistory(prev => prev.filter((_, idx) => idx !== originalIndex));
      if (activeReportIndex === originalIndex) {
        setActiveReportIndex(null);
      } else if (activeReportIndex !== null && activeReportIndex > originalIndex) {
        setActiveReportIndex(activeReportIndex - 1);
      }
      showToast("ลบประวัติสำเร็จ 🗑️", `นำรายงานตรวจประเมินของเครื่อง ${mId} ออกจากฐานข้อมูลประวัติเรียบร้อยแล้ว`, "default");
    }
  };

  // Run Formal Clinical Print Layout
  const triggerFormalPrint = (reportIndex: number) => {
    setActiveReportIndex(reportIndex);

    // Trigger Print layout in window context after state registers HTML structures
    setTimeout(() => {
      window.print();
    }, 500);
  };

  // Compute stats metrics dynamically
  const totalReportsCount = history.length;
  const passingReportsCount = history.filter(h => h.alignmentResult === 'PASS').length;
  const passFractionText = totalReportsCount > 0 
    ? `${Math.round((passingReportsCount / totalReportsCount) * 100)}%` 
    : '100%';

  let totalDefectiveGears = 0;
  history.forEach(item => {
    item.protectionGear.forEach(g => {
      if (g.visualStatus === 'Damaged' || g.crackStatus === 'Cracks Found') {
        totalDefectiveGears++;
      }
    });
  });

  // Filter history list matching user toggle
  const getFilteredHistoryList = () => {
    switch (filterCategory) {
      case 'PASS':
        return history.filter(item => item.alignmentResult === 'PASS');
      case 'FAIL':
        return history.filter(item => item.alignmentResult === 'FAIL');
      case 'DEFECTIVE-GEAR':
        return history.filter(item => 
          item.protectionGear.some(g => g.visualStatus === 'Damaged' || g.crackStatus === 'Cracks Found')
        );
      default:
        return history;
    }
  };

  const filteredHistory = getFilteredHistoryList();

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 antialiased flex flex-col justify-between font-sans">
      
      {/* 1. Maetha Hospital Header Jumbotron - HIDDEN IN PRINTING */}
      <header className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white shadow-md print:hidden">
        <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-xl border border-white/5 shadow-inner">
              <ShieldCheck className="w-10 h-10 text-blue-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-indigo-500/30 text-indigo-300 text-[10px] font-bold rounded-md tracking-wider uppercase">Maetha Hospital</span>
                <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Cloud Active
                </span>
              </div>
              <h1 className="text-2xl font-black mt-1 text-white tracking-wide">แผนกรังสีเทคนิค โรงพยาบาลแม่ทา</h1>
              <p className="text-xs text-blue-200 mt-1 font-light flex items-center gap-1.5">
                <span>ต.ทาสบเส้า อ.แม่ทา จ.ลำพูน • ระบบตรวจสอบคุณภาพเชิงสมรรถนะคัดกรองขีดจำกัดรังสี ประจำไตรมาส (3-6 เดือน)</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="bg-white/10 text-white border border-white/10 text-xs px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 font-medium">
              <History className="w-4 h-4 text-indigo-300" /> รอบตรวจสอบ: ไตรมาส 2/2569
            </span>
          </div>
        </div>
      </header>

      {/* 2. Top-Level Navigation Tabs Row - HIDDEN IN PRINTING */}
      <div className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-sm print:hidden">
        <div className="max-w-7xl mx-auto px-4 flex gap-2 md:gap-6 overflow-x-auto">
          <button 
            type="button"
            onClick={() => { setActiveTab('form'); setActiveReportIndex(null); }}
            className={`px-5 py-4 font-bold text-sm transition-all focus:outline-none flex items-center gap-2 relative border-b-2 ${
              activeTab === 'form' 
                ? 'border-indigo-600 text-indigo-600' 
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <ClipboardList className="w-4.5 h-4.5" /> ฟอร์มทดสอบความปลอดภัย (QC Form)
            {activeTab === 'form' && <span className="absolute bottom-0 inset-x-0 h-0.5 bg-indigo-600"></span>}
          </button>

          <button 
            type="button"
            onClick={() => { setActiveTab('dashboard'); setActiveReportIndex(null); }}
            className={`px-5 py-4 font-bold text-sm transition-all focus:outline-none flex items-center gap-2 relative border-b-2 ${
              activeTab === 'dashboard' 
                ? 'border-indigo-600 text-indigo-600' 
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <PieChart className="w-4.5 h-4.5" /> รายงานสรุปและแดชบอร์ด (Overview Report)
            {activeTab === 'dashboard' && <span className="absolute bottom-0 inset-x-0 h-0.5 bg-indigo-600"></span>}
          </button>
        </div>
      </div>

      {/* 3. Main Workspace container */}
      <main className="max-w-7xl mx-auto px-4 py-8 flex-grow w-full">
        
        {/* ==================== TAB 1: FORM VIEW ==================== */}
        {activeTab === 'form' && (
          <div className="space-y-8 animate-fadeIn duration-200" id="main-qc-form">
            
            {/* Operator Identifier card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-base font-bold text-slate-800 mb-5 pb-3 border-b border-slate-100 flex items-center gap-2 text-indigo-950">
                <Info className="w-5 h-5 text-indigo-600" /> 1. บันทึกข้อมูลบุคลากรและรหัสจำแนกอุปกรณ์หลัก
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">
                    พนักงานรังสีเทคนิคผู้ตรวจสอบ (Operator) *
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                      <User className="w-4 h-4" />
                    </span>
                    <input 
                      type="text" 
                      id="operator-name-input"
                      value={operatorName}
                      onChange={(e) => setOperatorName(e.target.value)}
                      placeholder="ระบุชื่อ-นามสกุลจริงผู้ทำ QC" 
                      className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">
                    หัวหน้าผู้รับรองตรวจสอบทานหลัก (Reviewer)
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                      <UserCheck className="w-4 h-4" />
                    </span>
                    <input 
                      type="text" 
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      placeholder="นพ. หรือหัวหน้าแพทย์รังสี" 
                      className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">
                    ระบุรหัสประจำเครื่องเอกซเรย์สัมภาษณ์ (Device ID)
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                      <Drill className="w-4 h-4" />
                    </span>
                    <select 
                      value={machineId}
                      onChange={(e) => setMachineId(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none cursor-pointer text-slate-700 font-semibold"
                    >
                      <option value="XRAY-GEN-01">X-Ray General #01 (ห้องตรวจรังสี 1)</option>
                      <option value="XRAY-GEN-02">X-Ray General #02 (ห้องตรวจรังสี 2)</option>
                      <option value="XRAY-PORT-01">Portable X-Ray Mobil #01 (ตึกผู้ป่วยใน)</option>
                      <option value="XRAY-DENT-01">Dental Panoramic X-Ray #01 (คลินิกทันตกรรม)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Part 1: Structural QC section */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-base font-bold text-slate-800 mb-1 flex items-center gap-2 text-indigo-950">
                <Settings className="w-5 h-5 text-indigo-600" /> 2. การตรวจสอบชิ้นส่วนเชิงกลและโครงสร้างหลัก (Mechanical stability check)
              </h2>
              <p className="text-xs text-slate-400 mb-6 font-light">กรณีกดหัวข้อ "ไม่ผ่าน" ระบบพิมพ์ประวัติตัวเก็บคลาวด์จะบันทึกสถานะชำรุดเพื่อแจ้งช่างบำรุงเชิงรุก</p>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-wider">
                      <th className="p-3.5 w-12 text-center">#</th>
                      <th className="p-3.5">หัวข้อรายการตรวจสอบโครงสร้างชิ้นส่วนทั่วไป</th>
                      <th className="p-3.5 w-44 text-center">ผลลัพธ์คัดเกณฑ์</th>
                      <th className="p-3.5">ความเห็นบันทึกเพิ่มเติม</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {mechanicalChecks.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-slate-50/30 transition-colors">
                        <td className="p-3 text-center text-slate-400 font-medium font-mono">{idx + 1}</td>
                        <td className="p-3 text-slate-700 font-semibold">{item.thaiLabel}</td>
                        <td className="p-3 text-center">
                          <div className="inline-flex bg-slate-100 p-0.5 rounded-lg gap-1 text-xs">
                            <button
                              type="button"
                              onClick={() => handleMechanicalStatusChange(item.id, 'PASS')}
                              className={`px-3 py-1.5 rounded-md font-bold transition-all ${
                                item.status === 'PASS' 
                                  ? 'bg-white text-emerald-700 shadow-sm' 
                                  : 'text-slate-500 hover:text-slate-700'
                              }`}
                            >
                              ผ่าน
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMechanicalStatusChange(item.id, 'FAIL')}
                              className={`px-3 py-1.5 rounded-md font-bold transition-all ${
                                item.status === 'FAIL' 
                                  ? 'bg-rose-500 text-white shadow-sm' 
                                  : 'text-slate-500 hover:text-slate-700'
                              }`}
                            >
                              ไม่ผ่าน
                            </button>
                          </div>
                        </td>
                        <td className="p-3">
                          <input 
                            type="text" 
                            value={item.comments}
                            onChange={(e) => handleMechanicalCommentChange(item.id, e.target.value)}
                            placeholder="พิมพ์หมายเหตุชำรุด (ถ้ามี)" 
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:bg-white focus:outline-none transition-all"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Part 2: Collimator test Calculator section */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-base font-bold text-slate-800 mb-1.5 flex items-center gap-2 text-indigo-950">
                <Activity className="w-5 h-5 text-indigo-600" /> 3. ประเมินแนวรบความคลาดเคลื่อนโฟกัสรังสี (Collimator alignment Calculator)
              </h2>
              <p className="text-xs text-slate-400 mb-6 font-light">ระบุระยะห่างฉาย SID และขนาดคลาดเคลื่อน เพื่อคำนวณอัตราบังคับความปลอดภัยไม่เกิน 2% อัตโนมัติ</p>

              {/* Calculator Panel inputs split */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">ระยะทางจากลำกล้องถึงฟิล์มรับภาพ (SID) (cm)</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        value={sid}
                        onChange={(e) => setSid(Math.max(10, parseFloat(e.target.value) || 100))}
                        min="10"
                        className="w-full pr-12 pl-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                      />
                      <span className="absolute inset-y-0 right-3.5 flex items-center text-xs font-bold text-slate-400 font-mono">cm</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">ผลทับเบี่ยงเบนตามแนวนอน (Error X) (cm)</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        step="0.1"
                        value={errorX}
                        onChange={(e) => setErrorX(parseFloat(e.target.value) || 0)}
                        className="w-full pr-12 pl-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                      />
                      <span className="absolute inset-y-0 right-3.5 flex items-center text-xs font-bold text-slate-400 font-mono">cm</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">ผลทับเบี่ยงเบนแนวตั้ง (Error Y) (cm)</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        step="0.1"
                        value={errorY}
                        onChange={(e) => setErrorY(parseFloat(e.target.value) || 0)}
                        className="w-full pr-12 pl-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                      />
                      <span className="absolute inset-y-0 right-3.5 flex items-center text-xs font-bold text-slate-400 font-mono">cm</span>
                    </div>
                  </div>
                </div>

                {/* Render the core interactive Beam Visualizer component */}
                <BeamVisualizer sid={sid} errorX={errorX} errorY={errorY} />

                {/* Collimator Links attachment slot */}
                <div className="pt-5 border-t border-slate-100 space-y-3.5">
                  <span className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                    แนบลิงก์เพิ่มเติม (เช่น ภาพถ่ายฟิล์มตรวจวัด, ข้อมูลดิบ, บันทึกสอบเทียบสำรอง) - สามารถเพิ่มลิงก์ได้ไม่จำกัดกรณีมีมากกว่า 1 แหล่ง
                  </span>
                  <div className="space-y-2.5">
                    {collimatorLinks.map((link, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="relative flex-grow">
                          <input 
                            type="text" 
                            value={link}
                            onChange={(e) => handleUpdateCollimatorLink(idx, e.target.value)}
                            placeholder="วางแชร์ลิงก์อ้างอิง เช่น https://drive.google.com/..."
                            className="w-full pl-3 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono transition-all"
                          />
                          <span className="absolute inset-y-0 right-3.5 flex items-center">
                            <ExternalLink className="w-4 h-4 text-slate-400" />
                          </span>
                        </div>
                        {collimatorLinks.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveCollimatorLink(idx)}
                            className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                            title="ลบลิงก์นี้"
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleAddCollimatorLink}
                      className="px-3.5 py-2 text-xs text-indigo-700 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 hover:border-indigo-300 font-bold rounded-xl flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> แนบลิงก์เพิ่มเติม (+ Add more links)
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Part 3: Unlimited Dynamic Protection Equipment Rows */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-100">
                <div>
                  <h2 className="text-base font-bold text-slate-800 flex items-center gap-2 text-indigo-950">
                    <ShieldAlert className="w-5 h-5 text-indigo-600" /> 4. บันทึกผลการตรวจสอบอุปกรณ์ตะกั่วป้องกันรังสี (Lead Shields & AP)
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5 font-light">สามารถเพิ่มชุดป้องกันได้จำกัด เช่น เสื้อครุมเอี้ยว แผ่นห้อยคอ ถุงมือจับสัมผัส โดยแนบภาพหลักฐานซ่อม</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleAddEquipmentRow()}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-indigo-100 transition-all flex items-center gap-1.5 self-start"
                >
                  <Plus className="w-4 h-4" /> เพิ่มรายการตะกั่วป้องกันตัวใหม่
                </button>
              </div>

              {equipmentRows.length === 0 ? (
                <div className="text-center py-12 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl space-y-2">
                  <div className="font-mono text-3xl">🗃️</div>
                  <h4 className="text-sm font-semibold">ไม่มีอุปกรณ์ป้องกันรังสีที่สแกนตัวเลือกมา</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">แนะนำเพิ่มแถวเกียร์ตะกั่วป้องกัน เช่น "Lead Apron Room 1" แล้วคีย์ผลทดสอบแตกร้าว</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs font-bold font-logo uppercase tracking-wider">
                        <th className="p-3 w-56">รหัส/ชื่อแบรนด์เสื้อตะกั่ว</th>
                        <th className="p-3 w-40">สภาพหุ้มหนังทั่วไป</th>
                        <th className="p-3 w-44">ผลตรวจสอบความแตกร้าว</th>
                        <th className="p-3 min-w-[300px]">แนบหลักฐานภาพถ่ายรอยร้าว (Base64/Drive)</th>
                        <th className="p-3 w-16 text-center">ลบ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {equipmentRows.map((row) => (
                        <tr key={row.rowId} className="hover:bg-slate-200/20 transition-colors">
                          <td className="p-3">
                            <input 
                              type="text" 
                              value={row.equipmentId}
                              onChange={(e) => handleRowValueChange(row.rowId, 'equipmentId', e.target.value)}
                              placeholder="เช่น Lead Apron #04" 
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                          </td>

                          <td className="p-3">
                            <select 
                              value={row.visualStatus}
                              onChange={(e) => handleRowValueChange(row.rowId, 'visualStatus', e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs focus:bg-white focus:outline-none font-semibold text-slate-700"
                            >
                              <option value="Normal">สมบูรณ์ดี (Normal)</option>
                              <option value="Damaged">ชำรุดฉีกขาด (Damaged)</option>
                            </select>
                          </td>

                          <td className="p-3">
                            <select 
                              value={row.crackStatus}
                              onChange={(e) => handleRowValueChange(row.rowId, 'crackStatus', e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs focus:bg-white focus:outline-none font-semibold text-slate-700"
                            >
                              <option value="No Cracks">ไม่มีรอยร้าว (PASS)</option>
                              <option value="Cracks Found">พบรอยร้าวข้างใน (FAIL)</option>
                            </select>
                          </td>

                          <td className="p-3">
                            <div className="flex flex-col gap-2">
                              {/* Drag & select file trigger link */}
                              <div className="flex items-center gap-2">
                                <label className="px-3 py-1.5 bg-slate-100 text-[10px] font-black text-slate-700 hover:bg-slate-200 rounded-lg border border-slate-200 cursor-pointer transition-all flex items-center gap-1 leading-none shadow-sm">
                                  <ImageUp className="w-3.5 h-3.5 text-slate-500" /> โหลดรูปจากเครื่อง
                                  <input 
                                    type="file" 
                                    accept="image/*"
                                    onChange={(e) => handleFileChange(row.rowId, e)}
                                    className="hidden"
                                  />
                                </label>
                                <span className="text-[10px] text-slate-400 font-mono truncate max-w-[130px]">
                                  {row.fileName || "ยังไม่เลือกแฟ้มภาพ"}
                                </span>
                              </div>
                              {/* Text backup url link */}
                              <input 
                                type="text"
                                value={row.driveLink}
                                onChange={(e) => handleRowValueChange(row.rowId, 'driveLink', e.target.value)}
                                placeholder="หรือวางลิงก์ระบุตรง Google Drive สำรอง" 
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-[9px] focus:bg-white focus:outline-none"
                              />
                            </div>
                          </td>

                          <td className="p-3 text-center">
                            <button
                              type="button"
                              onClick={() => handleDeleteEquipmentRow(row.rowId)}
                              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                            >
                              <Trash className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Additional suggestions comments */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wide">
                ข้อเสนอแนะหัวข้อการซ่อมแซมและการซ่อมบำรุงเพิ่มเติม (Maintenance suggestions comments)
              </label>
              <textarea 
                value={suggestions}
                onChange={(e) => setSuggestions(e.target.value)}
                rows={3}
                placeholder="ระบุความคิดเห็นเชิงวิศวกรรมการแพทย์ หากตรวจพบจุดชำรุดสำคัญ เช่น เกลียวหลวม การตอบรับปัญหายึดพิกัดหลัก หรือความเห็นในการทดสอบความคลาดรังสีรอบนี้..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all leading-relaxed"
              />
            </div>

            {/* Submit & Reset actions footer row */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3.5 pt-4">
              <button
                type="button"
                onClick={handleWipeForm}
                className="w-full sm:w-auto px-5 py-3 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600 hover:text-slate-800 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" /> ลบล้างฟอร์มทั้งหมด
              </button>
              <button
                type="button"
                onClick={handleSubmitForm}
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-800 hover:to-indigo-900 text-white rounded-xl text-sm font-black shadow-md hover:shadow-indigo-100 transition-all flex items-center justify-center gap-1.5 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <Send className="w-4.5 h-4.5" /> บันทึกรายงานและส่งข้อมูลเข้าคลาวด์
              </button>
            </div>

          </div>
        )}

        {/* ==================== TAB 2: OVERVIEW REPORTS & HISTORICAL DASHBOARD ==================== */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fadeIn duration-200" id="reports-dashboard">
            
            {/* Quick Metrics KPI highlights card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex items-center gap-4">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">รอบตรวจประเมิน</span>
                  <span className="text-base font-black text-slate-800 block">ไตรมาสที่ 2/2569</span>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex items-center gap-4">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">สัดส่วนผ่านมาตรฐานลำรังสี</span>
                  <span className="text-base font-black text-slate-800 block">{passFractionText} ประเมินผ่าน</span>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex items-center gap-4">
                <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">อุปกรณ์ป้องกันชำรุดร้าวที่ติดตาม</span>
                  <span className="text-base font-black text-slate-800 block">{totalDefectiveGears} ชุดสะสม</span>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex items-center gap-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                  <History className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">รวมผลการตรวจสะสม</span>
                  <span className="text-base font-black text-slate-800 block">ประมวลผล {totalReportsCount} โครงการ</span>
                </div>
              </div>

            </div>

            {/* Offline-compliant light pure SVG stats charts charts */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold text-indigo-950 uppercase mb-4 tracking-widest flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-emerald-500" /> สัดส่วนสเปกแนวฉาย (Collimator accuracy)
                  </h3>
                  
                  <div className="flex items-center justify-center p-4">
                    <svg viewBox="0 0 100 100" className="w-32 h-32">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#f1f5f9" strokeWidth="12"></circle>
                      {/* Generates ratio chart: base pass vs failures */}
                      <circle 
                        cx="50" 
                        cy="50" 
                        r="40" 
                        fill="none" 
                        stroke="#10b981" 
                        strokeWidth="12" 
                        strokeDasharray={`${(passingReportsCount / (totalReportsCount || 1)) * 251.2} 251.2`} 
                        transform="rotate(-90 50 50)"
                        className="transition-all duration-1000"
                      ></circle>
                      <text x="50" y="54" fontFamily="sans-serif" fontSize="14" fontWeight="bold" textAnchor="middle" fill="#1e293b" className="font-logo">
                        {passFractionText}
                      </text>
                    </svg>
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t border-slate-100">
                  <div className="flex justify-between items-center text-xs">
                    <span className="flex items-center gap-1.5 font-semibold text-slate-600">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 block"></span> ตรึงพิกัดผ่าน (PASS)
                    </span>
                    <span className="font-extrabold text-slate-800">{passingReportsCount} ชุดตรวจ</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="flex items-center gap-1.5 font-semibold text-slate-600">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 block"></span> คลาดเคลื่อนสูง (FAIL)
                    </span>
                    <span className="font-extrabold text-slate-800">{totalReportsCount - passingReportsCount} ชุดตรวจ</span>
                  </div>
                </div>
              </div>

              {/* Progress check values list */}
              <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold text-indigo-950 uppercase mb-4 tracking-widest flex items-center gap-1.5">
                    <CheckSquare className="w-4 h-4 text-blue-500" /> อัตราการผ่านการตรวจสอบด้านเชิงกลค้ำจุน (Mechanical Stability Metrics)
                  </h3>

                  <div className="space-y-4 pt-1">
                    <div>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-slate-600 font-semibold">1. ความเสถียรแน่นหนาปุ่มเลื่อนและหน้ากากบอร์ด</span>
                        <span className="font-bold text-emerald-600">100% ผ่าน</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden shadow-inner">
                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: '100%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-slate-600 font-semibold">2. ระบบล็อคแน่นเบรกตามแกนเล็งพิกัด</span>
                        <span className="font-bold text-emerald-600">100% ผ่าน</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden shadow-inner">
                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: '100%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-slate-600 font-semibold">3. ไฟคอลลิเมเตอร์ส่องกริดทิศทางรังสี</span>
                        <span className="font-bold text-indigo-600">75% ผ่าน</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden shadow-inner">
                        <div className="bg-indigo-500 h-full rounded-full" style={{ width: '75%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-slate-600 font-semibold">4. สายไฟและสลักสวิตช์ความปลอดภัยภายนอก</span>
                        <span className="font-bold text-emerald-600">100% ผ่าน</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden shadow-inner">
                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: '100%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-[10px] text-slate-400 font-light mt-6">
                  * ข้อมูลสมรรถนะคัดกรองประมวลผลดึงจากความจำแอปสคริปต์สแกนเนอร์ที่แท้จริง
                </p>
              </div>

            </div>

            {/* Row filters and tables block */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-5 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-indigo-950 flex items-center gap-1.5">
                    <Database className="w-5 h-5 text-indigo-600" /> บันทึกรายงานประวัติการตรวจสอบย้อนหลังที่ซิงค์คลาวด์
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">สามารถกรองเพื่อเรียกดูรายละเอียดฟอร์ม และสั่งพิมพ์เป็น PDF รายแผ่นได้อย่างสมบูรณ์แบบ</p>
                </div>

                {/* Filter selects */}
                <div className="w-full sm:w-auto flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500 whitespace-nowrap"><Search className="w-3.5 h-3.5 inline mr-1" /> คัดประเภท:</span>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value as any)}
                    className="px-3.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:bg-white cursor-pointer select-none"
                  >
                    <option value="ALL">บันทึกทั้งหมด (All Logs)</option>
                    <option value="PASS">แนวรังสีผ่านอย่างเดียว (Pass Only)</option>
                    <option value="FAIL">แนวรังสีคลาดเล็งเสียอย่างเดียว (Fail Only)</option>
                    <option value="DEFECTIVE-GEAR">พบรอยร้าวในแผ่นตะกั่วสะสม</option>
                  </select>
                </div>
              </div>

              {/* Data Table rows list */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                      <th className="p-3.5">วันเวลาลงตรวจ</th>
                      <th className="p-3.5">หมายเลขประจำเครื่อง</th>
                      <th className="p-3.5">ผู้ทดสอบหลัก (Operator)</th>
                      <th className="p-3.5">โครงสร้างเชิงกล (Stability)</th>
                      <th className="p-3.5 text-center">ระยะ SID</th>
                      <th className="p-3.5 text-center">ค่าคลาดคอลลิเมเตอร์ (X / Y)</th>
                      <th className="p-3.5 text-center">สรุปรังสี</th>
                      <th className="p-3.5 text-center">ชุดตะกั่วพ่วงตรวจ</th>
                      <th className="p-3.5 text-center">ลายซินคู่</th>
                      <th className="p-3.5 text-center">พิมพ์ PDF</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredHistory.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="text-center py-10 font-light italic text-slate-400">
                          ไม่พบบันทึกประวัติตารางตรงหัวข้อตัวเลือกนี้
                        </td>
                      </tr>
                    ) : (
                      filteredHistory.map((item, index) => {
                        const scorePass = item.alignmentResult === 'PASS';
                        const gearGauges = item.protectionGear.length;
                        
                        return (
                          <tr key={index} className="hover:bg-slate-50/70 transition-all font-medium border-b border-slate-50">
                            <td className="p-3.5 text-slate-500 font-mono">{item.timestamp}</td>
                            <td className="p-3.5 font-bold text-indigo-950">{item.machineId}</td>
                            <td className="p-3.5">{item.operatorName}</td>
                            <td className="p-3.5">
                              {item.mechanicalChecks.every(c => c.status === 'PASS') 
                                ? <span className="text-emerald-700 font-semibold font-sans">สมบูรณ์ครบ ✓</span> 
                                : <span className="text-amber-700 font-semibold font-sans">พบจุดชำรุด ✗</span>
                              }
                            </td>
                            <td className="p-3.5 text-center font-bold font-mono">{item.sid} cm</td>
                            <td className="p-3.5 text-center font-mono">
                              X: {item.errorX.toFixed(1)} | Y: {item.errorY.toFixed(1)}
                            </td>
                            <td className="p-3.5 text-center">
                              <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase ${
                                scorePass 
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                                  : 'bg-rose-50 text-rose-700 border border-rose-100'
                              }`}>
                                {scorePass ? 'PASS' : 'FAIL'}
                              </span>
                            </td>
                            <td className="p-3.5 text-center">
                              {gearGauges > 0 
                                ? <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-black">{gearGauges} ชิ้น</span>
                                : <span className="text-slate-400 font-light">-</span>
                              }
                            </td>
                            <td className="p-3.5 text-center font-semibold">
                              {(item.operatorSignature || item.operatorName) && (item.reviewerSignature || (item.reviewerName && item.reviewerName !== 'รอพิจารณาตรวจสอบ'))
                                ? <span className="text-emerald-600 font-bold font-sans">ครบถ้วนคู่ ✓</span> 
                                : <span className="text-slate-300">-</span>
                              }
                            </td>
                            <td className="p-3.5 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => triggerFormalPrint(history.indexOf(item))}
                                  className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-[10px] font-black transition-all flex items-center gap-1 cursor-pointer"
                                  title="ดูสรุปรายงานและกดพิมพ์รายงานทางการ"
                                >
                                  <Printer className="w-3.5 h-3.5" /> เรียกดู
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteHistoryItem(history.indexOf(item), item.machineId)}
                                  className="p-1 px-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-800 rounded-lg transition-all cursor-pointer"
                                  title="ลบรายงานนี้อย่างถาวร"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ==================== OFFICIAL PRINT REVIEW VIEW BLOCK ==================== */}
            {activeReportIndex !== null && history[activeReportIndex] && (
              <>
                <div 
                  className="bg-white border-2 border-slate-300 rounded-2xl p-8 max-w-4xl mx-auto space-y-6 shadow-lg text-slate-900 border"
                  id="clinical-printed-report-preview"
                >
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pb-4 border-b border-slate-200">
                  <span className="text-xs font-bold text-indigo-600 tracking-wider uppercase flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" /> พรีวิวหน้ารายงานใบรับรองโรงพยาบาล (Hospital Certificate Preview)
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setTimeout(() => {
                        window.print();
                      }, 100);
                    }}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-black rounded-lg flex items-center justify-center gap-1.5 shadow-md hover:shadow-lg transition-all cursor-pointer"
                  >
                    <span className="text-sm">🖨️</span> สั่งพิมพ์ / ออกเป็น PDF
                  </button>
                </div>

                {/* PDF Generation Guideline Banner */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-900 space-y-2 print:hidden shadow-sm">
                  <div className="flex items-center gap-2 text-blue-800 font-bold">
                    <span>📄</span>
                    <span>คู่มือการบันทึกรายงานเป็นไฟล์ PDF คุณภาพสูง (สำหรับผู้ปฏิบัติงาน):</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-1 text-[11px] text-blue-950 font-light pl-1.5 leading-relaxed">
                    <li>คลิกที่ปุ่ม <strong className="font-bold text-blue-800">"🖨️ สั่งพิมพ์ / ออกเป็น PDF"</strong> สีน้ำเงินด้านบน เพื่อเรียกหน้าต่างจัดพิมพ์ของเบราว์เซอร์</li>
                    <li>ในหน้าเลือกเครื่องพิมพ์ (Print Dialogue) ให้สังเกตหัวข้อ <strong className="font-bold text-blue-800">ปลายทาง (Destination)</strong></li>
                    <li>เปลี่ยนค่าปลายทางจากตัวเครื่องพิมพ์กระดาษ ให้เป็น <strong className="font-bold text-blue-800">"บันทึกเป็น PDF" (Save as PDF)</strong></li>
                    <li>แนะให้เลือกขนาดกระดาษเป็น <strong className="font-bold">A4</strong> แนะนำเปิดตัวเลือก <strong className="font-bold">"กราฟิกพื้นหลัง" (Background Graphics)</strong> เพื่อให้สีตารางเกณฑ์วัดผลและรูปภาพแสดงอย่างคมชัดสวยงาม</li>
                  </ol>
                </div>

                {/* Simulated physical paper formatting layout */}
                <div className="border border-slate-300 p-8 max-w-3xl mx-auto bg-white shadow-inner font-sans space-y-6 text-xs leading-relaxed text-black rounded-xl">
                  
                  {/* Document Institutional Header */}
                  <div className="text-center pb-4 border-b-2 border-slate-900">
                    <h2 className="text-xl font-bold tracking-tight text-center text-black">แบบรายงานสรุปประสิทธิภาพและสมรรถนะคุณภาพเครื่องรังสี</h2>
                    <p className="text-sm font-semibold text-slate-800 mt-1">แผนกรังสีเทคนิค โรงพยาบาลแม่ทา จังหวัดลำพูน (Maetha Hospital Radiology)</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">ส่วนประเมินด้านวิศวกรรมการแพทย์ เครื่องกลล็อคและแผงป้องกันรังสีไตรมาสเป็นทางการ</p>
                  </div>

                  {/* Identification block metadata */}
                  <div className="grid grid-cols-2 gap-4 border border-slate-200 p-3 bg-slate-50/50 rounded-lg">
                    <div>
                      <p><strong className="font-bold text-slate-700">วันเวลาตรวจประเมินสำเร็จ (Checked Date):</strong> {history[activeReportIndex].timestamp}</p>
                      <p className="mt-1"><strong className="font-bold text-slate-700">หมายเลขจำลองเครื่อง (Device ID):</strong> {history[activeReportIndex].machineId}</p>
                    </div>
                    <div>
                      <p><strong className="font-bold text-slate-700">ผู้ทำคัดกรองหลัก (Radiological Technologist):</strong> {history[activeReportIndex].operatorName}</p>
                      <p className="mt-1"><strong className="font-bold text-slate-700">หัวหน้าผู้ลงนามคุม (Radiologist Reviewer):</strong> {history[activeReportIndex].reviewerName}</p>
                    </div>
                  </div>

                  {/* Section 1: Mechanical audit Table block */}
                  <div>
                    <h4 className="text-xs font-bold text-black mb-1.5 pb-1 border-b border-slate-400 flex justify-between">
                      <span>• ผลการทดสอบประสิทธิภาพเชิงโครงสร้างและการใช้งานวิศวกรรมหลัก</span>
                      <span className="font-mono">เกณฑ์คุณลักษณะ F4</span>
                    </h4>
                    <table className="w-full text-left text-[11px] border-collapse border border-slate-300">
                      <thead>
                        <tr className="bg-indigo-50 border-b border-slate-300 text-slate-800 font-bold">
                          <th className="p-2 border-r border-slate-300 w-12 text-center text-black">#</th>
                          <th className="p-2 border-r border-slate-300 text-black">จุดและชิ้นส่วนตำแหน่งเล็งประเมิน</th>
                          <th className="p-2 border-r border-slate-300 w-32 text-center text-black">สภาพที่ตรวจพบ</th>
                          <th className="p-2 text-black">ความเห็นเพิ่มเติมเชิงช่าง</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-300 text-slate-700">
                        {history[activeReportIndex].mechanicalChecks.map((check, i) => (
                          <tr key={check.id}>
                            <td className="p-1.5 border-r border-slate-300 text-center font-mono">{i + 1}</td>
                            <td className="p-1.5 border-r border-slate-300 font-medium text-slate-800">{check.thaiLabel}</td>
                            <td className="p-1.5 border-r border-slate-300 text-center font-bold">
                              {check.status === 'PASS' 
                                ? <span className="text-emerald-700">ผ่านเกณฑ์สมบูรณ์ ✓</span> 
                                : <span className="text-rose-600 font-black">พบรอยบกพร่อง ✗</span>
                              }
                            </td>
                            <td className="p-1.5 font-light">{check.comments || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Section 2: Collimator alignment details */}
                  <div>
                    <h4 className="text-xs font-bold text-black mb-1.5 pb-1 border-b border-slate-400">
                      <span>• รายงานพิกัดคำนวณเบี่ยงเบนลำแสงคอลลิเมเตอร์ (Collimator accuracy parameters)</span>
                    </h4>
                    {(() => {
                      const colLinks = history[activeReportIndex].collimatorLinks 
                        ? history[activeReportIndex].collimatorLinks!.filter(l => l.trim() !== '') 
                        : [];

                      return (
                        <div className="grid grid-cols-4 gap-4">
                          {/* Left Column (3/4 width): metrics box */}
                          <div className="col-span-3 grid grid-cols-3 gap-3 border border-slate-200 p-3 bg-slate-50/50 rounded-lg text-center font-medium">
                            <div className="flex flex-col justify-center">
                              <span className="text-slate-500 block text-[10px] md:text-xs">ระยะฉายทดสอบ (SID)</span>
                              <strong className="text-sm md:text-base font-extrabold text-slate-800 font-mono">{history[activeReportIndex].sid} cm</strong>
                            </div>
                            <div className="flex flex-col justify-center border-l border-slate-200/40 px-2">
                              <span className="text-slate-500 block text-[10px] md:text-xs">ค่าคลาดเคลื่อนแนวเฉลยสูงสุด</span>
                              <strong className="text-sm md:text-base font-extrabold text-slate-800 font-mono">
                                X = {history[activeReportIndex].errorX.toFixed(1)} cm | Y = {history[activeReportIndex].errorY.toFixed(1)} cm
                              </strong>
                            </div>
                            <div className="flex flex-col justify-center border-l border-slate-200/40 pl-2">
                              <span className="text-slate-500 block text-[10px] md:text-xs">บทวิเคราะห์ระบบความปลอดภัย</span>
                              <strong className={`text-xs md:text-sm font-extrabold ${history[activeReportIndex].alignmentResult === 'PASS' ? 'text-emerald-700' : 'text-rose-600'}`}>
                                {history[activeReportIndex].alignmentResult === 'PASS' ? 'ผ่านมาตรฐาน (PASS)' : 'ตกมาตรฐาน (FAIL)'}
                              </strong>
                            </div>
                          </div>

                          {/* Right Column (1/4 width): large photo / HUD fallback */}
                          <div className="col-span-1 border-l border-slate-200 pl-4 space-y-2">
                            <div className="text-[10px] font-bold text-slate-700 pb-1 mb-1 bg-slate-50 p-1 rounded border border-slate-100 text-center">
                              📸 ภาพอ้างอิงลำแสง
                            </div>
                            <div className="space-y-2">
                              {colLinks.length > 0 ? (
                                colLinks.map((link, idx) => (
                                  <div key={idx} className="relative group/print w-full h-32 border border-slate-200 rounded-lg overflow-hidden bg-slate-50 shadow-sm transition-all hover:shadow cursor-pointer">
                                    <a
                                      href={link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="w-full h-full block"
                                      title="คลิกเพื่อเปิดดูรูปภาพความละเอียดสูงในแท็บใหม่"
                                    >
                                      <InspectionImage 
                                        src={link} 
                                        type="collimator"
                                        sid={history[activeReportIndex].sid}
                                        errorX={history[activeReportIndex].errorX}
                                        errorY={history[activeReportIndex].errorY}
                                        alignmentResult={history[activeReportIndex].alignmentResult}
                                      />
                                    </a>
                                  </div>
                                ))
                              ) : (
                                // No custom image? Render the calibration HUD SVG directly!
                                <div className="w-full h-32">
                                  <InspectionImage 
                                    type="collimator"
                                    sid={history[activeReportIndex].sid}
                                    errorX={history[activeReportIndex].errorX}
                                    errorY={history[activeReportIndex].errorY}
                                    alignmentResult={history[activeReportIndex].alignmentResult}
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Section 3: Radiation Shields list */}
                  <div>
                    <h4 className="text-xs font-bold text-black mb-1.5 pb-1 border-b border-slate-400">
                      <span>• แบบรายงานผลการฉายรังสีตรวจแตกร้าวของแผ่นตะกั่วกำบัง (Shield protection list)</span>
                    </h4>
                    {(() => {
                      const gears = history[activeReportIndex].protectionGear || [];
                      
                      if (gears.length === 0) {
                        return (
                          <div className="p-3 text-center text-slate-400 bg-slate-50 rounded-lg border border-slate-200 italic text-[11px]">
                            ไม่ได้พ่วงหรือระบุจัดตรวจอุปกรณ์ป้องกันรังสีสำหรับเครื่องประเภทนี้
                          </div>
                        );
                      }

                      return (
                        <div className="grid grid-cols-4 gap-4">
                          {/* Left Column: 3/4 width results table */}
                          <div className="col-span-3">
                            <table className="w-full text-left text-[11px] border-collapse border border-slate-300">
                              <thead>
                                <tr className="bg-indigo-50 border-b border-slate-300 text-slate-800 font-bold">
                                  <th className="p-2 border-r border-slate-300 text-black">รหัสตรวจวัด / ยี่ห้อเกราะป้องกัน</th>
                                  <th className="p-2 border-r border-slate-300 text-black w-36 text-center">สภาพเย็บขอบตะกั่วภายนอก</th>
                                  <th className="p-2 text-center text-black w-40">ผลเบี่ยงเบนหรือรอยแตกรังสี</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-300 text-slate-800">
                                {gears.map((g, i) => (
                                  <tr key={i}>
                                    <td className="p-1.5 border-r border-slate-300 font-mono font-bold text-slate-900">{g.equipmentId}</td>
                                    <td className="p-1.5 border-r border-slate-300 text-center">
                                      {g.visualStatus === 'Normal' ? 'สมบูรณ์ดี' : 'ชำรุดเสียหายเกลียวหัก'}
                                    </td>
                                    <td className="p-1.5 text-center font-bold">
                                      {g.crackStatus === 'No Cracks' 
                                        ? <span className="text-emerald-700 font-bold">ไม่มีร้าวผ่านฉลุย (PASS)</span> 
                                        : <span className="text-rose-600 font-black">พบแนวร้าวรังสีรั่ว (FAIL)</span>
                                      }
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>

                          {/* Right Column: 1/4 width large image section */}
                          <div className="col-span-1 border-l border-slate-200 pl-4 space-y-3">
                            <div className="text-[10px] font-bold text-slate-700 border-b border-slate-200 pb-1 mb-2 bg-slate-50 px-1 py-0.5 rounded text-center">
                              📸 ภาพถ่ายตรวจสภาพจริง
                            </div>
                            <div className="space-y-3">
                              {gears.map((g, idx) => (
                                <div key={idx} className="space-y-1">
                                  <div className="relative block w-full h-32 border border-slate-200 rounded-lg overflow-hidden bg-slate-50 transition-all hover:shadow cursor-pointer group">
                                    {g.imageUrl ? (
                                      <a
                                        href={g.imageUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full h-full block"
                                        title={`คลิกเพื่อเปิดดูภาพความละเอียดสูงของ ${g.equipmentId}`}
                                      >
                                        <InspectionImage 
                                          src={g.imageUrl} 
                                          type="shield"
                                          equipmentId={g.equipmentId}
                                          visualStatus={g.visualStatus}
                                          crackStatus={g.crackStatus}
                                        />
                                      </a>
                                    ) : (
                                      <InspectionImage 
                                        type="shield"
                                        equipmentId={g.equipmentId}
                                        visualStatus={g.visualStatus}
                                        crackStatus={g.crackStatus}
                                      />
                                    )}
                                  </div>
                                  <div className="text-[8px] font-bold text-slate-700 truncate text-center bg-slate-50 border border-slate-200/60 px-1 py-0.5 rounded-md" title={g.equipmentId}>
                                    {g.equipmentId}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Suggestion Comments box */}
                  <div className="p-3 border border-slate-200 bg-slate-50/50 rounded-lg">
                    <strong className="block font-bold text-slate-800 mb-1">ความเห็นเชิงวิเคราะห์และการบูรณะความปลอดภัยรอบด้าน:</strong>
                    <p className="italic text-slate-600 font-medium">
                      {history[activeReportIndex].suggestions || "ไม่มีบันทึกความคิดเห็นแจ้งเพิ่มเติมสำหรับไตรมาสตรวจประเมินจุดนี้"}
                    </p>
                  </div>

                  {/* Signature seals panel */}
                  <div className="pt-8 grid grid-cols-2 gap-10 text-center">
                    <div className="flex flex-col items-center justify-end">
                      <div className="w-48 h-14 border-b border-slate-455 flex items-center justify-center">
                        {history[activeReportIndex].operatorSignature ? (
                          <img 
                            src={history[activeReportIndex].operatorSignature} 
                            alt="Operator Sign" 
                            className="max-h-12 object-contain"
                          />
                        ) : (
                          <span className="font-signature text-2xl text-blue-800 select-none transform -rotate-2 font-semibold">
                            {history[activeReportIndex].operatorName}
                          </span>
                        )}
                      </div>
                      <span className="mt-1.5 text-slate-800 font-bold">{history[activeReportIndex].operatorName}</span>
                      <span className="text-[9px] text-slate-400 font-light mt-0.5">พนักงานผู้ดูแลการตรวจรังสีเทียบจุด (Operator)</span>
                    </div>

                    <div className="flex flex-col items-center justify-end">
                      <div className="w-48 h-14 border-b border-slate-455 flex items-center justify-center">
                        {history[activeReportIndex].reviewerSignature ? (
                          <img 
                            src={history[activeReportIndex].reviewerSignature} 
                            alt="Reviewer Sign" 
                            className="max-h-12 object-contain"
                          />
                        ) : (
                          history[activeReportIndex].reviewerName && history[activeReportIndex].reviewerName !== 'รอพิจารณาตรวจสอบ' ? (
                            <span className="font-signature text-2xl text-indigo-800 select-none transform -rotate-2 font-semibold">
                              {history[activeReportIndex].reviewerName}
                            </span>
                          ) : (
                            <span className="text-slate-300 font-light italic text-[10px]">ยังรอการเซ็นลงนามคู่</span>
                          )
                        )}
                      </div>
                      <span className="mt-1.5 text-slate-800 font-bold">
                        {history[activeReportIndex].reviewerName || '...........................................'}
                      </span>
                      <span className="text-[9px] text-slate-400 font-light mt-0.5">หัวหน้ารังสีวิทยาควบคุมกลไก (Reviewer Check)</span>
                    </div>
                  </div>

                  {/* Footer institutional values */}
                  <div className="text-center pt-8 border-t border-slate-200 text-[10px] text-slate-400 uppercase tracking-widest font-mono">
                    Maetha Hospital community Radiology Dept • Tel: 053-976104 • Lumphun Thailand 51150
                  </div>

                </div>
              </div>

              {/* Interactive clinical touchscreen signature pad for the active report */}
              <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl p-6 mt-6 print:hidden">
                <h3 className="text-xs font-bold text-indigo-400 mb-1 flex items-center gap-1.5 uppercase font-mono tracking-wider">
                  <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" /> ลงลายมือชื่อควบคุมด้วยระบบจอสัมผัส (Active Touchscreen Signatures Panel)
                </h3>
                <p className="text-[11px] text-slate-400 mb-4 font-light">สามารถขีดเขียนเซ็นกำกับบนหน้าจอมือถือ แท็บเล็ต หรือเมาส์ เพื่อบันทึกภาพลายเซ็นจริงสะท้อนลงในแผ่นพิมพ์ทางการด้านบนอัตโนมัติ</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <SignaturePad 
                    label="ลายหัตถเลขา: ผู้บันทึกตรวจ (Operator Signature)"
                    sublabel={history[activeReportIndex].operatorName}
                    canvasId="report-touch-operator"
                    value={history[activeReportIndex].operatorSignature}
                    onSave={(base64) => {
                      setHistory(prev => prev.map((item, idx) => idx === activeReportIndex ? { ...item, operatorSignature: base64 } : item));
                      showToast("ลงชื่อสำเร็จ", "ระบบผูกลายเซ็นลงแผ่นรายงานเรียบร้อยแล้ว", "success");
                    }}
                    onClear={() => {
                      setHistory(prev => prev.map((item, idx) => idx === activeReportIndex ? { ...item, operatorSignature: '' } : item));
                    }}
                  />

                  <SignaturePad 
                    label="ลายหัตถเลขา: ผู้อนุมัติสรุปเทคนิค (Reviewer Signature)"
                    sublabel={history[activeReportIndex].reviewerName || "หัวหน้ารังสีเทคนิค"}
                    canvasId="report-touch-reviewer"
                    value={history[activeReportIndex].reviewerSignature}
                    onSave={(base64) => {
                      setHistory(prev => prev.map((item, idx) => idx === activeReportIndex ? { ...item, reviewerSignature: base64 } : item));
                      showToast("ลงชื่อผู้อนุมัติสำเร็จ", "ระบบบันทึกลายเซ็นผู้อนุมัติร่วมลงนามคู่อย่างทางการ", "success");
                    }}
                    onClear={() => {
                      setHistory(prev => prev.map((item, idx) => idx === activeReportIndex ? { ...item, reviewerSignature: '' } : item));
                    }}
                  />
                </div>
              </div>
            </>
          )}

          </div>
        )}

      </main>

      {/* 4. Global application layout Footer - HIDDEN IN PRINTING */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-center py-6 text-xs mt-12 print:hidden">
        <div className="max-w-7xl mx-auto px-4 space-y-1.5">
          <p className="font-bold text-slate-300">ระบบตรวจคุณภาพและสมรรถนะเครื่องเอกซเรย์คัดกรอง • โรงพยาบาลแม่ทา (โรงพยาบาลชุมชนขนาด 30 เตียง จังหวัดลำพูน)</p>
          <p className="text-[10px] text-slate-500 font-mono">Maetha Hospital Radiology Quality Control System v2.1.0 • Decoupled GitHub Core Engine</p>
        </div>
      </footer>

      {/* 5. Floating Toast Notification */}
      <div 
        className={`fixed bottom-6 right-6 z-50 bg-slate-900 text-white rounded-xl py-3.5 px-5 shadow-2xl border border-slate-800 flex items-center gap-3.5 transition-all duration-300 transform ${
          toast.show ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'
        }`}
      >
        <div className={`p-1.5 rounded-lg ${
          toast.status === 'success' 
            ? 'bg-emerald-500/10 text-emerald-400' 
            : toast.status === 'error'
              ? 'bg-rose-500/10 text-rose-400'
              : 'bg-indigo-500/10 text-indigo-400'
        }`}>
          {toast.status === 'success' ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : (
            <Info className="w-5 h-5" />
          )}
        </div>
        <div>
          <h5 className="text-xs font-bold text-slate-100">{toast.title}</h5>
          <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{toast.body}</p>
        </div>
      </div>

    </div>
  );
}
