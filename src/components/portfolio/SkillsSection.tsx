import React, { useEffect, useRef, useState, useMemo } from 'react';
import Matter from 'matter-js';
import { Diamond } from 'lucide-react';

interface SkillItem {
  id: string;
  name: string;
  category: 'DEV' | 'AUTOMATION' | 'DB & CLOUD';
  color: string;
  borderColor: string;
  glowColor: string;
  textColor: string;
  desc: string;
  width?: number;
  height?: number;
}

interface DiamondParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  angle: number;
  vRot: number;
  life: number;
  maxLife: number;
  color: string;
  twinklePhase: number;
  shimmerSpeed: number;
}

const SKILLS_DATA: SkillItem[] = [
  // DEV
  { id: 'python', name: 'Python', category: 'DEV', color: '#0e121a', borderColor: '#ffffff', glowColor: 'rgba(255, 255, 255, 0.8)', textColor: '#ffffff', desc: 'Core Python, Scripting, Automation & OOP' },
  { id: 'fastapi', name: 'FastAPI', category: 'DEV', color: '#101420', borderColor: '#e2e8f0', glowColor: 'rgba(226, 232, 240, 0.75)', textColor: '#f8fafc', desc: 'High-throughput async RESTful APIs' },
  { id: 'html-css', name: 'HTML & CSS', category: 'DEV', color: '#0f131c', borderColor: '#e2e8f0', glowColor: 'rgba(226, 232, 240, 0.75)', textColor: '#f8fafc', desc: 'Semantic layouts, Flexbox, Responsive Design & Styling' },
  { id: 'dsa', name: 'DSA', category: 'DEV', color: '#111622', borderColor: '#ffffff', glowColor: 'rgba(255, 255, 255, 0.8)', textColor: '#ffffff', desc: 'Data Structures & Algorithms' },
  { id: 'git', name: 'Git & GitHub', category: 'DEV', color: '#10141f', borderColor: '#cbd5e1', glowColor: 'rgba(203, 213, 225, 0.7)', textColor: '#ffffff', desc: 'Version control, PRs & Branch workflows' },

  // AUTOMATION
  { id: 'n8n', name: 'n8n', category: 'AUTOMATION', color: '#14131e', borderColor: '#ffffff', glowColor: 'rgba(255, 255, 255, 0.85)', textColor: '#ffffff', desc: 'Multi-node visual workflow automation' },
  { id: 'ai-tools', name: 'AI Tools & APIs', category: 'AUTOMATION', color: '#111422', borderColor: '#ffffff', glowColor: 'rgba(255, 255, 255, 0.85)', textColor: '#ffffff', desc: 'LLM integrations, OpenAI & Gemini APIs, Prompt Engineering & AI Workflows' },

  // DB & CLOUD
  { id: 'mysql', name: 'MySQL', category: 'DB & CLOUD', color: '#0f1521', borderColor: '#ffffff', glowColor: 'rgba(255, 255, 255, 0.85)', textColor: '#ffffff', desc: 'Relational database schema, Joins & Queries' },
  { id: 'firebase', name: 'Firebase', category: 'DB & CLOUD', color: '#131622', borderColor: '#e2e8f0', glowColor: 'rgba(226, 232, 240, 0.75)', textColor: '#f8fafc', desc: 'Cloud web hosting & Firestore database' },
  { id: 'dbms', name: 'DBMS & SQL', category: 'DB & CLOUD', color: '#10141e', borderColor: '#cbd5e1', glowColor: 'rgba(203, 213, 225, 0.7)', textColor: '#ffffff', desc: 'ACID transactions & Normalization' },
  { id: 'docker', name: 'Docker', category: 'DB & CLOUD', color: '#0e1828', borderColor: '#ffffff', glowColor: 'rgba(255, 255, 255, 0.85)', textColor: '#ffffff', desc: 'Containerization, Dockerfiles & Isolated environments' },
];

type FilterType = 'ALL' | 'DEV' | 'AUTOMATION' | 'DB & CLOUD';

const SkillsSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const bodiesRef = useRef<Array<{ body: Matter.Body; item: SkillItem; width: number; height: number }>>([]);
  const mousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const hoveredItemRef = useRef<SkillItem | null>(null);
  const diamondParticlesRef = useRef<DiamondParticle[]>([]);

  const [activeFilter, setActiveFilter] = useState<FilterType>('ALL');
  const [hoveredSkill, setHoveredSkill] = useState<SkillItem | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<SkillItem | null>(null);

  const activeFilterRef = useRef<FilterType>('ALL');
  const selectedSkillRef = useRef<SkillItem | null>(null);
  const lastCollisionTimeRef = useRef<Record<string, number>>({});
  const hasDroppedRef = useRef<boolean>(false);

  useEffect(() => {
    activeFilterRef.current = activeFilter;
  }, [activeFilter]);

  useEffect(() => {
    selectedSkillRef.current = selectedSkill;
  }, [selectedSkill]);

  const counts = useMemo(() => {
    const res: Record<FilterType, number> = {
      ALL: SKILLS_DATA.length,
      DEV: 0,
      AUTOMATION: 0,
      'DB & CLOUD': 0,
    };
    SKILLS_DATA.forEach((s) => {
      res[s.category]++;
    });
    return res;
  }, []);

  // Spawn Sparkling Small Diamond Particles (Strict physics scaling)
  const spawnDiamondSparks = (
    x: number,
    y: number,
    force: number = 1,
    isDirectHit: boolean = false
  ) => {
    let count = 0;

    if (isDirectHit) {
      if (force > 4.0) {
        count = Math.floor(Math.random() * 7 + 12);
      } else if (force > 2.0) {
        count = Math.floor(Math.random() * 4 + 6);
      } else if (force > 0.8) {
        count = Math.floor(Math.random() * 3 + 3);
      } else {
        return;
      }
    } else {
      if (force > 4.5) {
        count = Math.floor(Math.random() * 3 + 4);
      } else if (force > 2.0) {
        count = Math.floor(Math.random() * 2 + 1);
      } else {
        return;
      }
    }

    const colors = ['#ffffff', '#f8fafc', '#f1f5f9', '#e2e8f0', '#cbd5e1', '#e0f2fe'];
    const intensityMultiplier = isDirectHit
      ? Math.min(Math.max(force * 0.4, 0.9), 2.2)
      : Math.min(Math.max(force * 0.25, 0.5), 1.2);

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = (Math.random() * 2.8 + 1.2) * intensityMultiplier;
      const size = Math.random() * 1.6 + 1.4;
      const maxLife = Math.floor(Math.random() * 15 + 20);
      const color = colors[Math.floor(Math.random() * colors.length)];

      diamondParticlesRef.current.push({
        x: x + (Math.random() - 0.5) * 4,
        y: y + (Math.random() - 0.5) * 4,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (isDirectHit ? 1.2 : 0.4),
        size,
        angle: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.4,
        life: 0,
        maxLife,
        color,
        twinklePhase: Math.random() * Math.PI * 2,
        shimmerSpeed: Math.random() * 0.35 + 0.2,
      });
    }

    if (diamondParticlesRef.current.length > 250) {
      diamondParticlesRef.current = diamondParticlesRef.current.slice(-250);
    }
  };

  // Draw High-Fidelity Small Faceted Diamond Gemstone
  const drawDiamond = (ctx: CanvasRenderingContext2D, p: DiamondParticle) => {
    const progress = p.life / p.maxLife;
    const alpha = Math.max(0, 1 - Math.pow(progress, 1.5));
    const s = p.size * (1 - progress * 0.15);
    const twinkle = Math.sin(p.twinklePhase + p.life * p.shimmerSpeed);

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.angle);
    ctx.globalAlpha = alpha;

    ctx.shadowColor = 'rgba(255, 255, 255, 0.95)';
    ctx.shadowBlur = 4 * alpha;

    // 1. Faceted Gem Silhouette
    ctx.beginPath();
    ctx.moveTo(-s * 0.55, -s * 0.6);
    ctx.lineTo(s * 0.55, -s * 0.6);
    ctx.lineTo(s * 0.95, -s * 0.1);
    ctx.lineTo(0, s * 0.95);
    ctx.lineTo(-s * 0.95, -s * 0.1);
    ctx.closePath();

    ctx.fillStyle = p.color;
    ctx.fill();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 0.5;
    ctx.stroke();

    // 2. Internal facets
    ctx.beginPath();
    ctx.moveTo(-s * 0.55, -s * 0.6);
    ctx.lineTo(0, -s * 0.1);
    ctx.lineTo(s * 0.55, -s * 0.6);
    ctx.moveTo(-s * 0.95, -s * 0.1);
    ctx.lineTo(s * 0.95, -s * 0.1);
    ctx.moveTo(0, -s * 0.1);
    ctx.lineTo(0, s * 0.95);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.lineWidth = 0.4;
    ctx.stroke();

    // 3. Sparkling 4-Point Star Glint
    if (twinkle > 0.3) {
      const glintLen = s * (0.8 + twinkle * 0.7);
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 6;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 0.5;

      ctx.beginPath();
      ctx.moveTo(0, -glintLen);
      ctx.lineTo(0, glintLen);
      ctx.moveTo(-glintLen, 0);
      ctx.lineTo(glintLen, 0);
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, 0, s * 0.2, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  };

  // Initialize Matter.js Physics Engine ONCE on mount
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const size = Math.round(Math.min(rect.width, rect.height)) || 450;
    const dpr = window.devicePixelRatio || 1;

    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;

    const { Engine, World, Bodies, Mouse, MouseConstraint, Runner, Body, Events } = Matter;

    const engine = Engine.create({
      gravity: { x: 0, y: 1.15, scale: 0.001 },
      enableSleeping: false,
    });
    engineRef.current = engine;

    const centerX = size / 2;
    const centerY = size / 2;
    const arenaRadius = size / 2 - 4;

    // Build smooth circular boundary with segmented static rectangle walls
    const NUM_SEGMENTS = 40;
    const segmentWidth = (2 * Math.PI * arenaRadius) / NUM_SEGMENTS + 8;
    const wallThickness = 28;
    const circleWalls: Matter.Body[] = [];

    for (let i = 0; i < NUM_SEGMENTS; i++) {
      const angle = (i * 2 * Math.PI) / NUM_SEGMENTS;
      const wallX = centerX + (arenaRadius + wallThickness / 2 - 2) * Math.cos(angle);
      const wallY = centerY + (arenaRadius + wallThickness / 2 - 2) * Math.sin(angle);
      const wallAngle = angle + Math.PI / 2;

      const wall = Bodies.rectangle(wallX, wallY, segmentWidth, wallThickness, {
        isStatic: true,
        restitution: 0.7,
        friction: 0.06,
        angle: wallAngle,
      });
      circleWalls.push(wall);
    }

    World.add(engine.world, circleWalls);

    const bodiesList: Array<{ body: Matter.Body; item: SkillItem; width: number; height: number }> = [];

    const tempCtx = canvas.getContext('2d');
    if (tempCtx) {
      tempCtx.font = 'bold 12px ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    }

    const pillHeight = 35;

    SKILLS_DATA.forEach((item, index) => {
      const textWidth = tempCtx ? tempCtx.measureText(item.name).width : item.name.length * 8.5;
      const pillWidth = Math.max(textWidth + 34, 82);

      // Start in 3 staggered waves in the upper portion of the circular arena
      const row = Math.floor(index / 4);
      const col = index % 4;
      const startX = centerX - 110 + col * 75 + (Math.random() * 20 - 10);
      const startY = centerY - 140 + row * 65 + (Math.random() * 20 - 10);

      const body = Bodies.rectangle(startX, startY, pillWidth, pillHeight, {
        chamfer: { radius: pillHeight / 2 },
        restitution: 0.65,
        friction: 0.06,
        frictionAir: 0.014,
        density: 0.002,
        angle: (Math.random() - 0.5) * 0.35,
      });

      World.add(engine.world, body);
      bodiesList.push({ body, item, width: pillWidth, height: pillHeight });
    });

    bodiesRef.current = bodiesList;

    // Fail-safe radial containment to prevent any capsule from tunneling through circular walls
    Events.on(engine, 'beforeUpdate', () => {
      bodiesList.forEach(({ body, width: bw, height: bh }) => {
        const halfDiag = Math.hypot(bw / 2, bh / 2) * 0.88;
        const dx = body.position.x - centerX;
        const dy = body.position.y - centerY;
        const dist = Math.hypot(dx, dy);
        const maxDist = arenaRadius - halfDiag;

        if (dist > maxDist && dist > 0.0001) {
          const nx = dx / dist;
          const ny = dy / dist;
          Matter.Body.setPosition(body, {
            x: centerX + nx * maxDist,
            y: centerY + ny * maxDist,
          });
          const dot = body.velocity.x * nx + body.velocity.y * ny;
          if (dot > 0) {
            Matter.Body.setVelocity(body, {
              x: (body.velocity.x - 1.6 * dot * nx) * 0.75,
              y: (body.velocity.y - 1.6 * dot * ny) * 0.75,
            });
          }
        }
      });
    });

    // Trigger one-time drop when section scrolls into view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasDroppedRef.current) {
            hasDroppedRef.current = true;
            bodiesRef.current.forEach(({ body }, idx) => {
              const row = Math.floor(idx / 4);
              const col = idx % 4;
              const startX = centerX - 110 + col * 75 + (Math.random() * 20 - 10);
              const startY = centerY - 150 + row * 65 + (Math.random() * 20 - 10);
              Matter.Body.setPosition(body, { x: startX, y: startY });
              Matter.Body.setVelocity(body, {
                x: (Math.random() - 0.5) * 1.5,
                y: Math.random() * 2.5 + 1.5,
              });
              Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.07);
            });
          }
        });
      },
      { threshold: 0.2 }
    );

    if (container) {
      observer.observe(container);
    }

    let lastMousePos = { x: 0, y: 0, time: performance.now() };
    let mouseSpeed = 0;

    const mouse = Mouse.create(canvas);
    mouse.pixelRatio = dpr;

    // Remove wheel event listeners so scrolling over skills canvas is smooth and uninterrupted
    canvas.removeEventListener('mousewheel', (mouse as any).mousewheel);
    canvas.removeEventListener('DOMMouseScroll', (mouse as any).mousewheel);

    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.25,
        render: { visible: false },
      },
    });

    World.add(engine.world, mouseConstraint);

    // Collision handling
    Events.on(engine, 'collisionStart', (event) => {
      const draggedBody = mouseConstraint.body;
      const now = performance.now();

      event.pairs.forEach((pair) => {
        const { bodyA, bodyB, collision } = pair;

        if (bodyA.isStatic || bodyB.isStatic) return;

        const pairKey = bodyA.id < bodyB.id ? `${bodyA.id}-${bodyB.id}` : `${bodyB.id}-${bodyA.id}`;
        const lastTime = lastCollisionTimeRef.current[pairKey] || 0;
        if (now - lastTime < 130) return;
        lastCollisionTimeRef.current[pairKey] = now;

        const vA = bodyA.velocity;
        const vB = bodyB.velocity;
        const relVel = Math.hypot(vA.x - vB.x, vA.y - vB.y);
        const speedA = Math.hypot(vA.x, vA.y);
        const speedB = Math.hypot(vB.x, vB.y);

        const isDraggedHit = Boolean(
          draggedBody && (draggedBody === bodyA || draggedBody === bodyB)
        );

        let contactX = (bodyA.position.x + bodyB.position.x) / 2;
        let contactY = (bodyA.position.y + bodyB.position.y) / 2;

        if (collision.supports && collision.supports.length > 0) {
          contactX = collision.supports[0].x;
          contactY = collision.supports[0].y;
        }

        let impactForce = Math.max(relVel, speedA + speedB);

        if (isDraggedHit) {
          impactForce = Math.max(impactForce * 1.5 + mouseSpeed * 0.5, 4.5);
          spawnDiamondSparks(contactX, contactY, impactForce, true);
        } else {
          spawnDiamondSparks(contactX, contactY, impactForce, false);
        }
      });
    });

    // Helper: Exact Oriented Bounding Box hit-test for capsules
    const findHitCapsule = (mx: number, my: number) => {
      return bodiesList.find(({ body, width: bw, height: bh }) => {
        const dx = mx - body.position.x;
        const dy = my - body.position.y;
        const cos = Math.cos(-body.angle);
        const sin = Math.sin(-body.angle);
        const localX = dx * cos - dy * sin;
        const localY = dx * sin + dy * cos;
        return Math.abs(localX) <= bw / 2 && Math.abs(localY) <= bh / 2;
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mousePosRef.current = { x, y };

      const now = performance.now();
      const dt = Math.max(now - lastMousePos.time, 8);
      const dist = Math.hypot(x - lastMousePos.x, y - lastMousePos.y);
      mouseSpeed = (dist / dt) * 16;
      lastMousePos = { x, y, time: now };

      const found = findHitCapsule(x, y);

      if (found) {
        hoveredItemRef.current = found.item;
        setHoveredSkill(found.item);
        canvas.style.cursor = 'grab';
      } else {
        hoveredItemRef.current = null;
        setHoveredSkill(null);
        canvas.style.cursor = 'default';
      }
    };

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const found = findHitCapsule(x, y);

      if (found) {
        setSelectedSkill(found.item);
        Body.applyForce(found.body, found.body.position, {
          x: (Math.random() - 0.5) * 0.05,
          y: -0.09,
        });
        spawnDiamondSparks(found.body.position.x, found.body.position.y, 3, true);
      }
    };

    const handleDoubleClick = () => {
      bodiesList.forEach(({ body }) => {
        Body.applyForce(body, body.position, {
          x: (Math.random() - 0.5) * 0.08,
          y: -(0.06 + Math.random() * 0.07),
        });
      });
      if (bodiesList.length > 0) {
        spawnDiamondSparks(centerX, centerY, 5, true);
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (!e.touches[0]) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.touches[0].clientX - rect.left;
      const y = e.touches[0].clientY - rect.top;

      const found = findHitCapsule(x, y);
      if (found) {
        setSelectedSkill(found.item);
        setHoveredSkill(found.item);
        Body.applyForce(found.body, found.body.position, {
          x: (Math.random() - 0.5) * 0.05,
          y: -0.09,
        });
        spawnDiamondSparks(found.body.position.x, found.body.position.y, 3, true);
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleClick);
    canvas.addEventListener('dblclick', handleDoubleClick);
    canvas.addEventListener('touchstart', handleTouchStart, { passive: true });

    const runner = Runner.create();
    runnerRef.current = runner;
    Runner.run(runner, engine);

    let animationFrameId: number;

    const render = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const currentFilter = activeFilterRef.current;
      const currentSelected = selectedSkillRef.current;

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, size, size);

      // Clip all rendering strictly within the circular sandbox arena
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, arenaRadius, 0, Math.PI * 2);
      ctx.clip();

      // Draw subtle silver grid inside circular arena
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < size; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, size);
        ctx.stroke();
      }
      for (let y = 0; y < size; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(size, y);
        ctx.stroke();
      }

      // 1. Render Each Skill Capsule Body
      bodiesList.forEach(({ body, item, width: bw, height: bh }) => {
        const { x, y } = body.position;
        const angle = body.angle;

        const isMatchingFilter = currentFilter === 'ALL' || item.category === currentFilter;
        const isHovered = hoveredItemRef.current?.id === item.id;
        const isSelected = currentSelected?.id === item.id;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);

        ctx.globalAlpha = isMatchingFilter ? 1 : 0.18;

        const rx = -bw / 2;
        const ry = -bh / 2;
        const radius = bh / 2;

        ctx.beginPath();
        ctx.roundRect(rx, ry, bw, bh, radius);

        // Capsule Body Fill
        ctx.fillStyle = isSelected
          ? '#232a3b'
          : isHovered
            ? '#1e2433'
            : isMatchingFilter && currentFilter !== 'ALL'
              ? '#181e2b'
              : item.color;
        ctx.fill();

        // Glowing outer shadow on hover or filter
        if (isMatchingFilter && (isHovered || isSelected || currentFilter !== 'ALL')) {
          ctx.shadowColor = isHovered || isSelected ? '#ffffff' : item.glowColor;
          ctx.shadowBlur = isHovered || isSelected ? 24 : currentFilter !== 'ALL' ? 18 : 10;
        } else {
          ctx.shadowColor = 'transparent';
          ctx.shadowBlur = 0;
        }

        ctx.strokeStyle = isHovered || isSelected
          ? '#ffffff'
          : isMatchingFilter && currentFilter !== 'ALL'
            ? '#ffffff'
            : isMatchingFilter
              ? item.borderColor
              : 'rgba(148, 163, 184, 0.25)';
        ctx.lineWidth = isHovered || isSelected ? 2.4 : isMatchingFilter && currentFilter !== 'ALL' ? 2 : isMatchingFilter ? 1.4 : 0.9;
        ctx.stroke();

        // Top Specular Highlight Line along capsule
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.moveTo(rx + radius * 0.6, ry + 2);
        ctx.lineTo(rx + bw - radius * 0.6, ry + 2);
        ctx.strokeStyle = isHovered || isSelected ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Capsule Label Typography - Auto-flip text when capsule rotates past 90deg so it is NEVER upside-down
        const normAngle = ((angle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
        const isUpsideDown = normAngle > Math.PI / 2 && normAngle < (3 * Math.PI) / 2;

        ctx.save();
        if (isUpsideDown) {
          ctx.rotate(Math.PI);
        }
        ctx.font = 'bold 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = isHovered || isSelected || (isMatchingFilter && currentFilter !== 'ALL') ? '#ffffff' : item.textColor;
        ctx.fillText(item.name, 0, 0.5);
        ctx.restore();

        ctx.restore();
      });

      // 2. Render Diamond Particle Sparks on top
      for (let i = diamondParticlesRef.current.length - 1; i >= 0; i--) {
        const p = diamondParticlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.07;
        p.vx *= 0.985;
        p.vy *= 0.985;
        p.angle += p.vRot;
        p.life += 1;

        if (p.life >= p.maxLife) {
          diamondParticlesRef.current.splice(i, 1);
        } else {
          drawDiamond(ctx, p);
        }
      }

      ctx.restore(); // end clip

      // Circular Arena Inner Perimeter Border Ring
      ctx.beginPath();
      ctx.arc(centerX, centerY, arenaRadius - 1, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleClick);
      canvas.removeEventListener('dblclick', handleDoubleClick);
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      if (runnerRef.current) Runner.stop(runnerRef.current);
      if (engineRef.current) World.clear(engineRef.current.world, false);
    };
  }, []);

  const handleFilterClick = (cat: FilterType) => {
    setActiveFilter(cat);
  };

  return (
    <div className="w-full h-full min-h-[calc(100vh-4rem)] flex flex-col justify-between items-center px-3 sm:px-6 pt-2 pb-2 relative overflow-hidden bg-[#060709] text-slate-100">

      {/* Background Silver Ambient Glows */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-white/[0.03] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-slate-400/[0.03] rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-5xl w-full flex flex-col items-center justify-between h-full relative z-10 py-1">

        {/* Header Title */}
        <div className="text-center space-y-0.5">
          <div className="text-[11px] sm:text-xs text-slate-300 tracking-[0.25em] font-semibold uppercase flex items-center justify-center gap-1.5">
            <Diamond size={13} className="text-white animate-pulse" />
            <span>INTERACTIVE TECH STACK</span>
          </div>

          <div className="relative inline-block">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 select-none drop-shadow-[0_0_25px_rgba(255,255,255,0.25)]">
              Skills
            </h2>
          </div>
        </div>

        {/* Filter Navigation Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 py-0.5">
          <span className="text-slate-400 font-semibold text-xs tracking-wider uppercase mr-1 hidden sm:inline">
            Filter:
          </span>

          {(['ALL', 'DEV', 'AUTOMATION', 'DB & CLOUD'] as const).map((cat) => {
            const countStr = counts[cat].toString().padStart(2, '0');
            const isActive = activeFilter === cat;

            return (
              <button
                key={cat}
                onClick={() => handleFilterClick(cat)}
                className={`px-3.5 py-1 rounded-full border text-xs font-semibold tracking-wider transition-all duration-200 uppercase flex items-center gap-1.5 cursor-pointer ${isActive
                  ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.5)] font-bold'
                  : 'bg-white/5 border-white/15 text-slate-300 hover:border-white/40 hover:text-white hover:bg-white/10'
                  }`}
              >
                <span>{cat}</span>
                <span className={`text-[10px] ${isActive ? 'text-black font-extrabold' : 'text-slate-400'}`}>
                  ({countStr})
                </span>
              </button>
            );
          })}
        </div>

        {/* CIRCULAR ARENA Physics Sandbox Container */}
        <div
          ref={containerRef}
          className="relative w-[min(450px,85vw,52vh)] h-[min(450px,85vw,52vh)] aspect-square shrink-0 rounded-full border border-white/20 bg-gradient-to-b from-[#0e1117]/95 via-[#0a0c10]/95 to-[#07080b]/95 shadow-[0_0_60px_rgba(0,0,0,0.9),0_0_25px_rgba(255,255,255,0.06)] overflow-hidden backdrop-blur-xl flex items-center justify-center my-auto"
        >
          {/* Inner Circular Highlight Glow */}
          <div className="absolute inset-0 rounded-full pointer-events-none bg-[radial-gradient(circle_at_center,transparent_60%,rgba(0,0,0,0.6)_100%)] z-20" />

          {/* Physics Canvas */}
          <canvas
            ref={canvasRef}
            className="block w-full h-full touch-none select-none relative z-10 rounded-full"
          />
        </div>

        {/* Selected Skill / Hover Detail Popover Card */}
        <div className="w-full flex items-center justify-center min-h-[36px]">
          {(selectedSkill || hoveredSkill) && (
            <div className="w-full max-w-xl bg-gradient-to-r from-[#0e1117]/95 via-[#0a0c10]/95 to-[#0e1117]/95 border border-white/20 rounded-xl px-4 py-2 shadow-2xl backdrop-blur-xl animate-in fade-in duration-150 flex items-center justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border bg-white/10 border-white/25 text-white">
                    {(selectedSkill || hoveredSkill)?.category}
                  </span>
                  <span className="text-xs font-bold text-white">
                    {(selectedSkill || hoveredSkill)?.name}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 mt-0.5 line-clamp-1">
                  {(selectedSkill || hoveredSkill)?.desc}
                </p>
              </div>

              {selectedSkill && (
                <button
                  onClick={() => setSelectedSkill(null)}
                  className="text-[10px] text-slate-300 hover:text-white px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 transition-all cursor-pointer"
                >
                  Close
                </button>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default SkillsSection;
