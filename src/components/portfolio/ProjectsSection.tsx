import React, { useState, useRef, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

interface ProjectPlanet {
  id: string;
  planetName: string;
  title: string;
  description: string;
  orbitRadiusX: number;
  orbitRadiusY: number;
  orbitSpeed: number;
  planetSize: number;
  planetColor: string;
  demoUrl: string;
  repoUrl: string;
}

const PLANETS: ProjectPlanet[] = [
  {
    id: 'steganography',
    planetName: 'Planet Steganography',
    title: 'Dynamic Pattern-Based Text Steganography',
    description: 'A robust Python-based encryption and steganography tool that conceals AES-256-CBC encrypted data inside ordinary text documents using variable whitespace patterns and invisible unicode modulation without visual anomalies.',
    orbitRadiusX: 210,
    orbitRadiusY: 95,
    orbitSpeed: 0.0045,
    planetSize: 32,
    planetColor: 'from-slate-100 via-slate-400 to-slate-900',
    demoUrl: '#',
    repoUrl: '#',
  },
  {
    id: 'mosaic',
    planetName: 'Planet Mosaic',
    title: 'Pyraminx-Based Mosaic Art & Geometric Design',
    description: 'A computational image processing tool that tessellates photographs into alternating triangular Pyraminx mosaics. Features CIELAB color quantization, robust edge-case validation, and automated multi-page printable PDF assembly blueprints via ReportLab.',
    orbitRadiusX: 330,
    orbitRadiusY: 145,
    orbitSpeed: 0.0028,
    planetSize: 36,
    planetColor: 'from-zinc-200 via-zinc-400 to-zinc-950',
    demoUrl: '#',
    repoUrl: '#',
  },
];

interface RealisticAsteroid {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  rotation: number;
  rotSpeed: number;
  vertices: { angle: number; dist: number }[];
  craters: { x: number; y: number; r: number }[];
  active: boolean;
  spawnTimer: number;
  dustParticles: { x: number; y: number; vx: number; vy: number; alpha: number; size: number; color: string }[];
}

const ProjectsSection: React.FC = () => {
  const [selectedPlanetIdx, setSelectedPlanetIdx] = useState<number>(0);
  const [planetPositions, setPlanetPositions] = useState<{ x: number; y: number }[]>([
    { x: 0, y: 0 },
    { x: 0, y: 0 },
  ]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const anglesRef = useRef<number[]>([0.8, Math.PI + 0.9]);
  const animFrameRef = useRef<number | null>(null);

  // Pure Black & White Realistic Milky Way Galaxy (Balanced Core Exposure, Crisp Dust Lanes)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    // Load High-Resolution Balanced Monochrome Milky Way Texture
    const galaxyImg = new Image();
    galaxyImg.src = '/milky-way-bw.jpg';
    let imageLoaded = false;
    galaxyImg.onload = () => {
      imageLoaded = true;
    };

    // 1. Deep Space Background Stars (Monochrome Diamond-White & Platinum)
    const bgStarsCount = 350;
    const bgStars: {
      x: number;
      y: number;
      size: number;
      alpha: number;
      delta: number;
      isBright: boolean;
      color: string;
    }[] = [];

    const starColors = ['#ffffff', '#f8fafc', '#f1f5f9', '#e2e8f0', '#cbd5e1', '#94a3b8'];
    for (let i = 0; i < bgStarsCount; i++) {
      bgStars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.6 + 0.35,
        alpha: Math.random() * 0.85 + 0.15,
        delta: (Math.random() - 0.5) * 0.012,
        isBright: Math.random() > 0.92,
        color: starColors[Math.floor(Math.random() * starColors.length)],
      });
    }

    // 2. Natural Swirling Stardust Particles along Spiral Arms (Pure Monochrome, No Lines)
    const numArms = 4;
    const maxGalaxyRadius = Math.max(width * 0.55, height * 0.70);
    const streamStarsCount = 1800;
    const streamStars: {
      dist: number;
      baseAngle: number;
      speed: number;
      size: number;
      alpha: number;
      color: string;
    }[] = [];

    for (let i = 0; i < streamStarsCount; i++) {
      const arm = i % numArms;
      const armOffset = arm * (Math.PI / 2);
      const distFraction = Math.pow(Math.random(), 0.58);
      const dist = 14 + distFraction * maxGalaxyRadius;
      const spread = (Math.random() - 0.5) * 0.28;
      const angle = armOffset + 3.0 * Math.log(dist / 12 + 1) + spread;

      streamStars.push({
        dist,
        baseAngle: angle,
        speed: 0.0010 + (1 / (dist + 30)) * 0.12,
        size: Math.random() * 1.4 + 0.35,
        alpha: Math.random() * 0.80 + 0.2,
        color: starColors[Math.floor(Math.random() * starColors.length)],
      });
    }

    // 3. Realistic Asteroid Engine
    const createAsteroidVertices = (baseRadius: number) => {
      const numVerts = 9;
      const verts: { angle: number; dist: number }[] = [];
      for (let v = 0; v < numVerts; v++) {
        const ang = (v / numVerts) * Math.PI * 2;
        const dist = baseRadius * (0.78 + Math.random() * 0.44);
        verts.push({ angle: ang, dist });
      }
      return verts;
    };

    const createAsteroidCraters = (baseRadius: number) => {
      const numCraters = Math.floor(Math.random() * 3) + 1;
      const craters: { x: number; y: number; r: number }[] = [];
      for (let c = 0; c < numCraters; c++) {
        craters.push({
          x: (Math.random() - 0.5) * baseRadius * 0.9,
          y: (Math.random() - 0.5) * baseRadius * 0.9,
          r: baseRadius * (0.15 + Math.random() * 0.2),
        });
      }
      return craters;
    };

    const asteroidPool: RealisticAsteroid[] = [
      {
        x: -100,
        y: -100,
        vx: 3.2,
        vy: 1.5,
        radius: 5.5,
        rotation: 0,
        rotSpeed: 0.025,
        vertices: createAsteroidVertices(5.5),
        craters: createAsteroidCraters(5.5),
        active: false,
        spawnTimer: 45,
        dustParticles: [],
      },
      {
        x: -100,
        y: -100,
        vx: 2.8,
        vy: 1.3,
        radius: 6.8,
        rotation: 0,
        rotSpeed: -0.018,
        vertices: createAsteroidVertices(6.8),
        craters: createAsteroidCraters(6.8),
        active: false,
        spawnTimer: 190,
        dustParticles: [],
      },
      {
        x: -100,
        y: -100,
        vx: 3.8,
        vy: 1.8,
        radius: 4.8,
        rotation: 0,
        rotSpeed: 0.032,
        vertices: createAsteroidVertices(4.8),
        craters: createAsteroidCraters(4.8),
        active: false,
        spawnTimer: 350,
        dustParticles: [],
      },
    ];

    const spawnAsteroid = (ast: RealisticAsteroid) => {
      ast.active = true;
      ast.dustParticles = [];
      ast.radius = 4.5 + Math.random() * 2.8;
      ast.vertices = createAsteroidVertices(ast.radius);
      ast.craters = createAsteroidCraters(ast.radius);
      ast.rotSpeed = (Math.random() - 0.5) * 0.045;

      const spawnFromTop = Math.random() > 0.45;
      if (spawnFromTop) {
        ast.x = Math.random() * (width * 0.7) - 40;
        ast.y = -50;
      } else {
        ast.x = -50;
        ast.y = Math.random() * (height * 0.5) - 40;
      }

      const speed = 2.8 + Math.random() * 1.8;
      const angle = 0.42 + (Math.random() - 0.5) * 0.22;
      ast.vx = Math.cos(angle) * speed;
      ast.vy = Math.sin(angle) * speed;
    };

    let rotationAngle = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Stable, Centered Anchor
      const centerX = width / 2;
      const centerY = height * 0.48;

      const DISK_INCLINATION_Y = 0.44;
      const GALAXY_TILT_ANGLE = -0.22;

      // --- LAYER 1: Deep Space Background Stars ---
      for (let i = 0; i < bgStars.length; i++) {
        const s = bgStars[i];
        s.alpha += s.delta;
        if (s.alpha > 0.95 || s.alpha < 0.15) s.delta = -s.delta;

        ctx.fillStyle = s.color;
        ctx.globalAlpha = s.alpha;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();

        if (s.isBright) {
          ctx.strokeStyle = s.color;
          ctx.lineWidth = 0.75;
          ctx.beginPath();
          ctx.moveTo(s.x - 7, s.y);
          ctx.lineTo(s.x + 7, s.y);
          ctx.moveTo(s.x, s.y - 7);
          ctx.lineTo(s.x, s.y + 7);
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;

      // --- LAYER 2: Stable, Centered Milky Way Galaxy (Balanced Exposure with Rich Core Details) ---
      if (imageLoaded) {
        const imgScale = Math.max(width / 1350, height / 850) * 1.08;
        const imgW = 1920 * imgScale;
        const imgH = 1080 * imgScale;

        ctx.save();
        ctx.globalAlpha = 0.96;
        ctx.drawImage(galaxyImg, centerX - imgW / 2, centerY - imgH / 2, imgW, imgH);
        ctx.restore();
      }

      // --- LAYER 3: Swirling Natural Stardust (Pure Monochrome Diamond Stars) ---
      rotationAngle += 0.0018;

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(GALAXY_TILT_ANGLE);
      ctx.scale(1.0, DISK_INCLINATION_Y);

      for (let i = 0; i < streamStars.length; i++) {
        const p = streamStars[i];
        p.baseAngle += p.speed * 0.22;

        const currentAngle = p.baseAngle + rotationAngle;
        const px = Math.cos(currentAngle) * p.dist;
        const py = Math.sin(currentAngle) * p.dist;

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha * 0.85;
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      ctx.restore();

      // --- LAYER 4: Realistic Tumbling Asteroids & Micro-Dust Ablation ---
      asteroidPool.forEach((ast) => {
        if (!ast.active) {
          ast.spawnTimer--;
          if (ast.spawnTimer <= 0) {
            spawnAsteroid(ast);
          }
          return;
        }

        ast.x += ast.vx;
        ast.y += ast.vy;
        ast.rotation += ast.rotSpeed;

        if (Math.random() > 0.3) {
          ast.dustParticles.push({
            x: ast.x + (Math.random() - 0.5) * ast.radius * 0.6,
            y: ast.y + (Math.random() - 0.5) * ast.radius * 0.6,
            vx: -ast.vx * 0.15 + (Math.random() - 0.5) * 0.6,
            vy: -ast.vy * 0.15 + (Math.random() - 0.5) * 0.6,
            alpha: 0.65 + Math.random() * 0.25,
            size: 0.5 + Math.random() * 1.0,
            color: Math.random() > 0.5 ? '#cbd5e1' : '#94a3b8',
          });
        }

        for (let d = ast.dustParticles.length - 1; d >= 0; d--) {
          const p = ast.dustParticles[d];
          p.x += p.vx;
          p.y += p.vy;
          p.alpha -= 0.035;

          if (p.alpha <= 0) {
            ast.dustParticles.splice(d, 1);
            continue;
          }

          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;

        ctx.save();
        ctx.translate(ast.x, ast.y);
        ctx.rotate(ast.rotation);

        const rockGrad = ctx.createLinearGradient(
          -ast.radius,
          -ast.radius,
          ast.radius,
          ast.radius
        );
        rockGrad.addColorStop(0, '#94a3b8');
        rockGrad.addColorStop(0.45, '#475569');
        rockGrad.addColorStop(1, '#0f172a');

        ctx.beginPath();
        for (let v = 0; v < ast.vertices.length; v++) {
          const vert = ast.vertices[v];
          const vx = Math.cos(vert.angle) * vert.dist;
          const vy = Math.sin(vert.angle) * vert.dist;
          if (v === 0) ctx.moveTo(vx, vy);
          else ctx.lineTo(vx, vy);
        }
        ctx.closePath();

        ctx.fillStyle = rockGrad;
        ctx.fill();

        ctx.strokeStyle = 'rgba(203, 213, 225, 0.4)';
        ctx.lineWidth = 0.6;
        ctx.stroke();

        ast.craters.forEach((crater) => {
          ctx.fillStyle = 'rgba(15, 23, 42, 0.65)';
          ctx.beginPath();
          ctx.arc(crater.x, crater.y, crater.r, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
          ctx.lineWidth = 0.4;
          ctx.stroke();
        });

        ctx.restore();

        if (ast.x > width + 80 || ast.y > height + 80) {
          ast.active = false;
          ast.spawnTimer = Math.floor(Math.random() * 200) + 90;
        }
      });

      // --- LAYER 5: Planetary Revolution Positions (Synced without orbit lines) ---
      anglesRef.current = anglesRef.current.map((ang, i) => ang + PLANETS[i].orbitSpeed);

      const cosRot = Math.cos(GALAXY_TILT_ANGLE);
      const sinRot = Math.sin(GALAXY_TILT_ANGLE);

      const isMobile = width < 768;
      const radiusScale = isMobile ? Math.min(width / 720, 0.68) : 1;

      const newPos = PLANETS.map((planet, i) => {
        const ang = anglesRef.current[i];
        const radX = planet.orbitRadiusX * radiusScale;
        const localX = Math.cos(ang) * radX;
        const localY = Math.sin(ang) * radX * DISK_INCLINATION_Y;

        const px = centerX + (localX * cosRot - localY * sinRot);
        const py = centerY + (localX * sinRot + localY * cosRot);
        return { x: px, y: py };
      });
      setPlanetPositions(newPos);

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [selectedPlanetIdx]);

  const selectedPlanet = PLANETS[selectedPlanetIdx];

  return (
    <div 
      className="relative w-full h-[calc(100vh-4rem)] flex flex-col justify-between items-center px-4 pt-6 sm:pt-8 pb-6 bg-[#030408] text-slate-100 overflow-hidden select-none"
    >
      {/* Full-Screen Pure Black & White Milky Way Galaxy Canvas with Realistic Asteroids */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      />

      {/* Clean Section Title with Silver Monochrome Gradient (Positioned High Inside Milky Way) */}
      <div className="relative z-10 text-center mb-1">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-400">
          Featured Projects
        </h2>
      </div>

      {/* Freely Revolving Celestial Project Planets (Matte 3D Shading, Pure Monochrome, No Glow, No Orbit Rings) */}
      <div className="absolute inset-0 pointer-events-none z-20">
        {PLANETS.map((planet, idx) => {
          const isSelected = selectedPlanetIdx === idx;
          const pos = planetPositions[idx] || { x: 0, y: 0 };

          return (
            <div
              key={planet.id}
              onClick={() => setSelectedPlanetIdx(idx)}
              className="absolute pointer-events-auto cursor-pointer group"
              style={{
                left: `${pos.x}px`,
                top: `${pos.y}px`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <div className="relative flex flex-col items-center">
                {/* Realistic 3D Planet Sphere with Natural Spherical Shadow (No Glow, No Orbit Rings) */}
                <div 
                  className={`relative rounded-full flex items-center justify-center transition-all duration-300 border ${
                    isSelected
                      ? `border-white/90 bg-gradient-to-br ${planet.planetColor} scale-105`
                      : `border-white/30 bg-gradient-to-br ${planet.planetColor} hover:border-white/70 hover:scale-105`
                  }`}
                  style={{
                    width: `${planet.planetSize}px`,
                    height: `${planet.planetSize}px`,
                    boxShadow: 'inset -7px -7px 14px rgba(0, 0, 0, 0.85), inset 3px 3px 7px rgba(255, 255, 255, 0.35)',
                  }}
                >
                  {/* Subtle Planetary Orbit Ring */}
                  <div 
                    className={`absolute inset-[-8px] rounded-[100%] border pointer-events-none transition-opacity duration-300 ${
                      isSelected ? 'border-white/60 opacity-80' : 'border-white/25 opacity-40 group-hover:opacity-70'
                    }`}
                    style={{
                      transform: 'rotateX(70deg) rotateZ(25deg)',
                    }}
                  />
                </div>

                {/* Clean Non-Glowing Planet Name Label */}
                <div className={`mt-2.5 px-3 py-0.5 rounded-full text-xs font-semibold tracking-wide whitespace-nowrap transition-all duration-200 border ${
                  isSelected
                    ? 'bg-white text-black border-white shadow-md'
                    : 'bg-[#0a0c12]/90 text-slate-300 border-white/20 backdrop-blur-md group-hover:border-white/50 group-hover:text-white'
                }`}>
                  {planet.planetName}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Planet Clean Project Details Card */}
      <div className="relative z-30 mx-auto max-w-xl w-full mt-auto mb-4 px-2">
        <div className="relative rounded-3xl p-5 sm:p-6 bg-gradient-to-b from-[#0e111a]/95 via-[#0a0c10]/95 to-[#07080b]/95 border border-white/15 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,0,0,0.9)] text-center transition-all duration-300">
          
          {/* Top Specular Highlight */}
          <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />

          {/* Project Title */}
          <h3 className="text-lg sm:text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-300 tracking-tight mb-2">
            {selectedPlanet.title}
          </h3>

          {/* Project Description */}
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light max-w-lg mx-auto">
            {selectedPlanet.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProjectsSection;
