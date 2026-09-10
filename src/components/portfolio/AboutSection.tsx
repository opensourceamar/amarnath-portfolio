
const AboutSection = () => {
  return (
    <div className="w-full h-full min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 sm:px-8 lg:px-12 py-2 sm:py-4 relative overflow-y-auto lg:overflow-hidden bg-[#060709] text-slate-100 font-sans select-none">
      {/* Silver & Slate Ambient Glow */}
      <div className="absolute top-1/3 left-1/4 -translate-x-1/2 w-[650px] h-[350px] bg-white/[0.035] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[500px] h-[300px] bg-slate-500/[0.03] rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-6 lg:gap-10 items-center relative z-10 py-1">

        {/* Left Half: Original Seamless B&W Portrait (No Box / No Border) */}
        <div className="lg:col-span-6 xl:col-span-6 flex justify-center lg:justify-start items-center">
          <div className="w-full max-w-[240px] sm:max-w-[340px] lg:max-w-[490px]">
            <img
              src="/amarnath_shirt_bw.jpg"
              alt="ANKEM AMARNATH"
              className="w-full h-auto max-h-[190px] sm:max-h-[280px] lg:max-h-[480px] object-contain select-none pointer-events-none"
            />
          </div>
        </div>

        {/* Right Half: Biography & Details (Clean, Open Typography - No Boxes) */}
        <div className="lg:col-span-6 xl:col-span-6 flex flex-col justify-center space-y-2 sm:space-y-4 text-left">

          {/* Section Eyebrow (Clean typography, no capsule) */}
          <div className="flex items-center gap-2 sm:gap-2.5 text-xs sm:text-base font-mono uppercase tracking-[0.22em] text-slate-300">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.9)]" />
            <span className="font-bold tracking-[0.25em] text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-300">ABOUT ME</span>
            <span className="h-px w-6 sm:w-10 bg-gradient-to-r from-white/40 to-transparent" />
          </div>

          {/* Name Header */}
          <div>
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-400">
              ANKEM AMARNATH
            </h1>
          </div>

          {/* 2 Clean Bio Paragraphs */}
          <div className="space-y-2 sm:space-y-3 pt-0.5 sm:pt-1">
            <p className="text-[11px] sm:text-sm md:text-base leading-relaxed text-slate-300 font-light max-w-2xl">
              I am a software developer passionate about building fast, reliable, and clean web applications. I work extensively with Python, MySQL, and AI tools to design solid backend systems, while using tools like n8n to automate complex workflows and save valuable time.
            </p>
            <p className="text-[11px] sm:text-sm md:text-base leading-relaxed text-slate-300 font-light max-w-2xl">
              Beyond code, I have some pretty unique hobbies. I love solving twisty puzzles and have mastered 9 different types, even solving the Maple Leaf Skewb while skateboarding! When I&apos;m not puzzling or on my skateboard, you&apos;ll find me at the gym staying active and focused.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};

export default AboutSection;
