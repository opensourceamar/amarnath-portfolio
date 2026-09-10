import React, { useState, useEffect, useRef } from 'react';
import { Sparkles } from 'lucide-react';

export interface CertificateItem {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  credentialId?: string;
  badge: string;
  skills: string[];
  pdfUrl?: string;
  imageUrl: string;
  desc: string;
  highlights: string[];
  iconType: string;
  width: number;
  height: number;
}

const CERTIFICATES_DATA: CertificateItem[] = [
  {
    id: 'pcap-python',
    title: 'Partner: PCAP – Programming Essentials in Python',
    issuer: 'Cisco Networking Academy & OpenEDG Python Institute',
    issueDate: '02 Jul 2023',
    credentialId: '228W1A1269 (VRSEC)',
    badge: 'CISCO ACADEMY',
    skills: ['Python OOP', 'Control Flow', 'Data Structures', 'Exception Handling', 'Modules & Packages'],
    pdfUrl: '/certificates/Partner-_PCAP_-_Programming_Essentials_in_Python_certificate_228w1a1269-vrsec-ac-in_5c7fa5d9-8653-4d71-aec6-7cc139f89c8d.pdf',
    imageUrl: '/cert-pcap.jpg',
    desc: 'Official Certificate awarded to Amarnath Ankem for successfully completing Partner: PCAP - Programming Essentials in Python through the Cisco Networking Academy program.',
    highlights: [
      'Mastered Object-Oriented Architecture and modular software design',
      'Signed by Lynn Bloomer, Director, Cisco Networking Academy',
      'Production-grade exception handling, data structures, and file operations',
    ],
    iconType: 'python',
    width: 330,
    height: 205,
  },
  {
    id: 'hackerrank-python',
    title: 'Python (Basic) Certificate',
    issuer: 'HackerRank Skill Certification',
    issueDate: '14 Nov 2025',
    credentialId: 'HACKERRANK-PYTHON-BASIC',
    badge: 'HACKERRANK VERIFIED',
    skills: ['Python 3', 'Problem Solving', 'Data Structures', 'Algorithms', 'Time Complexity'],
    pdfUrl: '/certificates/python_basic%20certificate.pdf',
    imageUrl: '/cert-hackerrank.jpg',
    desc: 'Skill Assessment Certificate awarded to Ankem Amarnath for successfully clearing the HackerRank Python (Basic) assessment, validating fluency in Python syntax and algorithmic efficiency.',
    highlights: [
      'Passed timed algorithmic challenges with optimal time/space complexity',
      'Validated HackerRank verified credential in core Python problem solving',
      'Proficiency in dictionary manipulation, lists comprehension, and algorithmic logic',
    ],
    iconType: 'hackerrank',
    width: 330,
    height: 205,
  },
  {
    id: 'nptel-python',
    title: 'The Joy of Computing using Python',
    issuer: 'NPTEL & IIT Madras (Govt. of India)',
    issueDate: 'Jan-Apr 2024 (12 Weeks)',
    credentialId: 'NPTEL24CS57S269900837',
    badge: 'IIT MADRAS & NPTEL',
    skills: ['Computational Logic', 'Algorithm Design', 'Data Processing', 'Recursion', 'Logic & Math'],
    pdfUrl: '/certificates/The%20Joy%20of%20Computing%20using%20Python.pdf',
    imageUrl: '/cert-nptel.jpg',
    desc: 'Academic certification awarded to Ankem Amarnath by IIT Madras and NPTEL Swayam (Ministry of Education) for successfully completing the 12-week course with proctored in-person examination.',
    highlights: [
      '12-week intensive computational course by IIT Madras faculty',
      'Proctored in-person examination score: 61% (20.69/25 + 40.56/75)',
      'Recommended 3 or 4 Academic Credits under National MOOCs',
    ],
    iconType: 'binary',
    width: 330,
    height: 205,
  },
  {
    id: 'internship-fullstack',
    title: 'Full Stack Web Development Internship',
    issuer: 'AvaIntern Edutech Pvt Ltd',
    issueDate: '10/07/2025',
    credentialId: 'AVA-2022-2000695',
    badge: 'INDUSTRY INTERNSHIP',
    skills: ['Full-Stack Web Dev', 'React & TypeScript', 'RESTful APIs', 'Database Architecture', 'System Design'],
    pdfUrl: '/certificates/intern.pdf',
    imageUrl: '/cert-intern.jpg',
    desc: "Certificate of Internship Completion awarded to Ankem Amarnath for outstanding performance in a 2-Month [25/03/2025 - 25/05/2025] Full Stack Web Development Project Based Internship.",
    highlights: [
      'Hands-on full-stack development building end-to-end production web apps',
      'Signed by Shivani Jaiswal, Chief Operating Officer, AvaIntern Edutech',
      'Recognized industry LMS certification in Full Stack Web Development',
    ],
    iconType: 'react',
    width: 330,
    height: 205,
  },
];

const CertificatesSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);

  // 3D Orbital Carousel States
  const [hoveredCertId, setHoveredCertId] = useState<string | null>(null);
  const [isOrbitPaused, setIsOrbitPaused] = useState<boolean>(false);

  const rotationAngleRef = useRef<number>(0);
  const targetVelocityRef = useRef<number>(0.002);
  const currentVelocityRef = useRef<number>(0.002);
  const [renderedAngle, setRenderedAngle] = useState<number>(0);

  const isDraggingRef = useRef<boolean>(false);
  const lastMouseXRef = useRef<number>(0);

  // 3D Steady Continuous Orbit Loop (NO SHAKING, SMOOTH ROTATION)
  useEffect(() => {
    let animId: number;

    const updateMotion = () => {
      if (!isOrbitPaused && !isDraggingRef.current) {
        currentVelocityRef.current += (targetVelocityRef.current - currentVelocityRef.current) * 0.05;
        rotationAngleRef.current += currentVelocityRef.current;
      }
      setRenderedAngle(rotationAngleRef.current);
      animId = requestAnimationFrame(updateMotion);
    };

    animId = requestAnimationFrame(updateMotion);
    return () => cancelAnimationFrame(animId);
  }, [isOrbitPaused]);

  // Orbital Radii adapting dynamically to screen width
  const [orbitDim, setOrbitDim] = useState<{ rx: number; ry: number; isMobile: boolean }>({
    rx: 210,
    ry: 95,
    isMobile: false,
  });

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      setOrbitDim({
        rx: isMobile ? 120 : 210,
        ry: isMobile ? 55 : 95,
        isMobile,
      });
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mouse & Touch Velocity & Drag Steering
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const sectionEl = sectionRef.current;
      if (!sectionEl) return;

      const rect = sectionEl.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const normX = (e.clientX - centerX) / (rect.width / 2);

      if (!isDraggingRef.current && !isOrbitPaused) {
        targetVelocityRef.current = normX * 0.004 + 0.0018;
      }

      if (isDraggingRef.current) {
        const deltaX = e.clientX - lastMouseXRef.current;
        rotationAngleRef.current += deltaX * 0.0055;
        lastMouseXRef.current = e.clientX;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isDraggingRef.current && e.touches[0]) {
        const deltaX = e.touches[0].clientX - lastMouseXRef.current;
        rotationAngleRef.current += deltaX * 0.007;
        lastMouseXRef.current = e.touches[0].clientX;
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('button, a')) return;
      isDraggingRef.current = true;
      lastMouseXRef.current = e.clientX;
    };

    const handleTouchStart = (e: TouchEvent) => {
      if ((e.target as HTMLElement).closest('button, a')) return;
      isDraggingRef.current = true;
      if (e.touches[0]) lastMouseXRef.current = e.touches[0].clientX;
    };

    const handleDragEnd = () => {
      isDraggingRef.current = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleDragEnd);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleDragEnd);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleDragEnd);
    };
  }, [isOrbitPaused]);

  const radiusX = orbitDim.rx;
  const radiusY = orbitDim.ry;
  const totalCerts = CERTIFICATES_DATA.length;

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
        {/* SECTION HEADER: ACCREDITED INDUSTRY CREDENTIALS                      */}
        {/* ===================================================================== */}
        <div className="flex flex-col items-center text-center pt-2">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white leading-none">
            CERTIFICATES
          </h2>
        </div>

        {/* ===================================================================== */}
        {/* 3D TIGHT OVERLAPPING PURE IMAGE WHEEL                                 */}
        {/* ===================================================================== */}
        <div className="w-full flex flex-col items-center justify-center space-y-2 mt-2">
          <div
            className="relative w-full max-w-6xl h-[460px] sm:h-[480px] flex items-center justify-center overflow-visible"
            style={{
              perspective: '1100px',
            }}
          >
            {/* CENTER MINIMAL ROTATING EMBLEM `(((( C ))))` */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex flex-col items-center justify-center z-0">
              <div className="w-32 h-32 rounded-full border border-white/10 animate-ping opacity-15 duration-1000" />

              {/* Minimal Wireframe Emblem */}
              <svg width="150" height="70" viewBox="0 0 150 70" className="overflow-visible opacity-85">
                <path
                  d="M 35 15 C 20 25, 20 45, 35 55 M 48 10 C 30 25, 30 45, 48 60 M 60 5 C 40 25, 40 45, 60 65 M 90 5 C 110 25, 110 45, 90 65 M 102 10 C 120 25, 120 45, 102 60 M 115 15 C 130 25, 130 45, 115 55"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <circle cx="75" cy="35" r="5" fill="#ffffff" />
              </svg>

              <div className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mt-4">
                * CREDENTIAL REGISTRY • DRAG OR HOVER TO ROTATE
              </div>
            </div>

            {/* DENSELY OVERLAPPING PURE VISUAL CERTIFICATE IMAGES */}
            {CERTIFICATES_DATA.map((card, index) => {
              const angle = renderedAngle + (index * 2 * Math.PI) / totalCerts;
              const posX = Math.sin(angle) * radiusX;
              const posY = Math.cos(angle) * radiusY * 0.65;

              // Perspective tilt based on 3D orbital curve (tangential tilt)
              const tangentialTilt = -Math.sin(angle) * 8 + (index % 2 === 0 ? 3 : -3);

              const depth = (Math.cos(angle) + 1) / 2;
              const isHovered = hoveredCertId === card.id;

              // Depth perspective scaling
              const baseScale = 0.78 + depth * 0.35;
              const scale = isHovered ? 1.30 : baseScale;
              const opacity = isHovered ? 1.0 : 0.48 + depth * 0.52;
              const grayscale = isHovered ? 0 : Math.round((1 - depth) * 65);
              const zIndex = isHovered ? 99999 : Math.round(depth * 100);
              const finalTilt = isHovered ? 0 : tangentialTilt;

              return (
                <div
                  key={card.id}
                  onMouseEnter={() => {
                    setHoveredCertId(card.id);
                    setIsOrbitPaused(true);
                  }}
                  onMouseLeave={() => {
                    setHoveredCertId(null);
                    setIsOrbitPaused(false);
                  }}
                  onClick={() => {
                    if (card.pdfUrl) {
                      window.open(card.pdfUrl, '_blank');
                    }
                  }}
                  className="absolute cursor-pointer select-none transition-transform duration-250 ease-out"
                  style={{
                    width: `${orbitDim.isMobile ? card.width * 0.72 : card.width}px`,
                    height: `${orbitDim.isMobile ? card.height * 0.72 : card.height}px`,
                    left: `calc(50% + ${posX}px)`,
                    top: `calc(50% + ${posY}px)`,
                    transform: `translate(-50%, -50%) rotate(${finalTilt}deg) scale(${scale})`,
                    opacity: opacity,
                    filter: `grayscale(${grayscale}%)`,
                    zIndex: zIndex,
                  }}
                >
                  {/* PURE FULL-BLEED IMAGE SLAB */}
                  <div
                    className={`relative w-full h-full overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.9)] transition-all duration-300 ${
                      isHovered
                        ? 'shadow-[0_0_55px_rgba(255,255,255,0.5),0_25px_60px_rgba(0,0,0,0.98)] ring-2 ring-white'
                        : 'border border-white/20'
                    }`}
                  >
                    <img
                      src={card.imageUrl}
                      alt={card.title}
                      className="w-full h-full object-cover object-center pointer-events-none"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificatesSection;
