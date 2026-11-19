(() => {
  const slides = Array.from(document.querySelectorAll(".slide"));
  const dots = Array.from(document.querySelectorAll(".pagination-dot"));
  const counter = document.querySelector("#current-slide");
  const controls = document.querySelector(".carousel-controls");
  const hero = document.querySelector(".hero");
  const subscribeForm = document.querySelector(".subscribe-form");
  const subscribeStatus = document.querySelector(".subscribe-status");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (subscribeForm && subscribeStatus) {
    subscribeForm.addEventListener("submit", (event) => {
      event.preventDefault();
      subscribeStatus.textContent = "El formulario está listo, pero aún falta conectar el servicio de registro.";
    });
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
