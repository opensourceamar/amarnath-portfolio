import React, { useState, useEffect, useRef } from 'react';
import {
  Check,
  ArrowUpRight,
} from 'lucide-react';

interface ContactSectionProps {
  onGoBack?: () => void;
}

const ContactSection: React.FC<ContactSectionProps> = ({ onGoBack }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // State
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Mouse & Dynamic Stickman Physics Tracking
  const beamAngleRef = useRef<{ current: number; target: number }>({ current: 0.5, target: 0.5 });
  const [animatedBeamX, setAnimatedBeamX] = useState<number>(0.5);

  // =========================================================================
  // 1. MOUSE & TOUCH TRACKING
  // =========================================================================
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const relX = Math.max(0, Math.min(1, (e.clientX - rect.left) / (rect.width || window.innerWidth || 1)));
      beamAngleRef.current.target = relX;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const container = containerRef.current;
      if (!container || !e.touches[0]) return;

      const rect = container.getBoundingClientRect();
      const relX = Math.max(0, Math.min(1, (e.touches[0].clientX - rect.left) / (rect.width || window.innerWidth || 1)));
      beamAngleRef.current.target = relX;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchstart', handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchstart', handleTouchMove);
    };
  }, []);

  // Smooth Pendulum Physics for Half-Body Upside-Down Stickman & Light Cone
  useEffect(() => {
    let animId: number;
    const animateStickman = () => {
      const diff = beamAngleRef.current.target - beamAngleRef.current.current;
      beamAngleRef.current.current += diff * 0.085;
      setAnimatedBeamX(beamAngleRef.current.current);
      animId = requestAnimationFrame(animateStickman);
    };
    animId = requestAnimationFrame(animateStickman);
    return () => cancelAnimationFrame(animId);
  }, []);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const handleScrollToAbout = () => {
    if (onGoBack) {
      onGoBack();
    } else {
      const el = document.getElementById('about');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // =========================================================================
  // 2. HALF-BODY UPSIDE-DOWN STICKMAN & UNIFIED LIGHT CONE COORDINATES
  // =========================================================================
  // Stickman X swings horizontally from ~28% to 72% across the top
  const stickmanXPercent = 50 + (animatedBeamX - 0.5) * 44;
  const bodyLeanDeg = (animatedBeamX - 0.5) * 20; // Pendulum body tilt
  const lampYPx = 122; // Exact vertical position of the glowing bulb

  // Dynamic triangular light cone originating directly from the held lamp bulb
  const leftBase = Math.max(-10, stickmanXPercent - 42);
  const rightBase = Math.min(110, stickmanXPercent + 42);
  const lightPolygon = `polygon(${stickmanXPercent}% ${lampYPx}px, ${leftBase}% 100%, ${rightBase}% 100%)`;

  return (
    <div
      ref={containerRef}
      className="relative h-[calc(100vh-4rem)] w-full flex flex-col justify-between items-center bg-[#000000] text-slate-100 overflow-hidden select-none font-sans"
    >
      {/* ===================================================================== */}
      {/* 1. HALF-BODY UPSIDE-DOWN HANGING STICKMAN HOLDING THE LAMP           */}
      {/* ===================================================================== */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        {/* Dynamic Half-Body Upside-Down Stickman Container */}
        <div
          className="absolute pointer-events-none flex flex-col items-center justify-center transition-transform duration-75"
          style={{
            left: `${stickmanXPercent}%`,
            top: '0px',
            transform: `translateX(-50%) rotate(${bodyLeanDeg}deg)`,
            transformOrigin: 'top center',
          }}
        >
          {/* Half-Body Stickman SVG */}
          <svg width="130" height="150" viewBox="0 0 130 150" className="overflow-visible">
            <defs>
              <linearGradient id="halfShadeGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#2e323b" />
                <stop offset="50%" stopColor="#606674" />
                <stop offset="75%" stopColor="#c5cad6" />
                <stop offset="100%" stopColor="#353944" />
              </linearGradient>
            </defs>

            {/* --- TORSO DROPPING INTO FRAME FROM CEILING --- */}
            <line x1="65" y1="0" x2="65" y2="48" stroke="#ffffff" strokeWidth="4.5" strokeLinecap="round" />

            {/* --- HEAD POINTING DOWNWARDS --- */}
            <circle cx="65" cy="62" r="10" fill="#ffffff" stroke="#000000" strokeWidth="1.5" />

            {/* --- ARMS --- */}
            {/* Arm 1 (Reaching up holding ceiling frame) */}
            <polyline
              points="65,42 42,22 46,0"
              fill="none"
              stroke="#ffffff"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Arm 2 (Reaching down & firmly holding the lamp) */}
            <polyline
              points="65,42 84,62 65,86"
              fill="none"
              stroke="#ffffff"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* --- THE HELD CONICAL LAMP --- */}
            {/* Top Mounting Ring held in hand */}
            <rect x="59" y="86" width="12" height="4" rx="1" fill="#888d9a" stroke="#ffffff" strokeWidth="1" />

            {/* Conical Metallic Lampshade */}
            <polygon
              points="57,90 73,90 95,120 35,120"
              fill="url(#halfShadeGradient)"
              stroke="#ffffff"
              strokeWidth="1.2"
            />
            {/* Bottom Shade Lip Highlight */}
            <line x1="35" y1="120" x2="95" y2="120" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />

            {/* Pull-String Switch with Bead */}
            <line x1="88" y1="120" x2="93" y2="140" stroke="#9ca3af" strokeWidth="1.2" strokeDasharray="1.5,1.5" />
            <circle cx="93" cy="142" r="3.5" fill="#6b7280" stroke="#ffffff" strokeWidth="0.8" />
          </svg>

          {/* Glowing Luminous Bulb nested under the held lamp (Exactly at apex) */}
          <div
            className="w-5 h-5 rounded-full bg-white shadow-[0_0_25px_rgba(255,255,255,1),0_0_50px_rgba(255,255,255,0.9),0_0_90px_rgba(255,255,255,0.7)] -mt-7 z-10"
            style={{
              filter: 'drop-shadow(0 0 14px #ffffff)',
            }}
          />

          {/* "< GO BACK" Action Button beside Stickman's Held Lamp */}
          <button
            onClick={handleScrollToAbout}
            className="absolute left-[98px] top-[116px] pointer-events-auto text-[10px] font-mono font-bold tracking-widest text-slate-300 hover:text-white uppercase transition-colors whitespace-nowrap flex items-center gap-1 cursor-pointer bg-black/60 px-2 py-0.5 rounded border border-white/20 backdrop-blur-xs"
            title="Click to Go Back"
          >
            <span>&lt; GO BACK</span>
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 3. DYNAMIC RADIANT LIGHT CONE (Emanates from Stickman's Lamp Bulb)   */}
      {/* ===================================================================== */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {/* Outer Atmospheric Soft Glow Beam */}
        <div
          className="absolute inset-0 w-full h-full bg-gradient-to-b from-white/25 via-white/10 to-transparent blur-xl transition-all duration-75"
          style={{
            clipPath: lightPolygon,
          }}
        />

        {/* The Sharp Triangular Paper-Grained Light Beam */}
        <div
          className="absolute inset-0 w-full h-full bg-gradient-to-b from-[#ffffff] via-[#e5e7eb] to-[#d1d5db] shadow-[0_0_150px_rgba(255,255,255,0.35)] transition-all duration-75"
          style={{
            clipPath: lightPolygon,
            filter: 'contrast(1.15) brightness(1.05)',
          }}
        >
          {/* Real Paper Grain Noise Texture Overlay */}
          <div className="absolute inset-0 opacity-45 mix-blend-multiply bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:14px_14px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/5" />

          {/* Technical Center Alignment Guideline */}
          <div
            className="absolute top-0 bottom-0 w-[1px] bg-black/15 transition-all duration-75"
            style={{
              left: `${stickmanXPercent}%`,
            }}
          />

          {/* Technical Coordinate Crosshairs */}
          <div className="absolute top-1/4 left-1/4 text-[9px] font-mono text-black/30 select-none">
            + [ 16°31'N 80°38'E ]
          </div>
          <div className="absolute top-1/3 right-1/4 text-[9px] font-mono text-black/30 select-none">
            + [ PORTFOLIO 2026 ]
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 4. CENTER CONTENT BATHED IN THE MOVING LIGHT BEAM                    */}
      {/* ===================================================================== */}
      <div className="relative z-20 w-full max-w-2xl flex-1 flex flex-col items-center justify-center text-center px-6 py-1 pointer-events-none">
        <div className="w-full flex flex-col items-center justify-center space-y-2.5 pt-16 sm:pt-20 pb-1">
          {/* Headline */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-black uppercase leading-none">
            GET IN TOUCH
          </h2>

          {/* Contact Description */}
          <p className="text-[11px] sm:text-xs md:text-sm text-black/85 font-medium leading-relaxed max-w-md mx-auto px-2">
            Feel free to reach out for new opportunities, project collaborations, technical inquiries, or simply to say hello. You can connect with me using the details and direct links below.
          </p>

          {/* Plain-Text Contact Details (Boxless, Elegant Typography) */}
          <div className="w-full max-w-md space-y-2 pointer-events-auto pt-1 text-black font-mono text-xs">
            {/* Email Line */}
            <div className="flex items-center justify-between py-0.5 border-b border-black/15 hover:border-black/40 transition-colors">
              <span className="text-black/60 text-[10px] sm:text-[11px] uppercase tracking-wider font-bold">
                EMAIL
              </span>
              <div className="flex items-center gap-2">
                <a
                  href="mailto:amarnathankem@gmail.com"
                  className="font-bold hover:underline tracking-tight text-black text-[11px] sm:text-xs"
                >
                  amarnathankem@gmail.com
                </a>
                <button
                  onClick={() => handleCopy('amarnathankem@gmail.com', 'email')}
                  className="text-[10px] text-black/50 hover:text-black underline uppercase cursor-pointer"
                  title="Copy Email"
                >
                  {copiedField === 'email' ? <Check size={11} className="inline text-green-700" /> : '[copy]'}
                </button>
              </div>
            </div>

            {/* Location Line */}
            <div className="flex items-center justify-between py-0.5 border-b border-black/15">
              <span className="text-black/60 text-[10px] sm:text-[11px] uppercase tracking-wider font-bold">
                LOCATION
              </span>
              <span className="text-black/80 font-medium text-[11px] sm:text-xs">
                Vijayawada, Andhra Pradesh, India
              </span>
            </div>

            {/* Direct Links */}
            <div className="flex items-center justify-center gap-6 pt-1.5 text-[11px] font-bold">
              <a
                href="https://www.linkedin.com/in/amarnath-ankem-981788255/?skipRedirect=true"
                target="_blank"
                rel="noreferrer"
                className="hover:underline flex items-center gap-1 text-black"
              >
                <span>LINKEDIN</span>
                <ArrowUpRight size={10} />
              </a>
              <span>/</span>
              <a
                href="https://github.com/opensourceamar"
                target="_blank"
                rel="noreferrer"
                className="hover:underline flex items-center gap-1 text-black"
              >
                <span>GITHUB</span>
                <ArrowUpRight size={10} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 5. COLOSSAL SPLIT-TONE `CONTACT` FOOTER                               */}
      {/* ===================================================================== */}
      <div className="relative z-10 w-full overflow-hidden text-center pb-0 pointer-events-none select-none">
        {/* Background Dark Layer (Outside Light) */}
        <h1 className="text-[11vw] sm:text-[12.5vw] md:text-[13vw] font-black uppercase tracking-tighter leading-none text-[#18181b] opacity-80">
          CONTACT
        </h1>

        {/* Foreground Black Layer (Inside Light Cone via Clip-Path) */}
        <div
          className="absolute inset-0 w-full h-full overflow-hidden flex items-end justify-center"
          style={{
            clipPath: lightPolygon,
          }}
        >
          <h1 className="text-[11vw] sm:text-[12.5vw] md:text-[13vw] font-black uppercase tracking-tighter leading-none text-black">
            CONTACT
          </h1>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;
