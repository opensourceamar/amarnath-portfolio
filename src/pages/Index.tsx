import React, { useRef, useEffect, useState, useCallback } from 'react';
import AboutSection from '@/components/portfolio/AboutSection';
import EducationSection from '@/components/portfolio/EducationSection';
import CertificatesSection from '@/components/portfolio/CertificatesSection';
import SkillsSection from '@/components/portfolio/SkillsSection';
import ProjectsSection from '@/components/portfolio/ProjectsSection';
import ContactSection from '@/components/portfolio/ContactSection';
import SideStrips from '@/components/portfolio/SideStrips';

const Index = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const educationRef = useRef<HTMLDivElement>(null);
  const certificatesRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  const [activeSection, setActiveSection] = useState<'about' | 'education' | 'skills' | 'projects' | 'contact'>('about');

  // Virtual smooth scroll & inertia controller
  const targetScrollRef = useRef(0);
  const currentScrollRef = useRef(0);
  const isAnimatingRef = useRef(false);
  const isWheelingRef = useRef(false);
  const snapTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Section index mapping for precise target scroll calculations
  const sectionIndexMap: Record<'about' | 'education' | 'skills' | 'projects' | 'contact', number> = {
    about: 0,
    education: 1,
    skills: 3, // certificates is at index 2 in DOM
    projects: 4,
    contact: 5,
  };

  const updateActiveSection = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const h = container.clientHeight;
    if (!h) return;

    const current = currentScrollRef.current;

    if (current < 0.6 * h) {
      setActiveSection('about');
    } else if (current < 1.6 * h) {
      setActiveSection('education');
    } else if (current < 3.85 * h) {
      setActiveSection('skills');
    } else if (current < 4.7 * h) {
      setActiveSection('projects');
    } else {
      setActiveSection('contact');
    }
  }, []);

  const startScrollAnimation = useCallback(() => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;

    const animate = () => {
      const container = containerRef.current;
      if (!container) {
        isAnimatingRef.current = false;
        return;
      }

      const maxScroll = Math.max(0, container.scrollHeight - container.clientHeight);
      const clampedTarget = Math.max(0, Math.min(maxScroll, targetScrollRef.current));
      const diff = clampedTarget - currentScrollRef.current;

      if (Math.abs(diff) < 0.4) {
        currentScrollRef.current = clampedTarget;
        targetScrollRef.current = clampedTarget;
        container.scrollTop = clampedTarget;
        isAnimatingRef.current = false;
        updateActiveSection();
        return;
      }

      // 0.12 exponential damping factor for buttery-smooth, responsive 60/120fps glide
      currentScrollRef.current += diff * 0.12;
      container.scrollTop = currentScrollRef.current;
      updateActiveSection();

      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [updateActiveSection]);

  const snapToNearest = useCallback(() => {
    if (isWheelingRef.current) return;
    const container = containerRef.current;
    if (!container) return;

    const h = container.clientHeight;
    if (!h) return;

    const validTargets = [0, 1 * h, 2 * h, 3 * h, 4 * h, 5 * h];
    const current = currentScrollRef.current;

    let closest = 0;
    let minDiff = Infinity;

    validTargets.forEach((target) => {
      const diff = Math.abs(target - current);
      if (diff < minDiff) {
        minDiff = diff;
        closest = target;
      }
    });

    // Gently align to section if close to resting
    if (minDiff < h * 0.40) {
      targetScrollRef.current = closest;
      startScrollAnimation();
    }
  }, [startScrollAnimation]);

  const scrollToSection = useCallback((sectionName: typeof activeSection) => {
    setActiveSection(sectionName);
    const container = containerRef.current;
    if (container) {
      const h = container.clientHeight;
      const targetTop = sectionIndexMap[sectionName] * h;
      targetScrollRef.current = targetTop;
      if (snapTimeoutRef.current) clearTimeout(snapTimeoutRef.current);
      startScrollAnimation();
    }
  }, [startScrollAnimation]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    currentScrollRef.current = container.scrollTop;
    targetScrollRef.current = container.scrollTop;
    updateActiveSection();

    // Smooth proportional wheel scrolling
    const handleWheel = (e: WheelEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;

      e.preventDefault();
      const maxScroll = Math.max(0, container.scrollHeight - container.clientHeight);
      if (maxScroll <= 0) return;

      let delta = e.deltaY;
      if (e.deltaMode === 1) delta *= 35;
      if (e.deltaMode === 2) delta *= 600;

      // Proportional increment strictly clamped within bounds
      const scrollDelta = delta * 0.95;
      targetScrollRef.current = Math.max(0, Math.min(maxScroll, targetScrollRef.current + scrollDelta));

      isWheelingRef.current = true;
      if (snapTimeoutRef.current) clearTimeout(snapTimeoutRef.current);

      startScrollAnimation();

      snapTimeoutRef.current = setTimeout(() => {
        isWheelingRef.current = false;
        snapToNearest();
      }, 350);
    };

    // Keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      const maxScroll = Math.max(0, container.scrollHeight - container.clientHeight);
      const h = container.clientHeight;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        targetScrollRef.current = Math.min(maxScroll, targetScrollRef.current + h * 0.4);
        startScrollAnimation();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        targetScrollRef.current = Math.max(0, targetScrollRef.current - h * 0.4);
        startScrollAnimation();
      } else if (e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        targetScrollRef.current = Math.min(maxScroll, targetScrollRef.current + h);
        startScrollAnimation();
      } else if (e.key === 'PageUp') {
        e.preventDefault();
        targetScrollRef.current = Math.max(0, targetScrollRef.current - h);
        startScrollAnimation();
      }
    };

    // Touch swipe support
    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
      if (snapTimeoutRef.current) clearTimeout(snapTimeoutRef.current);
    };

    const handleTouchMove = (e: TouchEvent) => {
      const currentY = e.touches[0].clientY;
      const deltaY = (touchStartY - currentY) * 1.5;
      touchStartY = currentY;

      const maxScroll = Math.max(0, container.scrollHeight - container.clientHeight);
      targetScrollRef.current = Math.max(0, Math.min(maxScroll, targetScrollRef.current + deltaY));
      startScrollAnimation();
    };

    const handleTouchEnd = () => {
      snapTimeoutRef.current = setTimeout(() => {
        snapToNearest();
      }, 200);
    };

    // Native scroll sync listener
    const handleNativeScroll = () => {
      if (!isAnimatingRef.current && containerRef.current) {
        currentScrollRef.current = containerRef.current.scrollTop;
        targetScrollRef.current = containerRef.current.scrollTop;
        updateActiveSection();
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: true });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });
    container.addEventListener('scroll', handleNativeScroll, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('scroll', handleNativeScroll);
      if (snapTimeoutRef.current) clearTimeout(snapTimeoutRef.current);
    };
  }, [startScrollAnimation, snapToNearest, updateActiveSection]);

  return (
    <div className="bg-[#060709] text-slate-100 min-h-screen selection:bg-white selection:text-black relative font-sans overflow-hidden">
      {/* Silver & White Ambient Radiance */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[850px] h-[360px] bg-gradient-to-b from-white/[0.05] via-slate-400/[0.02] to-transparent rounded-full blur-3xl pointer-events-none z-0" />
      <div className="fixed bottom-0 right-10 w-[500px] h-[300px] bg-gradient-to-t from-slate-400/[0.03] to-transparent rounded-full blur-3xl pointer-events-none z-0" />

      {/* Header Navigation: Floating Frosted Glass Segmented Dock */}
      <header className="fixed top-0 left-0 right-0 h-16 z-50 flex items-center justify-center pointer-events-none px-4">
        <nav className="pointer-events-auto bg-[#07090e]/85 backdrop-blur-2xl border border-white/10 p-1 sm:p-1.5 rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.12)]">
          <ul className="flex items-center gap-1 sm:gap-2">
            {[
              { id: 'about' as const, label: 'About' },
              { id: 'education' as const, label: 'Education' },
              { id: 'skills' as const, label: 'Skills' },
              { id: 'projects' as const, label: 'Projects' },
              { id: 'contact' as const, label: 'Contact' },
            ].map(({ id, label }) => {
              const isActive = activeSection === id;
              return (
                <li key={id}>
                  <button
                    onClick={() => scrollToSection(id)}
                    className={`relative px-3.5 sm:px-5 py-1.5 rounded-lg text-xs sm:text-sm font-medium tracking-wide transition-all duration-200 focus:outline-none cursor-pointer flex items-center justify-center ${
                      isActive
                        ? 'bg-white text-black font-bold shadow-[0_0_20px_rgba(255,255,255,0.45)]'
                        : 'text-slate-300 hover:text-white hover:bg-white/[0.08]'
                    }`}
                  >
                    <span>{label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </header>

      {/* Main Content Sections with Smooth Progressive Stacking Card Slide-Over Effect */}
      <div
        ref={containerRef}
        className="h-[calc(100vh-4rem)] mt-16 overflow-y-auto overflow-x-hidden scrollbar-hide relative z-10"
        style={{ scrollBehavior: 'auto' }}
      >
        <section id="about" ref={aboutRef} className="h-[calc(100vh-4rem)] min-h-[calc(100vh-4rem)] w-full relative flex items-center justify-center">
          <SideStrips />
          <AboutSection />
        </section>

        <section id="education" ref={educationRef} className="h-[calc(100vh-4rem)] min-h-[calc(100vh-4rem)] w-full relative flex flex-col justify-start">
          <SideStrips />
          <EducationSection />
        </section>

        <section id="certificates" ref={certificatesRef} className="h-[calc(100vh-4rem)] min-h-[calc(100vh-4rem)] w-full relative flex flex-col justify-start">
          <SideStrips />
          <CertificatesSection />
        </section>

        <section id="skills" ref={skillsRef} className="h-[calc(100vh-4rem)] min-h-[calc(100vh-4rem)] w-full sticky top-0 z-10 bg-[#060709] flex flex-col justify-start">
          <SideStrips />
          <SkillsSection />
        </section>

        <section id="projects" ref={projectsRef} className="h-[calc(100vh-4rem)] min-h-[calc(100vh-4rem)] w-full sticky top-0 z-20 bg-[#030408] shadow-[0_-25px_60px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col justify-start">
          <ProjectsSection />
        </section>

        <section id="contact" ref={contactRef} className="h-[calc(100vh-4rem)] min-h-[calc(100vh-4rem)] w-full sticky top-0 z-30 bg-[#000000] shadow-[0_-30px_70px_rgba(0,0,0,0.98)] overflow-hidden flex flex-col justify-between">
          <SideStrips />
          <ContactSection onGoBack={() => scrollToSection('about')} />
        </section>
      </div>
    </div>
  );
};

export default Index;
