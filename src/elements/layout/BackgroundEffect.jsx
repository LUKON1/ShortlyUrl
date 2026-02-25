import { useContext, useEffect, useRef } from "react";
import { ThemeContext } from "../../context/ThemeProvider";

const BackgroundEffect = () => {
  const canvasRef = useRef(null);
  const { theme } = useContext(ThemeContext);
  const animationFrameId = useRef(null);
  const mouseRef = useRef({ x: -9999, y: -9999, isClick: false });
  const isSleeping = useRef(false);

  // New refs for idle behavior
  const lastInteractionTime = useRef(Date.now());
  const isIdle = useRef(false);
  const timeRef = useRef(0); // For generating ghost cursor movement
  const lastTouchTime = useRef(0); // To ignore synthetic mouse events
  // Store last known interaction position for mobile "resume" behavior
  const lastPosRef = useRef({ x: 0, y: 0 }); // Intialize with 0,0 but will be set on resize

  // Mobile detection ref to use inside animation loop
  const isMobileRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let particles = [];
    const particleSpacing = 40;
    const mouseRadius = 150;
    const returnSpeed = 0.08;
    let w, h;

    // Configuration
    const baseOpacity = 0.3;
    const velocityColorBoost = 0.15; // How much brighter when fast

    let lastW = 0;

    const resize = () => {
      const newW = window.innerWidth;
      const newH = window.innerHeight;

      const widthChanged = lastW !== newW;

      w = canvas.width = newW;
      h = canvas.height = newH;
      lastW = newW;

      // On resize, if we haven't interacted yet, center the "resume" point
      if (lastPosRef.current.x === 0 && lastPosRef.current.y === 0) {
        lastPosRef.current = { x: w / 2, y: h / 2 };
      }

      // Only re-init particles if width changes (orientation) to avoid flash on mobile vertical scroll
      if (widthChanged || particles.length === 0) {
        initParticles();
      }
      wakeUp();
    };

    const initParticles = () => {
      particles = [];
      const cols = Math.ceil(w / particleSpacing);
      // Add a generous 300px buffer to height to prevent empty space when mobile address bar hides
      const rows = Math.ceil((h + 300) / particleSpacing);

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          particles.push({
            x: i * particleSpacing + particleSpacing / 2,
            y: j * particleSpacing + particleSpacing / 2,
            originX: i * particleSpacing + particleSpacing / 2,
            originY: j * particleSpacing + particleSpacing / 2,
            vx: 0,
            vy: 0,
            size: theme === "dark" ? 1.5 : 2,
          });
        }
      }
    };

    const wakeUp = () => {
      if (isSleeping.current) {
        isSleeping.current = false;
        animate();
      }
    };

    const animate = () => {
      // If sleeping and strictly not idle (shouldn't happen if logic is correct), stop
      if (isSleeping.current) return;

      ctx.clearRect(0, 0, w, h);
      timeRef.current += 0.01;

      // Check for idle state
      const now = Date.now();
      const isMobile = isMobileRef.current;
      const idleDelay = isMobile ? 0 : 2500;

      // On mobile, if no touch active (x = -9999), we want almost immediate idle (or respect the short delay)
      // Actually, to fix the "gap", if we are mobile and NO touch is active, let's treat it as idle candidates
      // The delay helps avoid flickering if touch is lost for a millisecond?
      // But 200ms is short.

      if (now - lastInteractionTime.current > idleDelay) {
        isIdle.current = true;
      } else {
        isIdle.current = false;
      }

      // Determine active target position
      let targetX = mouseRef.current.x;
      let targetY = mouseRef.current.y;

      // Ensure lastPosRef is initialized
      if (!lastPosRef.current || lastPosRef.current.x === undefined) {
        lastPosRef.current = { x: w / 2, y: h / 2 };
      }

      if (isIdle.current) {
        // Ghost cursor movement (Lissajous-like pattern)

        // On all devices, default to center of screen for the idle ghost pattern
        const centerX = w / 2;
        const centerY = h / 2;

        // Wander radius
        const radiusX = w * 0.3;
        const radiusY = h * 0.3;

        targetX = centerX + Math.cos(timeRef.current * 0.7) * radiusX;
        targetY = centerY + Math.sin(timeRef.current * 1.1) * radiusY;
      } else {
        // If active, update last known position (for mobile resume)
        // valid mouse position check
        if (mouseRef.current.x > -500) {
          lastPosRef.current = { x: mouseRef.current.x, y: mouseRef.current.y };
        }
      }

      let totalVelocity = 0;
      const isClick = mouseRef.current.isClick;
      if (isClick) mouseRef.current.isClick = false; // Reset click trigger

      particles.forEach((p) => {
        // physics calculation
        // If mouse is off screen (-9999) and NOT idle, don't affect particles with mouse
        // But if idle, targetX/Y are valid ghost coordinates.
        let dist = 99999;
        let dx = 0;
        let dy = 0;

        // Apply force only if we have a valid target (real mouse or ghost)
        // Real mouse is valid if > -500 (simple check)
        // Ghost is always valid
        if (targetX > -500 || isIdle.current) {
          dx = targetX - p.x;
          dy = targetY - p.y;
          dist = Math.sqrt(dx * dx + dy * dy);
        }

        // Interaction
        if (isClick && dist < 300) {
          // Shockwave: Massive impulse
          const force = (300 - dist) / 300;
          const angle = Math.atan2(dy, dx);
          const pushX = Math.cos(angle) * force * 50; // STRONG Power
          const pushY = Math.sin(angle) * force * 50;
          p.vx -= pushX;
          p.vy -= pushY;
        } else if (dist < mouseRadius) {
          // Gentle Gravity Well
          const force = (mouseRadius - dist) / mouseRadius;
          const angle = Math.atan2(dy, dx);
          const pushX = Math.cos(angle) * force * 4;
          const pushY = Math.sin(angle) * force * 4;

          p.vx -= pushX;
          p.vy -= pushY;
        }

        // Return to origin
        const dxOrigin = p.originX - p.x;
        const dyOrigin = p.originY - p.y;

        p.vx += dxOrigin * returnSpeed;
        p.vy += dyOrigin * returnSpeed;

        // Friction
        p.vx *= 0.85;
        p.vy *= 0.85;

        // Apply
        p.x += p.vx;
        p.y += p.vy;

        // Dynamic Color & Opacity
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        totalVelocity += speed;

        // 1. Distance Opacity (Flashlight effect)
        // Fade radius: 800px.
        // Logic: Closer = Base Opacity. Further = Fades to near zero.
        const fadeRadius = 800;
        let distOpacity = 0;

        if (dist < fadeRadius) {
          // Linear fade: 1.0 at center -> 0.0 at radius
          distOpacity = (1 - dist / fadeRadius) * baseOpacity;
        } else {
          distOpacity = 0; // Invisible if too far
        }

        // 2. Velocity Boost (Flash on move)
        const speedFactor = Math.min(speed / 5, 1);
        const velocityOpacity = speedFactor * 0.5; // Up to +0.5 opacity if moving fast

        // Combine
        let finalOpacity = Math.min(distOpacity + velocityOpacity, 1);

        // Safety clamp
        if (finalOpacity < 0) finalOpacity = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);

        if (theme === "dark") {
          ctx.fillStyle = `rgba(34, 211, 238, ${finalOpacity})`;
        } else {
          ctx.fillStyle = `rgba(100, 116, 139, ${finalOpacity})`;
        }

        ctx.fill();
      });

      // Sleep Logic
      // Only sleep on desktop if completely still
      // On mobile, NEVER sleep because we want continuous animation

      const shouldSleep =
        !isMobile && totalVelocity < 0.5 && !isIdle.current && mouseRef.current.x === -9999;

      if (shouldSleep) {
        isSleeping.current = true;
      } else {
        animationFrameId.current = requestAnimationFrame(animate);
      }
    };

    const handleInput = (x, y) => {
      mouseRef.current.x = x;
      mouseRef.current.y = y;
      lastInteractionTime.current = Date.now();
      isIdle.current = false;
      wakeUp();
    };

    const handleMouseMove = (e) => {
      // Ignore synthetic mouse events fired after touch
      if (Date.now() - lastTouchTime.current < 500) return;
      isMobileRef.current = false; // Revert to desktop behavior on mouse use
      handleInput(e.clientX, e.clientY);
    };

    const handleTouchMove = (e) => {
      isMobileRef.current = true; // Activate mobile behavior on first touch
      lastTouchTime.current = Date.now();
      lastInteractionTime.current = Date.now(); // Ensure we have a fresh timestamp
      wakeUp(); // Restart animation loop if sleeping

      // User requested to disable direct touch interaction (no handleInput)
      // Just let the idle "ghost" animation play continuously
    };

    const handleClick = () => {
      // Ignore synthetic click events fired after touch
      if (Date.now() - lastTouchTime.current < 500) return;

      mouseRef.current.isClick = true;
      isMobileRef.current = false; // Revert to desktop behavior on click
      lastInteractionTime.current = Date.now();
      wakeUp();
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = -9999;
      mouseRef.current.y = -9999;
      // Do not reset timer here, let it run out to trigger idle
    };

    const handleTouchEnd = () => {
      lastTouchTime.current = Date.now();
      mouseRef.current.x = -9999;
      mouseRef.current.y = -9999;
      lastInteractionTime.current = Date.now(); // Reset idle timer
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleClick);
    window.addEventListener("mouseout", handleMouseLeave);

    // Listen for touches just to set mobile state, do not track movement
    window.addEventListener("touchstart", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    // Initial setup
    resize();
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleClick);
      window.removeEventListener("mouseout", handleMouseLeave);
      window.removeEventListener("touchstart", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      cancelAnimationFrame(animationFrameId.current);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      style={{ width: "100%", height: "100%" }}
    />
  );
};

export default BackgroundEffect;
