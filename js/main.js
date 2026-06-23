/* ============================================================
   DMS — Main JS : Cursor, Loader, Nav, Scroll, Particles
   ============================================================ */

/* ── Theme Toggle ───────────────────────────────────────── */
(function initTheme() {
  const html = document.documentElement;
  const saved = localStorage.getItem('dms-theme') || 'light';
  html.setAttribute('data-theme', saved);

  document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      localStorage.setItem('dms-theme', next);
    });
  });
})();

/* ── Monitor Live Clock ─────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const el = document.getElementById('monitor-time');
  if (!el) return;
  const pad = n => String(n).padStart(2, '0');
  const tick = () => {
    const d = new Date();
    el.textContent = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  };
  tick();
  setInterval(tick, 1000);
});

/* ── Page Loader ────────────────────────────────────────── */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (!loader) return;
  setTimeout(() => loader.classList.add('hidden'), 1800);
});

/* ── Custom Cursor ──────────────────────────────────────── */
(function initCursor() {
  if (window.matchMedia('(hover:none)').matches) return;
  const dot  = document.createElement('div'); dot.className  = 'cursor-dot';
  const ring = document.createElement('div'); ring.className = 'cursor-ring';
  document.body.append(dot, ring);

  let mx = -100, my = -100, rx = -100, ry = -100;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  const hover = document.querySelectorAll('a, button, .btn, .card, .float-btn, input, textarea, select, [data-hover]');
  hover.forEach(el => {
    el.addEventListener('mouseenter', () => { dot.classList.add('active'); ring.classList.add('active'); });
    el.addEventListener('mouseleave', () => { dot.classList.remove('active'); ring.classList.remove('active'); });
  });

  const lerp = (a,b,t) => a + (b-a)*t;
  const tick = () => {
    dot.style.left  = mx + 'px';
    dot.style.top   = my + 'px';
    rx = lerp(rx, mx, .12); ry = lerp(ry, my, .12);
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
})();

/* ── Navigation ─────────────────────────────────────────── */
(function initNav() {
  const ready = () => {
    const nav   = document.querySelector('.nav');
    const ham   = document.querySelector('.nav-hamburger');
    const drawer = document.querySelector('.nav-drawer');
    if (!nav) return;

    // Active link
    const links = nav.querySelectorAll('.nav-link');
    const current = location.pathname.split('/').pop() || 'index.html';
    links.forEach(l => {
      const href = l.getAttribute('href')?.split('/').pop();
      if (href === current) l.classList.add('active');
    });

    // Scroll
    const onScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive:true });
    onScroll();

    // Hamburger
    if (ham && drawer) {
      ham.addEventListener('click', () => {
        const open = ham.classList.toggle('open');
        drawer.classList.toggle('open', open);
        document.body.style.overflow = open ? 'hidden' : '';
      });
      drawer.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
          ham.classList.remove('open');
          drawer.classList.remove('open');
          document.body.style.overflow = '';
        });
      });
    }
  };

  if (document.querySelector('.nav')) {
    ready();
  } else {
    document.addEventListener('DOMContentLoaded', ready);
  }
})();

/* ── Scroll Reveal (IntersectionObserver) ───────────────── */
(function initReveal() {
  const targets = document.querySelectorAll('[data-reveal]');
  if (!targets.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('revealed');
        io.unobserve(e.target);
      }
    });
  }, { threshold: .12 });

  targets.forEach(t => io.observe(t));
})();

/* ── Animated Counters ──────────────────────────────────── */
function animateCounter(el, target, duration = 1800) {
  let start = null;
  const suffix = el.dataset.suffix || '';
  const step = (ts) => {
    if (!start) start = ts;
    const progress = Math.min((ts - start) / duration, 1);
    const val = Math.floor(easeOut(progress) * target);
    el.textContent = val + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
function easeOut(t) { return 1 - Math.pow(1-t, 3); }

(function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCounter(e.target, +e.target.dataset.counter, 1800);
        io.unobserve(e.target);
      }
    });
  }, { threshold: .5 });
  counters.forEach(c => io.observe(c));
})();

/* ── Hero Canvas : Particles + Radar Sweep ──────────────── */
function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // Radar blips (fixed angular positions)
  let blips = [];

  const buildBlips = () => {
    const cx = canvas.width * .7;
    const cy = canvas.height * .5;
    const maxR = Math.min(canvas.width, canvas.height) * .35;
    blips = Array.from({ length: 14 }, () => {
      const angle = Math.random() * Math.PI * 2;
      const r = maxR * (.12 + Math.random() * .82);
      return {
        x: cx + Math.cos(angle) * r,
        y: cy + Math.sin(angle) * r,
        angle: (angle + Math.PI * 2) % (Math.PI * 2),
        life: 0,
        maxLife: 55 + Math.random() * 55,
      };
    });
  };

  const resize = () => {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    buildBlips();
  };
  window.addEventListener('resize', resize);
  resize();

  // Particles
  const COLORS = ['rgba(30,127,166,.7)', 'rgba(212,168,67,.6)', 'rgba(255,255,255,.5)', 'rgba(45,168,216,.5)'];
  const count = Math.min(Math.floor(canvas.offsetWidth / 8), 110);
  const particles = Array.from({ length: count }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.5 + .3,
    vx: (Math.random() - .5) * .3,
    vy: (Math.random() - .5) * .25 - .05,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    opacity: Math.random() * .7 + .3,
    pulse: Math.random() * Math.PI * 2,
  }));

  let radarAngle = 0;

  const drawRadar = () => {
    const cx = canvas.width * .7;
    const cy = canvas.height * .5;
    const maxR = Math.min(canvas.width, canvas.height) * .35;

    // Concentric rings
    for (let i = 1; i <= 4; i++) {
      ctx.beginPath();
      ctx.arc(cx, cy, (maxR / 4) * i, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(30,127,166,${.025 + i * .008})`;
      ctx.lineWidth = .8;
      ctx.stroke();
    }

    // Crosshairs + diagonals
    [[1,0],[0,1],[.707,.707],[.707,-.707]].forEach(([dx,dy]) => {
      ctx.beginPath();
      ctx.moveTo(cx - dx * maxR, cy - dy * maxR);
      ctx.lineTo(cx + dx * maxR, cy + dy * maxR);
      ctx.strokeStyle = 'rgba(30,127,166,.025)';
      ctx.lineWidth = .5;
      ctx.stroke();
    });

    // Sweep trail (gradient sector)
    const sweepSpan = Math.PI * .5;
    const steps = 22;
    for (let i = 0; i < steps; i++) {
      const t = i / steps;
      const a0 = radarAngle - sweepSpan * (1 - t);
      const a1 = radarAngle - sweepSpan * (1 - (t + 1 / steps));
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, maxR, a0, a1);
      ctx.closePath();
      ctx.fillStyle = `rgba(30,127,166,${t * .07})`;
      ctx.fill();
    }

    // Leading edge line
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(radarAngle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(maxR, 0);
    ctx.strokeStyle = 'rgba(30,127,166,.55)';
    ctx.lineWidth = 1.3;
    ctx.stroke();
    ctx.restore();

    // Center dot
    ctx.beginPath();
    ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(30,127,166,.75)';
    ctx.fill();

    // Blips
    blips.forEach(b => {
      const diff = (radarAngle - b.angle + Math.PI * 2) % (Math.PI * 2);
      if (diff < .35 && diff > 0) b.life = b.maxLife;
      if (b.life > 0) {
        const alpha = (b.life / b.maxLife) * .95;
        const r = 3 * (b.life / b.maxLife);
        ctx.beginPath();
        ctx.arc(b.x, b.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(30,127,166,${alpha})`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(b.x, b.y, r * 2.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(30,127,166,${alpha * .28})`;
        ctx.fill();
        b.life--;
      }
    });

    radarAngle += .012;
    if (radarAngle >= Math.PI * 2) radarAngle -= Math.PI * 2;
  };

  let frame;
  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawRadar();

    // Particles
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      p.pulse += .012;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width)  p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;
      const op = p.opacity * (.7 + .3 * Math.sin(p.pulse));
      ctx.globalAlpha = op;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * (1 + .15 * Math.sin(p.pulse)), 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
    });

    // Connection lines
    ctx.globalAlpha = .04;
    ctx.strokeStyle = 'rgba(30,127,166,1)';
    ctx.lineWidth = .5;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 90) {
          ctx.globalAlpha = .04 * (1 - dist / 90);
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;
    frame = requestAnimationFrame(draw);
  };
  draw();

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(frame);
    else draw();
  });
}
document.addEventListener('DOMContentLoaded', initHeroCanvas);

/* ── Parallax Hero ──────────────────────────────────────── */
(function initParallax() {
  const hero    = document.querySelector('.hero');
  const monitor = document.querySelector('.hero-monitor-wrap');
  if (!hero || !monitor) return;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    monitor.style.transform = `translateY(${y * .12}px)`;
  }, { passive: true });
})();

/* ── Typing Effect ──────────────────────────────────────── */
function initTyping(el, words, speed = 80) {
  if (!el) return;
  let wi = 0, ci = 0, del = false;
  const type = () => {
    const word = words[wi];
    if (!del) {
      el.textContent = word.substring(0, ci + 1);
      ci++;
      if (ci === word.length) { del = true; setTimeout(type, 1800); return; }
    } else {
      el.textContent = word.substring(0, ci - 1);
      ci--;
      if (ci === 0) { del = false; wi = (wi+1) % words.length; }
    }
    setTimeout(type, del ? speed/2 : speed);
  };
  type();
}
document.addEventListener('DOMContentLoaded', () => {
  const el = document.querySelector('[data-typing]');
  if (el) {
    const words = JSON.parse(el.dataset.typing);
    initTyping(el, words);
  }
});

/* ── Card 3D Tilt ───────────────────────────────────────── */
(function initTilt() {
  if (window.matchMedia('(hover:none)').matches) return;
  document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - .5;
      const y = (e.clientY - r.top)  / r.height - .5;
      card.style.transform = `perspective(600px) rotateY(${x*8}deg) rotateX(${-y*8}deg) translateZ(6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(600px) rotateY(0) rotateX(0) translateZ(0)';
    });
  });
})();

/* ── Button Ripple ──────────────────────────────────────── */
document.addEventListener('click', e => {
  const btn = e.target.closest('.btn');
  if (!btn) return;
  const r = btn.getBoundingClientRect();
  const size = Math.max(r.width, r.height) * 2;
  const ripple = document.createElement('span');
  ripple.className = 'ripple';
  ripple.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX-r.left-size/2}px;top:${e.clientY-r.top-size/2}px`;
  btn.appendChild(ripple);
  ripple.addEventListener('animationend', () => ripple.remove());
});

/* ── Active nav drawer links ────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const drawerLinks = document.querySelectorAll('.nav-drawer .nav-link');
  const current = location.pathname.split('/').pop() || 'index.html';
  drawerLinks.forEach(l => {
    const href = l.getAttribute('href')?.split('/').pop();
    if (href === current) l.classList.add('active');
  });
});

/* ── Smooth scroll for anchor links ─────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});
