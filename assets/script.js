/**
 * Otto Mahjong — script.js
 * Vanilla JS, no jQuery, IIFE module pattern
 */
(function () {
  'use strict';

  /* ============================================================
     UTILITIES
     ============================================================ */
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  function qs(selector, scope) {
    return (scope || document).querySelector(selector);
  }

  function qsa(selector, scope) {
    return Array.from((scope || document).querySelectorAll(selector));
  }

  function on(el, event, handler, options) {
    if (el) el.addEventListener(event, handler, options);
  }

  function debounce(fn, delay) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  /* ============================================================
     ANNOUNCEMENT BAR DISMISS
     ============================================================ */
  function initAnnouncementBar() {
    const bar = qs('.announcement-bar');
    if (!bar) return;

    const key = 'otto-announcement-dismissed';
    const msg = bar.dataset.message || 'default';

    if (localStorage.getItem(key) === msg) {
      bar.classList.add('is-hidden');
      return;
    }

    const closeBtn = qs('.announcement-bar__close', bar);
    on(closeBtn, 'click', function () {
      bar.classList.add('is-hidden');
      localStorage.setItem(key, msg);
    });
  }

  /* ============================================================
     SCROLL-TRIGGERED HEADER BACKGROUND
     ============================================================ */
  function initStickyHeader() {
    const header = qs('.site-header');
    if (!header) return;

    const threshold = 40;

    function update() {
      if (window.scrollY > threshold) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    }

    update();
    on(window, 'scroll', debounce(update, 10), { passive: true });
  }

  /* ============================================================
     MOBILE NAV HAMBURGER
     ============================================================ */
  function initMobileNav() {
    const hamburger = qs('.site-header__hamburger');
    const menu = qs('.mobile-menu');
    if (!hamburger || !menu) return;

    function openMenu() {
      hamburger.setAttribute('aria-expanded', 'true');
      menu.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      // Focus first focusable element in menu
      const firstLink = qs('a, button', menu);
      if (firstLink) firstLink.focus();
    }

    function closeMenu() {
      hamburger.setAttribute('aria-expanded', 'false');
      menu.classList.remove('is-open');
      document.body.style.overflow = '';
      hamburger.focus();
    }

    function toggleMenu() {
      const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    }

    on(hamburger, 'click', toggleMenu);

    // Close on Escape
    on(document, 'keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) {
        closeMenu();
      }
    });

    // Close when nav links are clicked
    qsa('.mobile-menu__link, .mobile-menu__sub-link', menu).forEach(function (link) {
      on(link, 'click', closeMenu);
    });
  }

  /* ============================================================
     SCROLL REVEAL (IntersectionObserver)
     ============================================================ */
  function initScrollReveal() {
    if (prefersReducedMotion) return;

    const revealEls = qsa('.reveal, .reveal-stagger');
    if (!revealEls.length) return;

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ============================================================
     FAQ ACCORDION
     ============================================================ */
  function initFaqAccordion() {
    const items = qsa('.faq__item');
    if (!items.length) return;

    function openItem(item) {
      const trigger = qs('.faq__trigger', item);
      const panel = qs('.faq__panel', item);
      if (!trigger || !panel) return;
      trigger.setAttribute('aria-expanded', 'true');
      panel.classList.add('is-open');
    }

    function closeItem(item) {
      const trigger = qs('.faq__trigger', item);
      const panel = qs('.faq__panel', item);
      if (!trigger || !panel) return;
      trigger.setAttribute('aria-expanded', 'false');
      panel.classList.remove('is-open');
    }

    function isOpen(item) {
      const trigger = qs('.faq__trigger', item);
      return trigger && trigger.getAttribute('aria-expanded') === 'true';
    }

    items.forEach(function (item, index) {
      const trigger = qs('.faq__trigger', item);
      if (!trigger) return;

      // Initialize aria attributes
      trigger.setAttribute('aria-expanded', 'false');
      trigger.setAttribute('aria-controls', trigger.dataset.controls || 'faq-panel-' + index);

      on(trigger, 'click', function () {
        if (isOpen(item)) {
          closeItem(item);
        } else {
          // Optionally close others (accordion mode)
          items.forEach(function (other) {
            if (other !== item) closeItem(other);
          });
          openItem(item);
        }
      });

      // Keyboard: arrow keys navigate between triggers
      on(trigger, 'keydown', function (e) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          const next = items[index + 1];
          if (next) qs('.faq__trigger', next).focus();
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          const prev = items[index - 1];
          if (prev) qs('.faq__trigger', prev).focus();
        }
        if (e.key === 'Home') {
          e.preventDefault();
          qs('.faq__trigger', items[0]).focus();
        }
        if (e.key === 'End') {
          e.preventDefault();
          qs('.faq__trigger', items[items.length - 1]).focus();
        }
      });
    });
  }

  /* ============================================================
     WAITLIST FORM
     ============================================================ */
  function initWaitlistForm() {
    const form = qs('.waitlist__form');
    if (!form) return;

    const messageEl = qs('.waitlist__message', form.closest('.waitlist') || document);
    const submitBtn = qs('[type="submit"]', form);

    function showMessage(text, type) {
      if (!messageEl) return;
      messageEl.textContent = text;
      messageEl.className = 'waitlist__message waitlist__message--' + type;
    }

    function setLoading(loading) {
      if (!submitBtn) return;
      submitBtn.disabled = loading;
      submitBtn.textContent = loading ? 'Submitting…' : (submitBtn.dataset.label || 'Join Waitlist');
    }

    on(form, 'submit', async function (e) {
      e.preventDefault();

      const emailInput = qs('[type="email"]', form);
      const email = emailInput ? emailInput.value.trim() : '';

      if (!email) {
        showMessage('Please enter a valid email address.', 'error');
        return;
      }

      setLoading(true);
      showMessage('', '');

      try {
        // Klaviyo / Shopify Customer endpoint or custom form handler
        const action = form.getAttribute('action') || '/contact#contact_form';
        const formData = new FormData(form);

        const response = await fetch(action, {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: formData,
        });

        if (response.ok) {
          showMessage(
            'You\'re on the list! We\'ll be in touch when Otto is ready.',
            'success'
          );
          form.reset();
        } else {
          throw new Error('Network response was not ok');
        }
      } catch (err) {
        showMessage(
          'Something went wrong. Please try again or email us directly.',
          'error'
        );
      } finally {
        setLoading(false);
      }
    });
  }

  /* ============================================================
     CART COUNT UPDATE (Shopify Ajax API)
     ============================================================ */
  function initCartCount() {
    const countEls = qsa('.site-header__cart-count');
    if (!countEls.length) return;

    function updateCount(count) {
      countEls.forEach(function (el) {
        el.textContent = count > 0 ? count : '';
      });
    }

    // Fetch initial cart state
    fetch('/cart.js')
      .then(function (r) { return r.json(); })
      .then(function (data) {
        updateCount(data.item_count);
      })
      .catch(function () {
        // Silently fail if cart endpoint unavailable
      });

    // Listen for cart updates dispatched by other scripts (e.g. add-to-cart)
    document.addEventListener('cart:updated', function (e) {
      if (e.detail && typeof e.detail.count === 'number') {
        updateCount(e.detail.count);
      }
    });
  }

  /* ============================================================
     ADD TO CART (Product Page)
     ============================================================ */
  function initAddToCart() {
    const atcForms = qsa('[data-atc-form]');
    if (!atcForms.length) return;

    atcForms.forEach(function (form) {
      const btn = qs('[data-atc-btn]', form);
      const originalLabel = btn ? btn.textContent : 'Add to Cart';

      on(form, 'submit', async function (e) {
        e.preventDefault();

        if (!btn) return;
        btn.disabled = true;
        btn.textContent = 'Adding…';

        const formData = new FormData(form);
        const body = {};
        formData.forEach(function (value, key) {
          body[key] = value;
        });

        try {
          const response = await fetch('/cart/add.js', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
            body: JSON.stringify(body),
          });

          if (!response.ok) throw new Error('Add to cart failed');

          const cartResponse = await fetch('/cart.js');
          const cart = await cartResponse.json();

          // Update cart count
          document.dispatchEvent(
            new CustomEvent('cart:updated', { detail: { count: cart.item_count } })
          );

          btn.textContent = 'Added!';
          setTimeout(function () {
            btn.textContent = originalLabel;
            btn.disabled = false;
          }, 2000);
        } catch (err) {
          btn.textContent = 'Error — try again';
          setTimeout(function () {
            btn.textContent = originalLabel;
            btn.disabled = false;
          }, 2500);
        }
      });
    });
  }

  /* ============================================================
     VARIANT SELECTOR (Product Page)
     ============================================================ */
  function initVariantSelector() {
    const selectorGroups = qsa('[data-variant-group]');
    if (!selectorGroups.length) return;

    selectorGroups.forEach(function (group) {
      const buttons = qsa('.variant-selector__btn', group);

      buttons.forEach(function (btn) {
        on(btn, 'click', function () {
          buttons.forEach(function (b) { b.classList.remove('is-active'); });
          btn.classList.add('is-active');

          // Update hidden variant input
          const variantInput = qs('[name="id"]', btn.closest('form') || document);
          const variantId = btn.dataset.variantId;
          if (variantInput && variantId) {
            variantInput.value = variantId;
          }

          // Fire custom event
          document.dispatchEvent(new CustomEvent('variant:changed', { detail: { btn } }));
        });
      });
    });
  }

  /* ============================================================
     PRODUCT IMAGE GALLERY
     ============================================================ */
  function initProductGallery() {
    const galleries = qsa('[data-gallery]');
    if (!galleries.length) return;

    galleries.forEach(function (gallery) {
      const mainImg = qs('.product-gallery__main img', gallery);
      const thumbs = qsa('.product-gallery__thumb', gallery);

      thumbs.forEach(function (thumb) {
        on(thumb, 'click', function () {
          thumbs.forEach(function (t) { t.classList.remove('is-active'); });
          thumb.classList.add('is-active');

          const src = thumb.dataset.src;
          const alt = thumb.dataset.alt;
          if (mainImg && src) {
            mainImg.src = src;
            if (alt) mainImg.alt = alt;
          }
        });
      });
    });
  }

  /* ============================================================
     PRODUCT PAGE TABS
     ============================================================ */
  function initProductTabs() {
    const tabNavs = qsa('.product-tabs__nav');
    if (!tabNavs.length) return;

    tabNavs.forEach(function (nav) {
      const tabs = qsa('.product-tabs__tab', nav);
      const tabsContainer = nav.closest('.product-tabs');

      tabs.forEach(function (tab) {
        on(tab, 'click', function () {
          tabs.forEach(function (t) { t.classList.remove('is-active'); });
          tab.classList.add('is-active');

          const target = tab.dataset.tab;
          qsa('.product-tabs__panel', tabsContainer).forEach(function (panel) {
            panel.classList.toggle('is-active', panel.dataset.panel === target);
          });
        });

        on(tab, 'keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            tab.click();
          }
        });
      });
    });
  }

  /* ============================================================
     CART — QTY STEPPER
     ============================================================ */
  function initCartSteppers() {
    const steppers = qsa('.qty-stepper');
    if (!steppers.length) return;

    steppers.forEach(function (stepper) {
      const decBtn = qs('.qty-stepper__btn--dec', stepper);
      const incBtn = qs('.qty-stepper__btn--inc', stepper);
      const valueEl = qs('.qty-stepper__value', stepper);
      if (!valueEl) return;

      on(decBtn, 'click', function () {
        const current = parseInt(valueEl.value || valueEl.textContent, 10);
        if (current > 1) {
          const next = current - 1;
          if (valueEl.tagName === 'INPUT') {
            valueEl.value = next;
          } else {
            valueEl.textContent = next;
          }
          stepper.dispatchEvent(new CustomEvent('qty:changed', { detail: { qty: next }, bubbles: true }));
        }
      });

      on(incBtn, 'click', function () {
        const current = parseInt(valueEl.value || valueEl.textContent, 10);
        const next = current + 1;
        if (valueEl.tagName === 'INPUT') {
          valueEl.value = next;
        } else {
          valueEl.textContent = next;
        }
        stepper.dispatchEvent(new CustomEvent('qty:changed', { detail: { qty: next }, bubbles: true }));
      });
    });
  }

  /* ============================================================
     CART — UPDATE QUANTITIES
     ============================================================ */
  function initCartUpdates() {
    on(document, 'qty:changed', async function (e) {
      const stepper = e.target.closest('.qty-stepper');
      if (!stepper) return;

      const line = stepper.dataset.line;
      const qty = e.detail.qty;
      if (!line) return;

      try {
        const response = await fetch('/cart/change.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ line: parseInt(line, 10), quantity: qty }),
        });

        if (!response.ok) throw new Error('Cart update failed');

        const cart = await response.json();
        document.dispatchEvent(
          new CustomEvent('cart:updated', { detail: { count: cart.item_count } })
        );
      } catch (err) {
        console.error('Cart update error:', err);
      }
    });
  }

  /* ============================================================
     SMOOTH SCROLL for anchor links
     ============================================================ */
  function initSmoothScroll() {
    if (prefersReducedMotion) return;

    on(document, 'click', function (e) {
      const anchor = e.target.closest('a[href^="#"]');
      if (!anchor) return;

      const id = anchor.getAttribute('href').slice(1);
      if (!id) return;

      const target = document.getElementById(id);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // Update focus for accessibility
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
  }

  /* ============================================================
     INIT
     ============================================================ */
  function init() {
    initAnnouncementBar();
    initStickyHeader();
    initMobileNav();
    initScrollReveal();
    initFaqAccordion();
    initWaitlistForm();
    initCartCount();
    initAddToCart();
    initVariantSelector();
    initProductGallery();
    initProductTabs();
    initCartSteppers();
    initCartUpdates();
    initSmoothScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
