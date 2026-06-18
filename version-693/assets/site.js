(function () {
  var menuButton = document.querySelector('.mobile-menu-button');
  var mobilePanel = document.querySelector('.mobile-panel');
  if (menuButton && mobilePanel) {
    menuButton.addEventListener('click', function () {
      mobilePanel.classList.toggle('open');
    });
  }

  document.querySelectorAll('.hero-slider').forEach(function (slider) {
    var slides = Array.prototype.slice.call(slider.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(slider.querySelectorAll('.hero-dot'));
    if (!slides.length) {
      return;
    }
    var current = 0;
    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === current);
      });
    }
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        show(i);
      });
    });
    setInterval(function () {
      show(current + 1);
    }, 5200);
  });

  document.querySelectorAll('[data-filter-input]').forEach(function (input) {
    var section = input.closest('.content-section') || document;
    var cards = Array.prototype.slice.call(section.querySelectorAll('.movie-card'));
    input.addEventListener('input', function () {
      var query = input.value.trim().toLowerCase();
      cards.forEach(function (card) {
        var text = (card.getAttribute('data-search-text') || '').toLowerCase();
        card.style.display = text.indexOf(query) >= 0 ? '' : 'none';
      });
    });
  });
})();
