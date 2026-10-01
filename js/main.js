/* ============================================
   ROHAN NAVADIYA — PORTFOLIO MAIN JS
   Interactions, navigation, typewriter,
   filters, tilt, form, and GSAP animations
   ============================================ */

(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    initLucideIcons();
    initLoader();
    initNavbar();
    initScrollProgress();
    initTypewriter();
    initProjectFilters();
    initTiltEffect();
    initContactForm();
    initGSAPAnimations();
  });

  /* ---------- Lucide Icons ---------- */
  function initLucideIcons() {
    if (typeof lucide !== "undefined" && lucide.createIcons) {
      lucide.createIcons();
    }
  }

  /* ---------- Loader ---------- */
  function initLoader() {
    const loader = document.getElementById("loader");
    if (!loader) return;

    const dismiss = () => {
      loader.classList.add("loaded");
      document.body.style.overflow = "";
    };

    document.body.style.overflow = "hidden";

    if (document.readyState === "complete") {
      setTimeout(dismiss, 350);
    } else {
      window.addEventListener("load", () => setTimeout(dismiss, 350));
    }

    setTimeout(dismiss, 2800);
  }

  /* ---------- Navbar ---------- */
  function initNavbar() {
    const navbar = document.getElementById("navbar");
    const toggle = document.getElementById("nav-toggle");
    const mobileMenu = document.getElementById("mobile-menu");
    const navLinks = document.querySelectorAll(".navbar__link");
    const mobileLinks = document.querySelectorAll(".mobile-menu__link");
    const sections = document.querySelectorAll("section[id]");

    // --- Scroll state & active section ---
    const onScroll = () => {
      const y = window.scrollY;
      navbar.classList.toggle("scrolled", y > 60);

      let current = "";
      sections.forEach((sec) => {
        if (y >= sec.offsetTop - 200) current = sec.id;
      });
      navLinks.forEach((link) => {
        link.classList.toggle(
          "active",
          link.getAttribute("href") === "#" + current,
        );
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // --- Mobile menu ---
    if (toggle && mobileMenu) {
      const closeBtn = document.getElementById("mobile-close");

      const closeMenu = () => {
        toggle.classList.remove("open");
        mobileMenu.classList.remove("open");
        mobileMenu.setAttribute("aria-hidden", "true");
        toggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      };

      toggle.addEventListener("click", () => {
        const isOpen = mobileMenu.classList.contains("open");
        if (isOpen) {
          closeMenu();
        } else {
          toggle.classList.add("open");
          mobileMenu.classList.add("open");
          mobileMenu.setAttribute("aria-hidden", "false");
          toggle.setAttribute("aria-expanded", "true");
          document.body.style.overflow = "hidden";
        }
      });

      if (closeBtn) {
        closeBtn.addEventListener("click", closeMenu);
      }

      mobileLinks.forEach((link) => link.addEventListener("click", closeMenu));

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && mobileMenu.classList.contains("open"))
          closeMenu();
      });
    }
  }

  /* ---------- Scroll Progress ---------- */
  function initScrollProgress() {
    const bar = document.getElementById("scroll-progress");
    if (!bar) return;

    const update = () => {
      const top = window.scrollY;
      const max =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      bar.style.width = max > 0 ? (top / max) * 100 + "%" : "0%";
    };

    window.addEventListener("scroll", update, { passive: true });
    update();
  }

  /* ---------- Typewriter ---------- */
  function initTypewriter() {
    const el = document.getElementById("typewriter");
    if (!el) return;

    const words = [
      "Web Developer",
      "React & Python Learner",
      "BCA Student",
      "Aspiring Full-Stack Developer",
    ];

    let w = 0,
      c = 0,
      del = false,
      pause = false;

    function tick() {
      const word = words[w];

      if (pause) {
        del = !del;
        pause = false;
        setTimeout(tick, del ? 400 : 600);
        return;
      }

      if (del) {
        c--;
        el.textContent = word.substring(0, c);
        if (c === 0) {
          w = (w + 1) % words.length;
          pause = true;
          setTimeout(tick, 350);
          return;
        }
        setTimeout(tick, 40);
      } else {
        c++;
        el.textContent = word.substring(0, c);
        if (c === word.length) {
          pause = true;
          setTimeout(tick, 2000);
          return;
        }
        setTimeout(tick, 85);
      }
    }

    setTimeout(tick, 900);
  }

  /* ---------- Project Filters ---------- */
  function initProjectFilters() {
    const buttons = document.querySelectorAll(".filter-btn");
    const cards = document.querySelectorAll(".project-card");
    if (!buttons.length || !cards.length) return;

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        buttons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        const filter = btn.dataset.filter;

        cards.forEach((card) => {
          const tags = card.dataset.tags || "";
          const show = filter === "all" || tags.includes(filter);

          if (show) {
            card.classList.remove("hidden");
            if (typeof gsap !== "undefined") {
              gsap.fromTo(
                card,
                { opacity: 0, y: 25 },
                { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" },
              );
            }
          } else {
            card.classList.add("hidden");
          }
        });
      });
    });
  }

  /* ---------- Tilt Effect ---------- */
  function initTiltEffect() {
    if (window.matchMedia("(hover: none)").matches) return;

    document.querySelectorAll("[data-tilt]").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        card.style.transition = "none";
        card.style.transform =
          "perspective(600px) rotateY(" +
          x * 10 +
          "deg) rotateX(" +
          -y * 10 +
          "deg) translateZ(8px)";
      });

      card.addEventListener("mouseleave", () => {
        card.style.transition = "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)";
        card.style.transform =
          "perspective(600px) rotateY(0) rotateX(0) translateZ(0)";
      });
    });
  }

  /* ---------- Contact Form ---------- */
  function initContactForm() {
    const form = document.getElementById("contact-form");
    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let ok = true;

      const nameEl = document.getElementById("form-name");
      const emailEl = document.getElementById("form-email");
      const msgEl = document.getElementById("form-message");
      const nameErr = document.getElementById("name-error");
      const emailErr = document.getElementById("email-error");
      const msgErr = document.getElementById("message-error");
      const successEl = document.getElementById("form-success");

      // Reset
      [nameEl, emailEl, msgEl].forEach((f) => f && f.classList.remove("error"));
      [nameErr, emailErr, msgErr].forEach((f) => f && (f.textContent = ""));

      if (!nameEl.value.trim()) {
        nameEl.classList.add("error");
        nameErr.textContent = "Please enter your name.";
        ok = false;
      }

      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailEl.value.trim() || !re.test(emailEl.value.trim())) {
        emailEl.classList.add("error");
        emailErr.textContent = "Please enter a valid email.";
        ok = false;
      }

      if (!msgEl.value.trim()) {
        msgEl.classList.add("error");
        msgErr.textContent = "Please enter a message.";
        ok = false;
      }

      if (!ok) return;

      // Mailto fallback (wire up Formspree / EmailJS for production)
      const subject = encodeURIComponent(
        "Portfolio Contact from " + nameEl.value.trim(),
      );
      const body = encodeURIComponent(
        "Name: " +
          nameEl.value.trim() +
          "\nEmail: " +
          emailEl.value.trim() +
          "\n\n" +
          msgEl.value.trim(),
      );
      window.open(
        "mailto:workwithrohannavadiya@gmail.com?subject=" +
          subject +
          "&body=" +
          body,
        "_blank",
      );

      form.reset();
      if (successEl) {
        successEl.classList.add("show");
        setTimeout(() => successEl.classList.remove("show"), 5000);
      }
    });
  }

  /* ---------- GSAP Scroll Animations ---------- */
  function initGSAPAnimations() {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined")
      return;

    gsap.registerPlugin(ScrollTrigger);

    // Reveal-up elements
    gsap.utils.toArray(".reveal-up").forEach((el) => {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      });
    });

    // Reveal from left
    gsap.utils.toArray(".reveal-left").forEach((el) => {
      gsap.to(el, {
        opacity: 1,
        x: 0,
        duration: 0.85,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      });
    });

    // Reveal from right
    gsap.utils.toArray(".reveal-right").forEach((el) => {
      gsap.to(el, {
        opacity: 1,
        x: 0,
        duration: 0.85,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      });
    });

    // Stagger project cards
    ScrollTrigger.batch(".project-card:not(.hidden)", {
      onEnter: (els) =>
        gsap.to(els, {
          opacity: 1,
          y: 0,
          stagger: 0.07,
          duration: 0.55,
          ease: "power2.out",
        }),
      start: "top 90%",
      once: true,
    });

    // Stagger cert cards
    ScrollTrigger.batch(".cert-card", {
      onEnter: (els) =>
        gsap.to(els, {
          opacity: 1,
          y: 0,
          stagger: 0.05,
          duration: 0.5,
          ease: "power2.out",
        }),
      start: "top 92%",
      once: true,
    });

    // Timeline items
    ScrollTrigger.batch(".timeline__item", {
      onEnter: (els) =>
        gsap.to(els, {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          duration: 0.7,
          ease: "power2.out",
        }),
      start: "top 85%",
      once: true,
    });
  }
})();
