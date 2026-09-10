import React from 'react';

const SideStrips: React.FC = () => {
  const textSequence = [
    { text: 'ANKEM AMARNATH', highlight: true },
    { text: 'PORTFOLIO', highlight: false },
    { text: 'ANKEM AMARNATH', highlight: true },
    { text: 'PORTFOLIO', highlight: false },
    { text: 'ANKEM AMARNATH', highlight: true },
    { text: 'PORTFOLIO', highlight: false },
    { text: 'ANKEM AMARNATH', highlight: true },
    { text: 'PORTFOLIO', highlight: false },
  ];

  const renderTrack = (prefix: string) => (
    <div className="flex flex-col items-center gap-7 py-3">
      {textSequence.map((item, idx) => (
        <React.Fragment key={`${prefix}-${idx}`}>
          <span
            className={`font-mono text-[10px] sm:text-[11px] font-bold tracking-[0.25em] uppercase [writing-mode:vertical-rl] select-none whitespace-nowrap transition-colors ${
              item.highlight
                ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.45)]'
                : 'text-slate-400/80'
            }`}
          >
            {item.text}
          </span>
          <div className="flex flex-col items-center gap-1 opacity-30 my-0.5">
            <span className="w-1 h-1 rounded-full bg-white" />
          </div>
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <>
      {/* Left Slim Vertical Strip (Moving top to down) */}
      <aside
        aria-hidden="true"
        className="absolute left-0 top-0 bottom-0 w-7 sm:w-8 z-20 pointer-events-none hidden md:flex flex-col items-center justify-between bg-[#060709]/85 backdrop-blur-md border-r border-white/10"
      >
        {/* Top Accent Pip */}
        <div className="w-full flex items-center justify-center py-2.5 border-b border-white/5 opacity-60">
          <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,0.8)]" />
        </div>

        {/* Downward Moving Marquee */}
        <div className="relative flex-1 w-full overflow-hidden flex flex-col items-center mask-gradient-vertical">
          <div className="flex flex-col items-center animate-marquee-down">
            {renderTrack('l1')}
            {renderTrack('l2')}
          </div>
        </div>

        {/* Bottom Accent Pip */}
        <div className="w-full flex items-center justify-center py-2.5 border-t border-white/5 opacity-40">
          <span className="w-1 h-1 rounded-full bg-slate-400" />
        </div>
      </aside>

      {/* Right Slim Vertical Strip (Moving top to down) */}
      <aside
        aria-hidden="true"
        className="absolute right-0 top-0 bottom-0 w-7 sm:w-8 z-20 pointer-events-none hidden md:flex flex-col items-center justify-between bg-[#060709]/85 backdrop-blur-md border-l border-white/10"
      >
        {/* Top Accent Pip */}
        <div className="w-full flex items-center justify-center py-2.5 border-b border-white/5 opacity-60">
          <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,0.8)]" />
        </div>

        {/* Downward Moving Marquee */}
        <div className="relative flex-1 w-full overflow-hidden flex flex-col items-center mask-gradient-vertical">
          <div className="flex flex-col items-center animate-marquee-down">
            {renderTrack('r1')}
            {renderTrack('r2')}
          </div>
        </div>

        {/* Bottom Accent Pip */}
        <div className="w-full flex items-center justify-center py-2.5 border-t border-white/5 opacity-40">
          <span className="w-1 h-1 rounded-full bg-slate-400" />
        </div>
      </aside>
    </>
  );
};

export default SideStrips;
