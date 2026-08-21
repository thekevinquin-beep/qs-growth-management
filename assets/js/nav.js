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
        }, 300);
      }
    };

    var startCycle = function () {
      if (reduceMotion) return;
      timer = setInterval(function () { show(current + 1); }, 6000);
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
  var revealTargets = document.querySelectorAll('.section, .deal-card');
  if (!reduceMotion && revealTargets.length && 'IntersectionObserver' in window) {
    revealTargets.forEach(function (el) { el.classList.add('reveal'); });
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    revealTargets.forEach(function (el) { observer.observe(el); });
  }
});
