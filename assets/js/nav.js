document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
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

    var show = function (index) {
      heroImages[current].classList.remove('is-active');
      if (dots[current]) dots[current].classList.remove('is-active');
      current = (index + heroImages.length) % heroImages.length;
      heroImages[current].classList.add('is-active');
      if (dots[current]) dots[current].classList.add('is-active');
      if (captionEl) {
        captionEl.classList.remove('is-active');
        setTimeout(function () {
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

    startCycle();
  }
  var revealTargets = [].slice.call(document.querySelectorAll('.section, .deal-card')).filter(function (el) {
    return !el.closest('#deal-details');
  });
  var headingTargets = [].slice.call(document.querySelectorAll(
    'h1, h2, .section-title, .property-hero-title, .hero-sub, .property-hero-loc, .property-back'
  )).filter(function (el) {
    return !el.closest('#deal-details');
  });

  if (!reduceMotion && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    revealTargets.forEach(function (el) {
      el.classList.add('reveal');
      observer.observe(el);
    });
    headingTargets.forEach(function (el) {
      var isHeading = el.tagName === 'H1' || el.tagName === 'H2' || el.classList.contains('section-title') || el.classList.contains('property-hero-title');
      el.classList.add(isHeading ? 'reveal-heading' : 'reveal');
      observer.observe(el);
    });
  }
});
