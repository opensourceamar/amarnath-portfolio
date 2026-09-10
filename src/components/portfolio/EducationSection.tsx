import React, { useState, useEffect, useRef } from 'react';
import {
  GraduationCap,
  Calendar,
} from 'lucide-react';

interface EduCard {
  id: string;
  order: string;
  degree: string;
  institution: string;
  year: string;
  grade: string;
  status: string;
  description: string;
  image: string;
}

const EDU_CARDS: EduCard[] = [
  {
    id: 'btech',
    order: '01',
    degree: 'B.Tech — Information Technology',
    institution: 'Velagapudi Ramakrishna Siddhartha Engineering College',
    year: '11/2022 - 04/2026',
    grade: 'CGPA: 7.87',
    status: 'Completed',
    description: 'Completed B.Tech in Information Technology, focusing on software engineering, web development, algorithms, and database management.',
    image: '/edu-btech.jpg',
  },
  {
    id: 'inter',
    order: '02',
    degree: 'Intermediate (MPC)',
    institution: 'Sri Chaitanya Junior College',
    year: '04/2020 - 04/2022',
    grade: 'Percentage: 86.3%',
    status: 'Completed',
    description: 'Completed higher secondary education with Mathematics, Physics, and Chemistry (MPC).',
    image: '/edu-inter.jpg',
  },
  {
    id: 'cbse',
    order: '03',
    degree: '10th Class (CBSE)',
    institution: 'K.C.P Siddhartha Adarsh Residential Public School',
    year: '03/2020',
    grade: 'Percentage: 70.0%',
    status: 'Completed',
    description: 'Completed 10th standard secondary school education under the CBSE curriculum.',
    image: '/edu-ssc.jpg',
  },
];

const EducationSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);

  // Split-card state for education degree cards
  const [splitProgress, setSplitProgress] = useState<number>(1);
  const [manualOverride, setManualOverride] = useState<boolean | null>(null);
  const [hoveredEduId, setHoveredEduId] = useState<string | null>(null);

  // Fast, Responsive Dynamic Scroll Split Engine
  useEffect(() => {
    const sectionEl = sectionRef.current;
    if (!sectionEl) return;

    const scrollParent = sectionEl.closest('.overflow-y-auto') || window;

    const handleScroll = () => {
      if (!sectionEl) return;
      const rect = sectionEl.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Degree cards center in viewport
      const cardAreaCenter = rect.top + 320;
      const viewportCenter = viewportHeight / 2;
      const distFromCenter = Math.abs(cardAreaCenter - viewportCenter);

      const centerDeadZone = 80;
      const maxFalloffRange = viewportHeight * 0.38;

      if (distFromCenter <= centerDeadZone) {
        setSplitProgress(1);
      } else {
        const normalized = (distFromCenter - centerDeadZone) / (maxFalloffRange - centerDeadZone);
        const progress = Math.max(0, Math.min(1, 1 - normalized));
        setSplitProgress(progress);
      }
    };

    scrollParent.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll();

    return () => {
      scrollParent.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const effectiveSplit = manualOverride !== null ? (manualOverride ? 1 : 0) : splitProgress;

  return (
    <div
      ref={sectionRef}
      className="relative w-full h-full min-h-[calc(100vh-4rem)] flex flex-col justify-start items-center bg-[#000000] text-slate-100 overflow-hidden select-none font-sans pt-2 sm:pt-3 pb-3 px-4 sm:px-6"
    >
      {/* Background Ambient Radiance */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-white/[0.02] rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[850px] h-[450px] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.04)_0%,transparent_70%)]" />
      </div>

      <div className="relative z-10 w-full max-w-6xl flex flex-col items-center gap-2 sm:gap-3">
        {/* ===================================================================== */}
        {/* SECTION HEADER: ACADEMIC BACKGROUND & DEGREES                         */}
        {/* ===================================================================== */}
        <div className="flex flex-col items-center text-center space-y-1 pt-1">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-white/15 bg-white/5 backdrop-blur-md text-xs font-mono tracking-widest text-slate-300 uppercase">
            <GraduationCap size={14} className="text-white" />
            <span>ACADEMIC BACKGROUND &amp; QUALIFICATIONS</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white leading-none">
            EDUCATION
          </h2>
        </div>

        {/* ===================================================================== */}
        {/* DESKTOP: SPLIT & CONVERGE DEGREE CARDS (md+ screens)                 */}
        {/* ===================================================================== */}
        <div className="hidden md:flex relative w-full max-w-5xl min-h-[420px] sm:min-h-[440px] items-center justify-center mt-2">
          <div className="relative w-full h-[420px] sm:h-[440px] flex items-center justify-center">
            {EDU_CARDS.map((card, index) => {
              const offsets = [-348, 0, 348];
              const targetX = offsets[index];
              const currentX = targetX * effectiveSplit;

              const stackRotations = [-4, 0, 4];
              const currentRotation = stackRotations[index] * (1 - effectiveSplit);

              const stackYOffsets = [0, 8, 16];
              const currentY = stackYOffsets[index] * (1 - effectiveSplit);

              const isHovered = hoveredEduId === card.id;

              return (
                <div
                  key={card.id}
                  onMouseEnter={() => setHoveredEduId(card.id)}
                  onMouseLeave={() => setHoveredEduId(null)}
                  className="edu-card absolute w-[290px] sm:w-[305px] md:w-[315px] h-[395px] sm:h-[410px] rounded-3xl border border-white/15 bg-gradient-to-b from-[#11141d]/95 via-[#0b0d13]/95 to-[#06070a]/95 text-left shadow-[0_15px_40px_rgba(0,0,0,0.85)] backdrop-blur-2xl transition-transform duration-200 ease-out overflow-hidden flex flex-col justify-between group hover:border-white/50 hover:shadow-[0_0_35px_rgba(255,255,255,0.2)] cursor-pointer"
                  style={{
                    transform: `translate3d(${currentX}px, ${currentY}px, 0px) rotate(${currentRotation}deg) scale(${
                      isHovered ? 1.04 : 1
                    })`,
                    zIndex: isHovered ? 50 : 10 + index,
                  }}
                >
                  {/* Card Media Header - Full Rich Original Colors */}
                  <div className="relative h-40 w-full overflow-hidden">
                    <img
                      src={card.image}
                      alt={card.degree}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b0d13] via-[#0b0d13]/40 to-transparent" />

                    <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1 text-[11px] font-medium text-slate-300 bg-black/60 px-2 py-0.5 rounded-md border border-white/10">
                        <Calendar size={11} className="text-slate-300" />
                        {card.year}
                      </span>
                      <span className="text-[11px] font-bold text-white bg-white/15 px-2.5 py-0.5 rounded-md border border-white/25">
                        {card.grade}
                      </span>
                    </div>
                  </div>

                  {/* Card Content Details */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-start">
                    <h3 className="text-base sm:text-lg font-black text-white tracking-tight leading-snug mb-1 group-hover:text-slate-200 transition-colors">
                      {card.degree}
                    </h3>
                    <p className="text-xs font-medium text-slate-400 mb-2.5 line-clamp-2">
                      {card.institution}
                    </p>
                    <p className="text-xs leading-relaxed text-slate-300 font-light line-clamp-4">
                      {card.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ===================================================================== */}
        {/* MOBILE: SWIPEABLE SNAP CAROUSEL (< md screens)                        */}
        {/* ===================================================================== */}
        <div className="flex md:hidden flex-col items-center w-full mt-1">
          <div className="w-full flex gap-3 overflow-x-auto snap-x snap-mandatory px-3 py-2 scrollbar-hide">
            {EDU_CARDS.map((card) => (
              <div
                key={`mob-${card.id}`}
                className="w-[280px] shrink-0 snap-center rounded-2xl border border-white/15 bg-gradient-to-b from-[#11141d]/95 via-[#0b0d13]/95 to-[#06070a]/95 text-left shadow-[0_10px_30px_rgba(0,0,0,0.85)] backdrop-blur-2xl overflow-hidden flex flex-col justify-between"
              >
                {/* Card Media Header */}
                <div className="relative h-36 w-full overflow-hidden">
                  <img
                    src={card.image}
                    alt={card.degree}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b0d13] via-[#0b0d13]/40 to-transparent" />

                  <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1 text-[10px] font-medium text-slate-300 bg-black/70 px-2 py-0.5 rounded-md border border-white/10">
                      <Calendar size={10} className="text-slate-300" />
                      {card.year}
                    </span>
                    <span className="text-[10px] font-bold text-white bg-white/20 px-2 py-0.5 rounded-md border border-white/25">
                      {card.grade}
                    </span>
                  </div>
                </div>

                {/* Card Content Details */}
                <div className="p-3.5 flex-1 flex flex-col justify-start">
                  <h3 className="text-sm font-black text-white tracking-tight leading-snug mb-1">
                    {card.degree}
                  </h3>
                  <p className="text-[11px] font-medium text-slate-400 mb-1.5 line-clamp-2">
                    {card.institution}
                  </p>
                  <p className="text-[11px] leading-relaxed text-slate-300 font-light line-clamp-3">
                    {card.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Swipe indicator */}
          <div className="flex items-center gap-1.5 mt-2 text-[10px] font-mono text-slate-400">
            <span>◀ SWIPE TO VIEW DEGREES ▶</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducationSection;
