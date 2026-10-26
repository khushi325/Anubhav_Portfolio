/**
 * ANUBHAV SHARMA - PORTFOLIO INTERACTION ENGINE
 * Real-Life Smooth Working Animations & Dynamic Features
 */

document.addEventListener('DOMContentLoaded', () => {
  initAmbientCanvas();
  initThemeToggle();
  initNavigation();
  initScrollReveal();
  initTiltCards();
  initProjectFilters();
  initContactForm();
});

/* ==========================================================================
   1. AMBIENT BACKGROUND CANVAS
   ========================================================================== */
function initAmbientCanvas() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let width, height;
  let particles = [];
  const particleCount = 28;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.radius = Math.random() * 2.2 + 0.8;
      this.speedX = (Math.random() - 0.5) * 0.45;
      this.speedY = (Math.random() - 0.5) * 0.45;
      this.alpha = Math.random() * 0.35 + 0.1;
      this.color = Math.random() > 0.5 ? '56, 189, 248' : '129, 140, 248';
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > width) this.speedX *= -1;
      if (this.y < 0 || this.y > height) this.speedY *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + this.color + ', ' + this.alpha + ')';
      ctx.shadowBlur = 10;
      ctx.shadowColor = 'rgba(' + this.color + ', 0.5)';
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    const isDark = document.body.getAttribute('data-theme') !== 'light';
    const glow1 = ctx.createRadialGradient(width * 0.2, height * 0.3, 20, width * 0.2, height * 0.3, 400);
    glow1.addColorStop(0, isDark ? 'rgba(56, 189, 248, 0.04)' : 'rgba(56, 189, 248, 0.02)');
    glow1.addColorStop(1, 'transparent');
    ctx.fillStyle = glow1;
    ctx.fillRect(0, 0, width, height);

    const glow2 = ctx.createRadialGradient(width * 0.8, height * 0.7, 20, width * 0.8, height * 0.7, 450);
    glow2.addColorStop(0, isDark ? 'rgba(129, 140, 248, 0.04)' : 'rgba(129, 140, 248, 0.02)');
    glow2.addColorStop(1, 'transparent');
    ctx.fillStyle = glow2;
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = 'rgba(56, 189, 248, ' + (0.12 * (1 - dist / 120)) + ')';
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   2. THEME SWITCHER (DARK / LIGHT)
   ========================================================================== */
function initThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  if (!themeToggle) return;

  const savedTheme = localStorage.getItem('as-portfolio-theme') || 'dark';
  document.body.setAttribute('data-theme', savedTheme);

  themeToggle.addEventListener('click', () => {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('as-portfolio-theme', newTheme);
    showToast('Switched to ' + newTheme + ' mode');
  });
}

/* ==========================================================================
   3. NAVIGATION & SCROLLSPY
   ========================================================================== */
function initNavigation() {
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
      });
    });
  }

  window.addEventListener('scroll', () => {
    let scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + sectionId) {
            link.classList.add('active');
          }
        });
      }
    });
  });
}

/* ==========================================================================
   4. SCROLL REVEAL ANIMATIONS
   ========================================================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  revealElements.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top > window.innerHeight) {
      el.classList.add('animate-ready');
    }
  });

  function checkReveal() {
    revealElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.92) {
        el.classList.remove('animate-ready');
        el.classList.add('revealed');
      }
    });
  }

  checkReveal();
  window.addEventListener('scroll', checkReveal);
}

/* ==========================================================================
   5. 3D TILT EFFECT ON CARDS
   ========================================================================== */
function initTiltCards() {
  const cards = document.querySelectorAll('.tilt-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -7;
      const rotateY = ((x - centerX) / centerX) * 7;

      card.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) scale3d(1.02, 1.02, 1.02)';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      card.style.transition = 'transform 0.5s ease';
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'none';
    });
  });
}

/* ==========================================================================
   6. PROJECT CATEGORY FILTERS
   ========================================================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const categories = card.getAttribute('data-category') || '';
        
        if (filterValue === 'all' || categories.indexOf(filterValue) !== -1) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px) scale(0.96)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/* ==========================================================================
   7. SELECTED WORK — CATEGORY GALLERIES
   ========================================================================== */

/* ==========================================================
   7. SELECTED WORK — CATEGORY GALLERIES
   ========================================================== */

const workGalleries = {
  "social-posts": {
    title: "Social Media Posts",
    subtitle: "Social Media Design · 9 Projects",
    description: "A selection of educational campaigns, festive posts, product promotions and achievement creatives.",
    items: [
      {
        src: "assets/images/work/social-posts/mangalmay-admissions.webp",
        title: "Mangalmay Admissions",
        type: "Education"
      },
      {
        src: "assets/images/work/social-posts/gandhi-jayanti.webp",
        title: "Gandhi Jayanti",
        type: "Occasion Post"
      },
      {
        src: "assets/images/work/social-posts/teachers-day.webp",
        title: "Teacher's Day",
        type: "Occasion Post"
      },
      {
        src: "assets/images/work/social-posts/independence-day.webp",
        title: "Independence Day",
        type: "Occasion Post"
      },
      {
        src: "assets/images/work/social-posts/cpa-success.webp",
        title: "CPA Success Story",
        type: "Achievement"
      },
      {
        src: "assets/images/work/social-posts/ganesh-chaturthi.webp",
        title: "Ganesh Chaturthi",
        type: "Occasion Post"
      },
      {
        src: "assets/images/work/social-posts/hoodie-promotion.webp",
        title: "Hoodie Promotion",
        type: "Fashion"
      },
      {
        src: "assets/images/work/social-posts/janmashtami.webp",
        title: "Janmashtami",
        type: "Occasion Post"
      },
      {
        src: "assets/images/work/social-posts/belux-lighting.webp",
        title: "Belux Lighting",
        type: "Product Creative"
      }
    ]
  },

  sharma: {
    title: "Sharma's Restaurant",
    subtitle: "Brand Identity & Visual Design",
    description: "A restaurant branding project featuring logo development, visual identity, typography, menus, stationery and promotional mockups.",
    items: [
      {
        src: "assets/images/work/sharma-restaurant/brand-logo.webp",
        title: "Brand Logo",
        type: "Visual Identity"
      },
      {
        src: "assets/images/work/sharma-restaurant/logo-variations.webp",
        title: "Logo Variations",
        type: "Logo Design"
      },
      {
        src: "assets/images/work/sharma-restaurant/brand-pattern.webp",
        title: "Brand Pattern",
        type: "Brand Identity"
      },
      {
        src: "assets/images/work/sharma-restaurant/typography.webp",
        title: "Typography",
        type: "Brand Guidelines"
      },
      {
        src: "assets/images/work/sharma-restaurant/billboard-mockup.webp",
        title: "Outdoor Billboard",
        type: "Advertising"
      },
      {
        src: "assets/images/work/sharma-restaurant/menu-design.webp",
        title: "Restaurant Menu",
        type: "Print Design"
      },
      {
        src: "assets/images/work/sharma-restaurant/letterhead-design.webp",
        title: "Letterhead",
        type: "Stationery"
      },
      {
        src: "assets/images/work/sharma-restaurant/standee-and-stickers.webp",
        title: "Standee & Stickers",
        type: "Brand Applications"
      }
    ]
  },

  
"ad-creatives": {
  title: "Social Media Ad Creatives",
  subtitle: "Digital Advertising · Multi-format Campaigns",
  description: "6 advertising campaigns featuring 24 designs across square, portrait, story and landscape formats.",
  items: [
    // Campaign 1 — US CPA Global Career
    { src: "assets/images/work/ad-creatives/us-cpa-global-square.webp", title: "US CPA — Square", type: "Square", campaign: "US CPA — Global Career" },
    { src: "assets/images/work/ad-creatives/us-cpa-global-portrait.webp", title: "US CPA — Portrait", type: "Portrait", campaign: "US CPA — Global Career" },
    { src: "assets/images/work/ad-creatives/us-cpa-global-story.webp", title: "US CPA — Story", type: "Story", campaign: "US CPA — Global Career" },
    { src: "assets/images/work/ad-creatives/us-cpa-global-landscape.webp", title: "US CPA — Landscape", type: "Landscape", campaign: "US CPA — Global Career" },

    // Campaign 2 — 7 LPA
    { src: "assets/images/work/ad-creatives/7-lpa-start-square.webp", title: "7 LPA — Square", type: "Square", campaign: "7 LPA — The Start" },
    { src: "assets/images/work/ad-creatives/7-lpa-start-portrait.webp", title: "7 LPA — Portrait", type: "Portrait", campaign: "7 LPA — The Start" },
    { src: "assets/images/work/ad-creatives/7-lpa-start-story.webp", title: "7 LPA — Story", type: "Story", campaign: "7 LPA — The Start" },
    { src: "assets/images/work/ad-creatives/7-lpa-start-landscape.webp", title: "7 LPA — Landscape", type: "Landscape", campaign: "7 LPA — The Start" },

    // Campaign 3 — CPA vs CMA vs EA
    { src: "assets/images/work/ad-creatives/cpa-cma-ea-square.webp", title: "CPA vs CMA vs EA — Square", type: "Square", campaign: "CPA vs CMA vs EA" },
    { src: "assets/images/work/ad-creatives/cpa-cma-ea-portrait.webp", title: "CPA vs CMA vs EA — Portrait", type: "Portrait", campaign: "CPA vs CMA vs EA" },
    { src: "assets/images/work/ad-creatives/cpa-cma-ea-story.webp", title: "CPA vs CMA vs EA — Story", type: "Story", campaign: "CPA vs CMA vs EA" },
    { src: "assets/images/work/ad-creatives/cpa-cma-ea-landscape.webp", title: "CPA vs CMA vs EA — Landscape", type: "Landscape", campaign: "CPA vs CMA vs EA" },

    // Campaign 4 — US CPA Minimal
    { src: "assets/images/work/ad-creatives/us-cpa-minimal-square.webp", title: "US CPA Minimal — Square", type: "Square", campaign: "US CPA — Minimal Concept" },
    { src: "assets/images/work/ad-creatives/us-cpa-minimal-portrait.webp", title: "US CPA Minimal — Portrait", type: "Portrait", campaign: "US CPA — Minimal Concept" },
    { src: "assets/images/work/ad-creatives/us-cpa-minimal-story.webp", title: "US CPA Minimal — Story", type: "Story", campaign: "US CPA — Minimal Concept" },
    { src: "assets/images/work/ad-creatives/us-cpa-minimal-landscape.webp", title: "US CPA Minimal — Landscape", type: "Landscape", campaign: "US CPA — Minimal Concept" },

    // Campaign 5 — Accounting Automation
    { src: "assets/images/work/ad-creatives/accounting-automation-square.webp", title: "Automation — Square", type: "Square", campaign: "Accounting Automation" },
    { src: "assets/images/work/ad-creatives/accounting-automation-portrait.webp", title: "Automation — Portrait", type: "Portrait", campaign: "Accounting Automation" },
    { src: "assets/images/work/ad-creatives/accounting-automation-story.webp", title: "Automation — Story", type: "Story", campaign: "Accounting Automation" },
    { src: "assets/images/work/ad-creatives/accounting-automation-landscape.webp", title: "Automation — Landscape", type: "Landscape", campaign: "Accounting Automation" },

    // Campaign 6 — CPA + AI / CASA
    { src: "assets/images/work/ad-creatives/cpa-ai-casa-square.webp", title: "CPA + AI — Square", type: "Square", campaign: "CPA + AI / CASA" },
    { src: "assets/images/work/ad-creatives/cpa-ai-casa-portrait.webp", title: "CPA + AI — Portrait", type: "Portrait", campaign: "CPA + AI / CASA" },
    { src: "assets/images/work/ad-creatives/cpa-ai-casa-story.webp", title: "CPA + AI — Story", type: "Story", campaign: "CPA + AI / CASA" },
    { src: "assets/images/work/ad-creatives/cpa-ai-casa-landscape.webp", title: "CPA + AI — Landscape", type: "Landscape", campaign: "CPA + AI / CASA" }
  ]
},


  uiux:{
  title: "Sharma's Restaurant — UI/UX Design",
  subtitle: "Mobile App UI/UX · Food Ordering Experience",

  description:
    "A mobile restaurant ordering experience covering food discovery, product details, authentication, payments, promotional offers and profile management.",

  items: [
    {
      src: "assets/images/work/ui ux/restaurant-app-mockup.webp",
      title: "Restaurant App Mockup",
      type: "Project Showcase"
    },
    {
      src: "assets/images/work/ui ux/home-screen.webp",
      title: "Home Screen",
      type: "Food Discovery"
    },
    {
      src: "assets/images/work/ui ux/product-details.webp",
      title: "Shahi Paneer",
      type: "Product Details"
    },
    {
      src: "assets/images/work/ui ux/login-screen.webp",
      title: "Login Screen",
      type: "Authentication"
    },
    {
      src: "assets/images/work/ui ux/profile-screen.webp",
      title: "Profile Screen",
      type: "Account Management"
    },
    {
      src: "assets/images/work/ui ux/edit-profile.webp",
      title: "Edit Profile",
      type: "Account Management"
    },
    {
      src: "assets/images/work/ui ux/payment-method.webp",
      title: "Payment Methods",
      type: "Checkout"
    },
    {
      src: "assets/images/work/ui ux/promocodes.webp",
      title: "Promo Codes",
      type: "Offers & Rewards"
    }
  ]
}


};


/* ==========================================================
   OPEN PROJECT GALLERY
   ========================================================== */


window.openCaseStudy = function(projectId) {
  const data = workGalleries[projectId];
  const modal = document.getElementById("case-study-modal");
  const content = document.getElementById("modal-content");

  if (!data || !modal || !content) return;

  const makeGalleryItem = (item, index) => `
    <button
      type="button"
      class="work-gallery-item"
      onclick="openWorkLightbox('${projectId}', ${index})"
      aria-label="View ${item.title}"
    >
      <img
        src="${item.src}"
        alt="${item.title}"
        loading="lazy"
      >
      <span class="work-gallery-caption">
        <strong>${item.type}</strong>
        <small>Click to enlarge</small>
      </span>
    </button>
  `;

  let gallery = "";

  if (projectId === "ad-creatives" && data.items.length) {
    const campaigns = [...new Set(
      data.items.map(item => item.campaign)
    )];

    gallery = `
      <div class="work-campaigns">
        ${campaigns.map(campaign => `
          <section class="work-campaign">
            <h3 class="work-campaign-title">${campaign}</h3>
            <div class="work-gallery-grid">
              ${data.items
                .map((item, index) => ({ item, index }))
                .filter(entry => entry.item.campaign === campaign)
                .map(entry => makeGalleryItem(entry.item, entry.index))
                .join("")}
            </div>
          </section>
        `).join("")}
      </div>
    `;
  } else if (data.items.length) {
    gallery = `
      <div class="work-gallery-grid">
        ${data.items.map(makeGalleryItem).join("")}
      </div>
    `;
  } else {
    gallery = `
      <div class="work-gallery-empty">
        <i class="fa-regular fa-images"></i>
        <h3>More work coming soon</h3>
        <p>This gallery is ready for your project images.</p>
      </div>
    `;
  }

  content.innerHTML = `
    <div class="work-gallery-heading">
      <span class="work-gallery-eyebrow">${data.subtitle}</span>
      <h2 class="modal-title">${data.title}</h2>
      <p class="modal-desc">${data.description}</p>
      <span class="work-gallery-total">
        ${data.items.length ? data.items.length + " Designs" : "Portfolio Collection"}
      </span>
    </div>
    ${gallery}
  `;

  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");
  modal.querySelector(".modal-container").scrollTop = 0;
  document.body.style.overflow = "hidden";
};



/* ==========================================================
   CLOSE PROJECT GALLERY
   ========================================================== */

window.closeCaseStudy = function() {
  closeWorkLightbox();

  const modal = document.getElementById("case-study-modal");

  if (modal) {
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
  }

  document.body.style.overflow = "";
};


/* ==========================================================
   OPEN FULL-SIZE IMAGE LIGHTBOX
   ========================================================== */

window.openWorkLightbox = function(projectId, index) {
  const data = workGalleries[projectId];
  const item = data && data.items[index];

  if (!item) return;

  closeWorkLightbox();

  const overlay = document.createElement("div");

  overlay.id = "work-lightbox";
  overlay.className = "work-lightbox";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-label", item.title);

  overlay.innerHTML =
    '<button class="work-lightbox-close" type="button" ' +
    'aria-label="Close image preview" ' +
    'onclick="closeWorkLightbox()">' +
    '<i class="fa-solid fa-xmark"></i>' +
    '</button>' +
    '<img src="' + item.src + '" alt="' + item.title + '">' +
    '<p>' + item.title + '</p>';

  overlay.addEventListener("click", function(event) {
    if (event.target === overlay) {
      closeWorkLightbox();
    }
  });

  document.body.appendChild(overlay);

  const closeButton = overlay.querySelector(".work-lightbox-close");
  if (closeButton) closeButton.focus();
};


/* ==========================================================
   CLOSE IMAGE LIGHTBOX
   ========================================================== */

window.closeWorkLightbox = function() {
  const lightbox = document.getElementById("work-lightbox");
  if (lightbox) lightbox.remove();
};


/* ==========================================================
   ESCAPE KEY & OUTSIDE CLICK
   ========================================================== */

window.addEventListener("keydown", function(event) {
  if (event.key === "Escape") {
    if (document.getElementById("work-lightbox")) {
      closeWorkLightbox();
    } else {
      closeCaseStudy();
    }
  }
});

document.getElementById("case-study-modal")?.addEventListener(
  "click",
  function(event) {
    if (event.target.id === "case-study-modal") {
      closeCaseStudy();
    }
  }
);


/* ==========================================================================
   8. CONTACT FORM & INTERACTIONS
   ========================================================================== */
function initContactForm() {
  const magneticBtns = document.querySelectorAll('.magnetic-btn');
  magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = 'translate(' + (x * 0.2) + 'px, ' + (y * 0.2) + 'px)';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0, 0)';
    });
  });
}

window.handleContactSubmit = function(e) {
  e.preventDefault();
  const form = document.getElementById('contact-form');
  const btn = document.getElementById('submit-btn');
  const name = document.getElementById('name').value;

  btn.disabled = true;
  const originalHtml = btn.innerHTML;
  btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Sending message...';

  setTimeout(() => {
    btn.disabled = false;
    btn.innerHTML = originalHtml;
    form.reset();
    showToast('Thank you ' + name + '! Your message has been sent.');
  }, 1200);
};

window.copyContact = function(text, event) {
  if (event) {
    event.stopPropagation();
    event.preventDefault();
  }
  navigator.clipboard.writeText(text).then(() => {
    showToast('Copied ' + text + ' to clipboard!');
  }).catch(() => {
    showToast('Email: ' + text);
  });
};

/* ==========================================================================
   9. TOAST NOTIFICATION
   ========================================================================== */
function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-message');
  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;
  toast.classList.remove('hidden');

  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => {
    toast.classList.add('hidden');
  }, 3500);
}

/* AD CREATIVES — CLICK FIX */

document.addEventListener("click", function (event) {
  const button = event.target.closest(
    '[data-project="ad-creatives"] .view-project-btn, ' +
    '[data-project="ad-creatives"] .project-arrow-btn'
  );

  if (!button) return;

  event.preventDefault();
  event.stopPropagation();

  if (typeof window.openCaseStudy === "function") {
    window.openCaseStudy("ad-creatives");
  } else {
    console.error("openCaseStudy function is missing.");
  }
});
