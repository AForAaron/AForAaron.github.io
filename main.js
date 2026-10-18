(function () {
  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.getElementById('yr').textContent = new Date().getFullYear();

  /* theme toggle */
  document.getElementById('theme').addEventListener('click', function () {
    var next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) {}
  });

  /* reveal on scroll (+ staggered) */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      e.target.querySelectorAll('[data-count]').forEach(countUp);
      if (e.target.matches('[data-count]')) countUp(e.target);
      io.unobserve(e.target);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(function (el) {
    var sib = Array.prototype.indexOf.call(el.parentNode.children, el);
    el.style.transitionDelay = Math.min(sib, 6) * 70 + 'ms';
    io.observe(el);
  });
  document.querySelectorAll('.project').forEach(function (p) {
    new IntersectionObserver(function (es, o) {
      if (es[0].isIntersecting) { p.classList.add('in'); o.disconnect(); }
    }, { threshold: 0.3 }).observe(p);
  });

  /* count-up numbers */
  function countUp(el) {
    if (el.dataset.done) return;
    el.dataset.done = 1;
    var end = parseFloat(el.dataset.count), dec = +el.dataset.dec, t0 = null, dur = 1400;
    if (reduce) { el.textContent = end.toFixed(dec); return; }
    function step(t) {
      if (!t0) t0 = t;
      var k = Math.min((t - t0) / dur, 1), e = 1 - Math.pow(1 - k, 3);
      el.textContent = (end * e).toFixed(dec);
      if (k < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* typewriter */
  var words = ['Deep Learning', 'Computer Vision', 'Trustworthy Multimodal AI', 'Source Bias in Recommenders'];
  var typed = document.getElementById('typed');
  if (!reduce) {
    var wi = 0, ci = words[0].length, del = true;
    (function tick() {
      var w = words[wi];
      ci += del ? -1 : 1;
      typed.textContent = w.slice(0, ci);
      var wait = del ? 35 : 70;
      if (!del && ci === w.length) { del = true; wait = 1800; }
      else if (del && ci === 0) { del = false; wi = (wi + 1) % words.length; wait = 300; }
      setTimeout(tick, wait);
    })();
  }

  /* spotlight follows cursor */
  document.querySelectorAll('.spot').forEach(function (el) {
    el.addEventListener('pointermove', function (e) {
      var r = el.getBoundingClientRect();
      el.style.setProperty('--mx', e.clientX - r.left + 'px');
      el.style.setProperty('--my', e.clientY - r.top + 'px');
    });
  });

  /* active dock item */
  var links = {};
  document.querySelectorAll('.dock a[href^="#"]').forEach(function (a) { links[a.getAttribute('href').slice(1)] = a; });
  var so = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting || !links[e.target.id]) return;
      Object.keys(links).forEach(function (k) { links[k].classList.toggle('active', k === e.target.id); });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  Object.keys(links).forEach(function (id) { var s = document.getElementById(id); if (s) so.observe(s); });

  /* neural-network canvas in the hero */
  var cv = document.getElementById('net');
  var ctx = cv.getContext('2d');
  var W, H, dpr, nodes = [], mouse = { x: -1e4, y: -1e4 }, running = true;

  function size() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = cv.clientWidth; H = cv.clientHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var n = Math.round(Math.min(90, W * H / 14000));
    nodes = [];
    for (var i = 0; i < n; i++) {
      nodes.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35, r: Math.random() * 1.6 + .6, p: Math.random() * 6.28 });
    }
  }
  function rgb() { return getComputedStyle(root).getPropertyValue('--net').trim(); }

  function frame() {
    if (!running) return;
    var c = rgb(), link = 130;
    ctx.clearRect(0, 0, W, H);
    for (var i = 0; i < nodes.length; i++) {
      var a = nodes[i];
      a.x += a.vx; a.y += a.vy; a.p += .03;
      if (a.x < 0 || a.x > W) a.vx *= -1;
      if (a.y < 0 || a.y > H) a.vy *= -1;
      var dx = a.x - mouse.x, dy = a.y - mouse.y, dm = Math.hypot(dx, dy);
      if (dm < 140) { a.x += dx / dm * .8; a.y += dy / dm * .8; }
      for (var j = i + 1; j < nodes.length; j++) {
        var b = nodes[j], d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < link) {
          ctx.strokeStyle = 'rgba(' + c + ',' + (1 - d / link) * .28 + ')';
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
      ctx.fillStyle = 'rgba(' + c + ',' + (.55 + Math.sin(a.p) * .3) + ')';
      ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, 6.283); ctx.fill();
    }
    requestAnimationFrame(frame);
  }

  size();
  window.addEventListener('resize', size);
  cv.parentElement.addEventListener('pointermove', function (e) {
    var r = cv.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
  });
  cv.parentElement.addEventListener('pointerleave', function () { mouse.x = mouse.y = -1e4; });

  if (reduce) { running = true; frame(); running = false; }
  else {
    new IntersectionObserver(function (es) {
      var vis = es[0].isIntersecting;
      if (vis && !running) { running = true; frame(); } else if (!vis) running = false;
    }).observe(cv);
    frame();
  }
})();
