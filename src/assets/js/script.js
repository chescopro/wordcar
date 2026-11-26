(() => {
  const slides = Array.from(document.querySelectorAll(".slide"));
  const dots = Array.from(document.querySelectorAll(".pagination-dot"));
  const counter = document.querySelector("#current-slide");
  const controls = document.querySelector(".carousel-controls");
  const hero = document.querySelector(".hero");
  const subscribeForm = document.querySelector(".subscribe-form");
  const subscribeStatus = document.querySelector(".subscribe-status");
  const catalogFilters = Array.from(document.querySelectorAll("[data-filter]"));
  const vehicleCards = Array.from(document.querySelectorAll(".vehicle-card"));
  const catalogStatus = document.querySelector(".catalog-status");
  const locationDialog = document.querySelector(".location-dialog");
  const locationDialogTitle = document.querySelector("#location-dialog-title");
  const locationMap = locationDialog?.querySelector("iframe");
  const locationDirections = locationDialog?.querySelector(".location-directions");
  const locationCloseButton = locationDialog?.querySelector(".location-dialog-close");
  const testimonialSlides = Array.from(document.querySelectorAll(".testimonial-slide"));
  const testimonialCarousel = document.querySelector(".testimonial-carousel");
  const testimonialTrack = testimonialCarousel?.querySelector(".testimonial-track");
  const testimonialControls = document.querySelector(".testimonial-controls");
  const testimonialDots = Array.from(document.querySelectorAll(".testimonial-dot"));
  const testimonialCount = document.querySelector(".testimonial-count");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (locationDialog && locationDialogTitle && locationMap && locationDirections && locationCloseButton) {
    document.querySelectorAll(".location-map-button").forEach((button) => {
      button.addEventListener("click", () => {
        const { location, coordinates } = button.dataset;
        if (!location || !coordinates) return;

        const query = encodeURIComponent(coordinates);
        locationDialogTitle.textContent = location;
        locationMap.src = `https://maps.google.com/maps?q=${query}&z=15&output=embed`;
        locationDirections.href = `https://www.google.com/maps/search/?api=1&query=${query}`;
        locationDialog.showModal();
      });
    });

    locationCloseButton.addEventListener("click", () => locationDialog.close());
    locationDialog.addEventListener("click", (event) => {
      if (event.target === locationDialog) locationDialog.close();
    });
    locationDialog.addEventListener("close", () => {
      locationMap.removeAttribute("src");
    });
  }

  if (subscribeForm && subscribeStatus) {
    subscribeForm.addEventListener("submit", (event) => {
      event.preventDefault();
      subscribeStatus.textContent = "El formulario está listo, pero aún falta conectar el servicio de registro.";
    });
  }

  if (catalogFilters.length && vehicleCards.length) {
    const filterCatalog = () => {
      const filters = Object.fromEntries(
        catalogFilters.map((filter) => [filter.dataset.filter, filter.value])
      );
      let visibleCount = 0;

      vehicleCards.forEach((card) => {
        const matches = Object.entries(filters).every(([key, value]) =>
          !value || card.dataset[key] === value
        );
        card.classList.toggle("is-hidden", !matches);
        if (matches) visibleCount += 1;
      });

      if (catalogStatus) {
        catalogStatus.textContent = visibleCount === vehicleCards.length
          ? ""
          : `${visibleCount} vehículo${visibleCount === 1 ? "" : "s"} encontrado${visibleCount === 1 ? "" : "s"}`;
      }
    };

    catalogFilters.forEach((filter) => filter.addEventListener("change", filterCatalog));
  }

  if (testimonialSlides.length && testimonialSlides.length === testimonialDots.length && testimonialCarousel && testimonialTrack && testimonialControls && testimonialCount) {
    let currentTestimonial = 0;
    let testimonialAutoplay;

    const displayTestimonial = (index) => {
      currentTestimonial = (index + testimonialSlides.length) % testimonialSlides.length;

      testimonialSlides.forEach((slide, slideIndex) => {
        const active = slideIndex === currentTestimonial;
        slide.hidden = !active;
        slide.setAttribute("aria-label", `Testimonio ${slideIndex + 1} de ${testimonialSlides.length}`);
        testimonialDots[slideIndex].classList.toggle("is-active", active);

        if (active) {
          testimonialDots[slideIndex].setAttribute("aria-current", "true");
        } else {
          testimonialDots[slideIndex].removeAttribute("aria-current");
        }
      });

      testimonialCount.textContent = `${String(currentTestimonial + 1).padStart(2, "0")} / ${String(testimonialSlides.length).padStart(2, "0")}`;
    };

    const stopTestimonialAutoplay = () => {
      window.clearInterval(testimonialAutoplay);
    };

    const startTestimonialAutoplay = () => {
      stopTestimonialAutoplay();

      const keyboardFocus = testimonialCarousel.querySelector(":focus-visible");
      if (reducedMotion.matches || document.hidden || testimonialCarousel.matches(":hover") || keyboardFocus) return;

      testimonialTrack.setAttribute("aria-live", "off");
      testimonialAutoplay = window.setInterval(() => {
        displayTestimonial(currentTestimonial + 1);
      }, 6000);
    };

    testimonialControls.addEventListener("click", (event) => {
      const button = event.target.closest("button");
      if (!button) return;

      testimonialTrack.setAttribute("aria-live", "polite");
      if (button.dataset.testimonialIndex !== undefined) {
        displayTestimonial(Number(button.dataset.testimonialIndex));
      } else {
        displayTestimonial(currentTestimonial + Number(button.dataset.testimonialStep));
      }

      startTestimonialAutoplay();
    });

    testimonialCarousel.addEventListener("mouseenter", stopTestimonialAutoplay);
    testimonialCarousel.addEventListener("mouseleave", startTestimonialAutoplay);
    testimonialCarousel.addEventListener("focusin", (event) => {
      if (event.target.matches(":focus-visible")) stopTestimonialAutoplay();
    });
    testimonialCarousel.addEventListener("focusout", () => {
      if (!testimonialCarousel.querySelector(":focus-visible")) startTestimonialAutoplay();
    });
    document.addEventListener("visibilitychange", startTestimonialAutoplay);
    reducedMotion.addEventListener("change", startTestimonialAutoplay);

    displayTestimonial(0);
    startTestimonialAutoplay();
  }

  if (!slides.length || slides.length !== dots.length || !counter || !controls || !hero) {
    return;
  }

  let currentIndex = 0;
  let autoplay;

  const displaySlide = (index) => {
    currentIndex = (index + slides.length) % slides.length;

    slides.forEach((slide, slideIndex) => {
      const active = slideIndex === currentIndex;
      slide.classList.toggle("is-active", active);
      slide.setAttribute("aria-hidden", String(!active));
      slide.setAttribute("aria-label", `${slideIndex + 1} de ${slides.length}`);
      dots[slideIndex].classList.toggle("is-active", active);

      if (active) {
        dots[slideIndex].setAttribute("aria-current", "true");
      } else {
        dots[slideIndex].removeAttribute("aria-current");
      }
    });

    counter.textContent = String(currentIndex + 1).padStart(2, "0");
  };

  const stopAutoplay = () => {
    window.clearInterval(autoplay);
  };

  const startAutoplay = () => {
    stopAutoplay();
    if (!reducedMotion.matches && !document.hidden) {
      autoplay = window.setInterval(() => displaySlide(currentIndex + 1), 6500);
    }
  };

  controls.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;

    if (button.classList.contains("pagination-dot")) {
      displaySlide(dots.indexOf(button));
    } else {
      displaySlide(currentIndex + Number(button.dataset.step));
    }

    startAutoplay();
  });

  hero.addEventListener("mouseenter", stopAutoplay);
  hero.addEventListener("mouseleave", startAutoplay);
  hero.addEventListener("focusin", stopAutoplay);
  hero.addEventListener("focusout", (event) => {
    if (!hero.contains(event.relatedTarget)) startAutoplay();
  });
  document.addEventListener("visibilitychange", startAutoplay);
  reducedMotion.addEventListener("change", startAutoplay);

  displaySlide(0);
  startAutoplay();
})();
