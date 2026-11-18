// Chacha Restaurant — mobile menu, scroll-spy nav, reveal, lightbox, FAQ
(function () {
  'use strict';

  // --- Mobile menu: instant toggle, no transition ---
  var toggle = document.querySelector('[data-menu-toggle]');
  var menu = document.querySelector('[data-mobile-menu]');
  if (toggle && menu) {
    var setMenu = function (open) {
      menu.hidden = !open;
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    };
    toggle.addEventListener('click', function () {
      setMenu(menu.hidden);
    });
    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () { setMenu(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !menu.hidden) setMenu(false);
    });
  }

  // --- Scroll-spy: highlight current section in desktop nav ---
  var navLinks = document.querySelectorAll('.site-nav a');
  var byId = {};
  navLinks.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });
  var sections = Object.keys(byId).map(function (id) { return document.getElementById(id); }).filter(Boolean);
  if ('IntersectionObserver' in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) { a.classList.remove('active'); });
        var link = byId[entry.target.id];
        if (link) link.classList.add('active');
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }

  // --- Reveal on scroll (respects reduced motion via CSS) ---
  var revealEls = document.querySelectorAll('.section, .hero-content, .trustbar');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    revealEls.forEach(function (el) { el.classList.add('reveal'); });
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('visible'); ro.unobserve(entry.target); }
      });
    }, { threshold: 0.08 });
    revealEls.forEach(function (el) { ro.observe(el); });
  }

  // --- Lightbox ---
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lastFocus = null;
  function openLightbox(src, alt) {
    lastFocus = document.activeElement;
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    var closeBtn = lightbox.querySelector('[data-lightbox-close]');
    if (closeBtn) closeBtn.focus();
  }
  function closeLightbox() {
    lightbox.hidden = true;
    lightboxImg.src = '';
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  document.querySelectorAll('.gallery-item').forEach(function (item) {
    item.addEventListener('click', function () {
      openLightbox(item.getAttribute('data-full'), item.getAttribute('data-alt'));
    });
  });
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox || e.target.hasAttribute('data-lightbox-close')) closeLightbox();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !lightbox.hidden) closeLightbox();
  });
})();
