const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Mobile hamburger nav
  (function mobileNav(){
    const toggle = document.getElementById('navToggle');
    const links = document.getElementById('navlinks');
    if (!toggle || !links) return;
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        links.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  })();


  // Name-reveal preloader
  (function runPreloader(){
    const pre = document.getElementById('preloader');
    if (!pre) return;

    if (reduceMotion){
      pre.classList.add('hide');
      setTimeout(() => { pre.remove(); document.body.classList.add('loaded'); }, 50);
      return;
    }

    const nameEl = document.getElementById('preloaderName');
    const subEl = document.getElementById('preloaderSub');
    const barFill = document.getElementById('preloaderBarFill');
    const fullName = 'Abhishek Bhardwaj';
    const STEP = 45; // ms between each letter's animation start

    fullName.split('').forEach((ch, i) => {
      const span = document.createElement('span');
      if (ch === ' '){
        span.className = 'pl-space';
      } else {
        span.className = 'pl-letter';
        span.textContent = ch;
        span.style.animationDelay = (i * STEP) + 'ms';
      }
      nameEl.appendChild(span);
    });

    const lettersDone = fullName.length * STEP + 650; // last letter delay + its animation duration

    setTimeout(() => { barFill.style.width = '100%'; }, 150);
    setTimeout(() => { subEl.classList.add('show'); }, lettersDone - 200);
    setTimeout(() => {
      pre.classList.add('hide');
      setTimeout(() => {
        pre.remove();
        document.body.classList.add('loaded');
      }, 700);
    }, lettersDone + 500);
  })();

  // Mouse-follow spotlight
  const spot = document.getElementById('spotlight');
  window.addEventListener('mousemove', (e) => {
    spot.style.setProperty('--mx', e.clientX + 'px');
    spot.style.setProperty('--my', e.clientY + 'px');
  });

  // Scroll reveal (also toggles section-title underline draw-in)
  // Live-link click animation: ripple burst + pop
  document.querySelectorAll('.proj-links a.live').forEach(link => {
    link.addEventListener('click', function(e){
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height) * 1.4;
      ripple.className = 'ripple';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      this.appendChild(ripple);
      this.classList.add('clicked');
      setTimeout(() => ripple.remove(), 600);
      setTimeout(() => this.classList.remove('clicked'), 450);
    });
  });

  const revealEls = document.querySelectorAll('.reveal, .reveal-stagger');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => io.observe(el));

  // Animated skill bars — trigger fill when visible
  const bars = document.querySelectorAll('.bar-fill');
  const barIo = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        requestAnimationFrame(() => { el.style.width = el.style.getPropertyValue('--target'); });
        barIo.unobserve(el);
      }
    });
  }, { threshold: 0.3 });
  bars.forEach(b => barIo.observe(b));

  // Count-up stats
  const counters = document.querySelectorAll('.stat-num[data-count]');
  const countIo = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        let cur = 0;
        const step = Math.max(1, Math.round(target / 40));
        const tick = () => {
          cur = Math.min(target, cur + step);
          el.textContent = cur;
          if (cur < target) requestAnimationFrame(tick);
        };
        tick();
        countIo.unobserve(el);
      }
    });
  }, { threshold: 0.4 });
  counters.forEach(c => countIo.observe(c));

  // Typewriter effect cycling through role/stack lines
  const typeEl = document.getElementById('typeTarget');
  const typeStrings = ['React JS · Node.js · Java', 'PHP · MySQL · JavaScript', 'HTML/CSS · GitHub · Linux'];
  if (typeEl && !reduceMotion) {
    let s = 0, c = 0, deleting = false;
    const TYPE_SPEED = 55, DELETE_SPEED = 30, HOLD = 1600;
    function typeTick(){
      const str = typeStrings[s];
      if (!deleting){
        c++;
        typeEl.textContent = str.slice(0, c);
        if (c === str.length){ deleting = true; setTimeout(typeTick, HOLD); return; }
        setTimeout(typeTick, TYPE_SPEED);
      } else {
        c--;
        typeEl.textContent = str.slice(0, c);
        if (c === 0){ deleting = false; s = (s+1) % typeStrings.length; setTimeout(typeTick, 300); return; }
        setTimeout(typeTick, DELETE_SPEED);
      }
    }
    typeTick();
  } else if (typeEl) {
    typeEl.textContent = typeStrings[0];
  }

  // Scrollspy nav with sliding indicator
  const navLinks = Array.from(document.querySelectorAll('[data-nav]'));
  const navIndicator = document.getElementById('navIndicator');
  const navContainer = document.getElementById('navlinks');
  const sections = navLinks.map(a => document.querySelector(a.getAttribute('href')));
  function moveIndicator(link){
    if (!link || !navContainer) return;
    const cRect = navContainer.getBoundingClientRect();
    const lRect = link.getBoundingClientRect();
    navIndicator.style.left = (lRect.left - cRect.left) + 'px';
    navIndicator.style.width = lRect.width + 'px';
    navIndicator.style.opacity = '1';
  }
  const sectionIo = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        const idx = sections.indexOf(entry.target);
        navLinks.forEach(l => l.classList.remove('active'));
        if (idx > -1){
          navLinks[idx].classList.add('active');
          moveIndicator(navLinks[idx]);
        }
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
  sections.forEach(s => { if (s) sectionIo.observe(s); });
  if (!reduceMotion){
    document.querySelectorAll('.magnetic').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width/2;
        const y = e.clientY - r.top - r.height/2;
        btn.style.transform = `translate(${x*0.18}px, ${y*0.3}px)`;
      });
      btn.addEventListener('mouseleave', () => { btn.style.transform = 'translate(0,0)'; });
    });
  }

  
  if (!reduceMotion){
    document.querySelectorAll('.proj-card.tilt').forEach(card => {
      const inner = card.querySelector('.proj-inner');
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        inner.style.transform = `rotateY(${px*8}deg) rotateX(${-py*8}deg) translateZ(6px)`;
      });
      card.addEventListener('mouseleave', () => { inner.style.transform = 'rotateY(0) rotateX(0) translateZ(0)'; });
    });
  }

  
  const progress = document.getElementById('scrollProgress');
  const mesh = document.getElementById('mesh');
  const gridOverlay = document.getElementById('gridOverlay');
  function onScroll(){
    const h = document.documentElement;
    const scrolled = h.scrollTop;
    const max = h.scrollHeight - h.clientHeight;
    progress.style.width = (max > 0 ? (scrolled/max)*100 : 0) + '%';
    if (!reduceMotion){
      mesh.style.transform = `translateY(${scrolled * 0.06}px)`;
      gridOverlay.style.transform = `translateY(${scrolled * 0.03}px)`;
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  document.querySelectorAll('.code-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      document.querySelectorAll('.code-tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.code-pane').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.querySelector(`.code-pane[data-pane="${target}"]`).classList.add('active');
    });
  });

  // Contribution heatmap — generate a deterministic-looking activity grid
  const heatmap = document.getElementById('heatmap');
  if (heatmap){
    let seed = 42;
    const rand = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
    const totalCells = 26 * 7;
    for (let i = 0; i < totalCells; i++){
      const r = rand();
      let level = 0;
      if (r > 0.93) level = 4;
      else if (r > 0.8) level = 3;
      else if (r > 0.6) level = 2;
      else if (r > 0.35) level = 1;
      const cell = document.createElement('div');
      cell.className = `hm-cell hm-${level}`;
      cell.style.transitionDelay = (i * 6) + 'ms';
      heatmap.appendChild(cell);
    }
    const heatIo = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          heatmap.classList.add('in');
          heatIo.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    heatIo.observe(heatmap);
  }