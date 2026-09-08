document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    var setMenu = function (open) {
      links.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    };
    toggle.addEventListener('click', function () {
      setMenu(!links.classList.contains('open'));
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && links.classList.contains('open')) {
        setMenu(false);
        toggle.focus();
      }
    });
    // Widening past the mobile breakpoint reveals the links again; don't leave
    // the toggle claiming an expanded menu that no longer exists.
    window.addEventListener('resize', function () {
      if (window.innerWidth > 720) setMenu(false);
    });
  }

  var nav = document.querySelector('.site-nav');
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var heroImages = document.querySelectorAll('.hero-media img');
  if (heroImages.length > 1) {
    var captionEl = document.querySelector('.hero-caption-text');
    var dots = document.querySelectorAll('.hero-dot');
    var current = 0;
    var timer = null;
    var captionTimer = null;

    var show = function (index) {
      heroImages[current].classList.remove('is-active');
      if (dots[current]) dots[current].classList.remove('is-active');
      current = (index + heroImages.length) % heroImages.length;
      heroImages[current].classList.add('is-active');
      if (dots[current]) dots[current].classList.add('is-active');
      if (captionEl) {
        // Drop any pending swap so rapid dot clicks can't restore a stale caption.
        clearTimeout(captionTimer);
        captionEl.classList.remove('is-active');
        captionTimer = setTimeout(function () {
          captionEl.textContent = heroImages[current].dataset.caption || '';
          captionEl.classList.add('is-active');
        }, 180);
      }
    };

    var startCycle = function () {
      if (reduceMotion) return;
      timer = setInterval(function () { show(current + 1); }, 3500);
    };
    var stopCycle = function () {
      if (timer) { clearInterval(timer); timer = null; }
    };

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        stopCycle();
        show(parseInt(dot.dataset.index, 10));
        startCycle();
      });
    });

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        stopCycle();
      } else {
        if (captionEl) captionEl.classList.add('is-active');
        startCycle();
      }
    });

    startCycle();
  }
  var revealTargets = [].slice.call(document.querySelectorAll(
    '.section, .band-inner, .about-intro, .stagger > *, .num-list li, .timeline li, .fieldnote'
  ));
  var headingTargets = [].slice.call(document.querySelectorAll(
    'h2, .section-title'
  )).filter(function (el) {
    return !el.closest('header') && !el.closest('.property-hero') && !el.closest('.contact-stage');
  });

  if (!reduceMotion && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });

    revealTargets.forEach(function (el) {
      el.classList.add('reveal');
      observer.observe(el);
    });
    headingTargets.forEach(function (el) {
      el.classList.add('reveal-heading');
      observer.observe(el);
    });
  }

  var countTargets = [].slice.call(document.querySelectorAll(
    '.deal-cell-val, .proof-num, .market-stat-num, .track-card-row dd, .data-table td.num'
  )).filter(function (el) {
    if (el.getAttribute('data-count') === 'false') return false;
    var text = el.textContent.trim();
    // Skip anything that isn't a plain number or currency figure (dates, ranges, labels).
    return /^\$?~?[\d,]+(?:\.\d+)?[KM%]?$/.test(text.replace(/^~/, ''));
  });

  if (countTargets.length) {
    var animateCount = function (el) {
      var raw = el.textContent.trim();
      var match = raw.match(/^([^\d]*)([\d,]+(?:\.\d+)?)(.*)$/);
      if (!match) return;
      var prefix = match[1];
      var numStr = match[2].replace(/,/g, '');
      var suffix = match[3];
      var target = parseFloat(numStr);
      if (isNaN(target)) return;
      var hasCommas = match[2].indexOf(',') !== -1;
      var decimals = (numStr.split('.')[1] || '').length;

      if (reduceMotion) return;

      var duration = 1700;
      var startTime = null;
      var format = function (val) {
        var str = val.toFixed(decimals);
        if (hasCommas) {
          var parts = str.split('.');
          parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          str = parts.join('.');
        }
        return prefix + str + suffix;
      };

      el.textContent = format(0);
      var step = function (ts) {
        if (!startTime) startTime = ts;
        var progress = Math.min((ts - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = format(target * eased);
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = raw;
        }
      };
      requestAnimationFrame(step);
    };

    if ('IntersectionObserver' in window) {
      var countObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            countObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });
      countTargets.forEach(function (el) { countObserver.observe(el); });
    }
  }
});
