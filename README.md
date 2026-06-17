# Maetha Hospital Radiology Quality Control & Mechanical Inspection System
### ระบบรายงานตรวจคุณภาพรังสีและชิ้นส่วนเชิงกลประจำไตรมาส (3-6 เดือน) — โรงพยาบาลแม่ทา (โรงพยาบาลชุมชน 30 เตียง จังหวัดลำพูน)

This repository contains the decoupled, highly optimized, production-ready Full-Stack React Core running on Vite, Tailwind CSS, TypeScript, and Framer Motion. 

---

## 🌟 Key Functional Features
1. **Mechanical structural verification form**: Custom quarterly checklists representing medical safety standards (Stability, braking, locks, cables, displays).
2. **Collimator Visual Alignment Target Simulator**: 9-dot radiograph calibration simulation conforming to 2% SID error bounds. Supports multiple reference calibration links.
3. **Lead shield crack detection records**: Log and catalog lead aprons, gloves, thyroid collars external stitches status and inside crack leakage results.
4. **Active Touchscreen signatures**: Draw and capture signatures on tablet, stylus, or touch device directly inside the report preview page. Keeps the core form uncluttered.
5. **Cursive handwriting font fallback**: Auto-generates beautiful high-fidelity ink-styled digital handwriting signatures as dynamic backups.
6. **Local Storage offline-safe state**: All logged checks are fully preserved under local sandboxed caching.

---

## 📁 File Structure
- `src/App.tsx` - Core parent application managing form states, interactive logic, print layout, and storage syncing.
- `src/components/SignaturePad.tsx` - Interactive micro-smooth HTML5 Canvas element supporting anti-aliased drawn vectors.
- `src/components/BeamVisualizer.tsx` - Live mathematical offset SVG simulations.
- `src/types.ts` - Declared TypeScript validation schemas and records.

---

## 🛠️ Step-by-Step Installation

### Prerequisites
- Node.js (version 18 or higher)
- npm or yarn

### Setup Instructions
1. **Clone the repository**:
   ```bash
   git clone <your-github-repo-url>
   cd <your-repo-folder>
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run local developer server**:
   ```bash
   npm run dev
   ```
   Open your browser to the local live port.

4. **Compile production build**:
   ```bash
   npm run build
   ```

---

*Maetha Hospital Community Medical Radiology Dept • Designed with medical precision for Lumphun, Thailand.*
