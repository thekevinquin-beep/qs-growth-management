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

  var overlay = document.getElementById('deal-modal-overlay');
  var trackCards = document.querySelectorAll('.track-card');
  if (overlay && trackCards.length) {
    var modalBody = document.getElementById('deal-modal-body');
    var closeBtn = document.getElementById('deal-modal-close');
    var lastFocused = null;

    var openModal = function (dealKey) {
      var source = document.querySelector('#deal-details .deal-card[data-deal="' + dealKey + '"]');
      if (!source) return;
      modalBody.innerHTML = source.outerHTML;
      lastFocused = document.activeElement;
      overlay.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      closeBtn.focus();
    };

    var closeModal = function () {
      overlay.classList.remove('is-open');
      document.body.style.overflow = '';
      if (lastFocused) lastFocused.focus();
    };

    trackCards.forEach(function (card) {
      card.addEventListener('click', function () {
        openModal(card.dataset.deal);
      });
    });

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('is-open')) closeModal();
    });
  }

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
