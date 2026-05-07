/* ── Studio Print — Awwwards-level motion layer ─────────────────────────
 * Deliberately NOT obfuscated (see build.js comment on sliders.js).
 * Requires: GSAP 3 + ScrollTrigger + Lenis (loaded via CDN before this).
 * Only runs on body.home pages. Gracefully degrades when GSAP / Lenis
 * are unavailable. Full prefers-reduced-motion gate at the top.
 * ─────────────────────────────────────────────────────────────────────── */
(function () {
  'use strict';

  /* ── 0. Guard: homepage only + reduced-motion check ── */
  var isHome = document.body.classList.contains('home');
  var reducedMotion = false;
  try {
    reducedMotion = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (_) {}

  /* ── 1. Lenis smooth scroll ── */
  function initLenis() {
    if (typeof Lenis === 'undefined') return;
    var lenis = new Lenis({
      duration: 1.25,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      smoothTouch: false,
      touchMultiplier: 1.8
    });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    /* Sync Lenis with GSAP ScrollTrigger if both are available */
    if (typeof gsap !== 'undefined' && gsap.ticker) {
      lenis.on('scroll', function () {
        if (window.ScrollTrigger) ScrollTrigger.update();
      });
      gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    }
    window._spLenis = lenis;
  }

  /* ── 2. Custom cursor (desktop only) ── */
  function initCursor() {
    if (window.matchMedia('(pointer: coarse)').matches) return; /* touch devices */
    var cursor = document.getElementById('sp-cursor');
    if (!cursor) return;
    var dot = cursor.querySelector('.sp-cursor-dot');
    var mx = 0, my = 0, cx = 0, cy = 0;
    var frame;

    document.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
    }, { passive: true });

    document.addEventListener('mouseenter', function () {
      cursor.style.opacity = '1';
    });
    document.addEventListener('mouseleave', function () {
      cursor.style.opacity = '0';
    });

    function lerp(a, b, t) { return a + (b - a) * t; }
    function loop() {
      cx = lerp(cx, mx, 0.13);
      cy = lerp(cy, my, 0.13);
      cursor.style.transform = 'translate(' + (cx - 20) + 'px,' + (cy - 20) + 'px)';
      if (dot) dot.style.transform = 'translate(' + (mx - 3) + 'px,' + (my - 3) + 'px)';
      frame = requestAnimationFrame(loop);
    }
    loop();

    /* Expand cursor on interactive elements */
    var targets = document.querySelectorAll('a, button, .feature-card.live, .why-card, .plan-card, .faq-item summary, input, textarea');
    targets.forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        cursor.classList.add('sp-cursor--hover');
      });
      el.addEventListener('mouseleave', function () {
        cursor.classList.remove('sp-cursor--hover');
      });
    });

    /* Click pulse */
    document.addEventListener('mousedown', function () {
      cursor.classList.add('sp-cursor--click');
    });
    document.addEventListener('mouseup', function () {
      cursor.classList.remove('sp-cursor--click');
    });
  }

  /* ── 3. Magnetic button effect ── */
  function initMagnetic() {
    var btns = document.querySelectorAll('.btn-primary, .btn-ghost');
    btns.forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var r = btn.getBoundingClientRect();
        var x = e.clientX - r.left - r.width / 2;
        var y = e.clientY - r.top - r.height / 2;
        btn.style.transform = 'translate(' + x * 0.18 + 'px,' + y * 0.28 + 'px)';
      });
      btn.addEventListener('mouseleave', function () {
        btn.style.transform = '';
        btn.style.transition = 'transform .5s cubic-bezier(.23,1,.32,1)';
        setTimeout(function () { btn.style.transition = ''; }, 500);
      });
    });
  }

  /* ── 4. GSAP animations (hero + scroll-triggered) ── */
  function initGSAP() {
    if (typeof gsap === 'undefined') return;
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    /* ── 4a. Hero entrance timeline ── */
    var heroInner = document.querySelector('.hero-inner');
    if (heroInner) {
      var eyebrow = heroInner.querySelector('.hero-eyebrow');
      var h1 = heroInner.querySelector('h1');
      var lead = heroInner.querySelector('.lead');
      var actions = heroInner.querySelector('.hero-actions');
      var trust = heroInner.querySelectorAll('.hero-trust');

      /* Split h1 text into word spans for stagger */
      if (h1) {
        var rawHTML = h1.innerHTML;
        /* Preserve <em> tags while splitting words */
        var tempDiv = document.createElement('div');
        tempDiv.innerHTML = rawHTML;
        var nodes = Array.from(tempDiv.childNodes);
        var wrappedHTML = '';
        nodes.forEach(function (node) {
          if (node.nodeType === 3) { /* text node */
            var words = node.textContent.split(/(\s+)/);
            words.forEach(function (w) {
              if (w.trim()) {
                wrappedHTML += '<span class="sp-word" style="display:inline-block;overflow:hidden"><span class="sp-word-inner" style="display:inline-block">' + w + '</span></span>';
              } else if (w) {
                wrappedHTML += w;
              }
            });
          } else if (node.nodeType === 1) { /* element node like <em> */
            wrappedHTML += '<span class="sp-word" style="display:inline-block;overflow:hidden"><span class="sp-word-inner" style="display:inline-block">' + node.outerHTML + '</span></span>';
          }
        });
        h1.innerHTML = wrappedHTML;
      }

      var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      if (eyebrow) {
        tl.fromTo(eyebrow,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.7 }
        );
      }

      if (h1) {
        var wordInners = h1.querySelectorAll('.sp-word-inner');
        tl.fromTo(wordInners,
          { y: '110%' },
          { y: '0%', duration: 0.85, stagger: 0.055 },
          eyebrow ? '-=0.35' : '0'
        );
      }

      if (lead) {
        tl.fromTo(lead,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7 },
          '-=0.5'
        );
      }

      if (actions) {
        var actionBtns = actions.querySelectorAll('.btn');
        tl.fromTo(actionBtns,
          { opacity: 0, y: 18, scale: 0.96 },
          { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1 },
          '-=0.45'
        );
      }

      if (trust.length) {
        tl.fromTo(trust,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.55, stagger: 0.1 },
          '-=0.4'
        );
      }
    }

    /* Hero preview panel */
    var heroPreview = document.querySelector('.hero-preview');
    if (heroPreview) {
      gsap.fromTo(heroPreview,
        { opacity: 0, y: 30, scale: 0.97 },
        {
          opacity: 1, y: 0, scale: 1, duration: 1.1, ease: 'power3.out',
          delay: 0.4
        }
      );
    }

    /* ── 4b. Scroll-triggered section reveals ── */
    if (typeof ScrollTrigger === 'undefined') return;

    /* Section headers */
    var sectionHeads = document.querySelectorAll('.section-head');
    sectionHeads.forEach(function (head) {
      var tag = head.querySelector('.section-tag');
      var h2 = head.querySelector('h2');
      var p = head.querySelector('p');
      var els = [tag, h2, p].filter(Boolean);
      gsap.fromTo(els,
        { opacity: 0, y: 28 },
        {
          opacity: 1, y: 0, duration: 0.75, stagger: 0.12, ease: 'power2.out',
          scrollTrigger: {
            trigger: head,
            start: 'top 86%',
            once: true
          }
        }
      );
    });

    /* Feature cards */
    var featureCards = document.querySelectorAll('.feature-card');
    if (featureCards.length) {
      gsap.fromTo(featureCards,
        { opacity: 0, y: 40, scale: 0.97 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 0.7, stagger: { amount: 0.5, from: 'start' }, ease: 'power2.out',
          scrollTrigger: {
            trigger: featureCards[0].closest('section') || featureCards[0].parentElement,
            start: 'top 80%',
            once: true
          }
        }
      );
    }

    /* Why cards */
    var whyCards = document.querySelectorAll('.why-card');
    if (whyCards.length) {
      gsap.fromTo(whyCards,
        { opacity: 0, y: 36 },
        {
          opacity: 1, y: 0,
          duration: 0.65, stagger: { amount: 0.45, from: 'start' }, ease: 'power2.out',
          scrollTrigger: {
            trigger: whyCards[0].closest('section') || whyCards[0].parentElement,
            start: 'top 82%',
            once: true
          }
        }
      );
    }

    /* Step cards */
    var stepCards = document.querySelectorAll('.step-card');
    if (stepCards.length) {
      gsap.fromTo(stepCards,
        { opacity: 0, x: -28 },
        {
          opacity: 1, x: 0,
          duration: 0.7, stagger: { amount: 0.55 }, ease: 'back.out(1.3)',
          scrollTrigger: {
            trigger: stepCards[0].closest('section') || stepCards[0].parentElement,
            start: 'top 80%',
            once: true
          }
        }
      );
    }

    /* Audience cards */
    var audienceCards = document.querySelectorAll('.audience-card');
    if (audienceCards.length) {
      gsap.fromTo(audienceCards,
        { opacity: 0, y: 40, scale: 0.96 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 0.7, stagger: 0.18, ease: 'power2.out',
          scrollTrigger: {
            trigger: audienceCards[0].closest('section') || audienceCards[0].parentElement,
            start: 'top 80%',
            once: true
          }
        }
      );
    }

    /* Plan cards */
    var planCards = document.querySelectorAll('.plan-card');
    if (planCards.length) {
      gsap.fromTo(planCards,
        { opacity: 0, y: 44, scale: 0.95 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 0.75, stagger: 0.15, ease: 'back.out(1.2)',
          scrollTrigger: {
            trigger: planCards[0].closest('section') || planCards[0].parentElement,
            start: 'top 80%',
            once: true
          }
        }
      );
    }

    /* FAQ items */
    var faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length) {
      gsap.fromTo(faqItems,
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0,
          duration: 0.55, stagger: 0.08, ease: 'power2.out',
          scrollTrigger: {
            trigger: faqItems[0].closest('section') || faqItems[0].parentElement,
            start: 'top 82%',
            once: true
          }
        }
      );
    }

    /* CTA band */
    var ctaBand = document.querySelector('.cta-band');
    if (ctaBand) {
      gsap.fromTo(ctaBand,
        { opacity: 0, y: 36, scale: 0.98 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: ctaBand, start: 'top 84%', once: true }
        }
      );
    }

    /* ── 4c. Stat counter animation ── */
    var statNums = document.querySelectorAll('.stat-num');
    statNums.forEach(function (el) {
      var raw = el.textContent.trim();
      /* Extract numeric portion and suffix (e.g. "200+" → num=200, sfx="+") */
      var match = raw.match(/^([0-9,]+)(.*)$/);
      if (!match) return;
      var target = parseFloat(match[1].replace(/,/g, ''));
      var suffix = match[2] || '';
      var prefix = '';

      var obj = { val: 0 };
      gsap.fromTo(obj, { val: 0 }, {
        val: target,
        duration: 1.8,
        ease: 'power2.out',
        onUpdate: function () {
          el.textContent = prefix + Math.round(obj.val).toLocaleString('en-IN') + suffix;
        },
        scrollTrigger: {
          trigger: el,
          start: 'top 84%',
          once: true
        }
      });
    });

    /* ── 4d. Scroll progress bar ── */
    var bar = document.getElementById('sp-progress');
    if (bar) {
      gsap.to(bar, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.3
        }
      });
    }

    /* ── 4e. Parallax on hero bg shape (subtle) ── */
    var heroPanels = document.querySelectorAll('.hero-inner, .hero-preview');
    heroPanels.forEach(function (panel, i) {
      gsap.to(panel, {
        y: i === 0 ? -24 : -14,
        ease: 'none',
        scrollTrigger: {
          trigger: document.querySelector('.hero') || panel,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.4
        }
      });
    });
  }

  /* ── 5. Boot ── */
  function boot() {
    if (!isHome) return;

    if (!reducedMotion) {
      initLenis();
      initCursor();
      initMagnetic();
      initGSAP();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
