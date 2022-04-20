(function () {
  //Preload screen
  const preloadScreen = document.querySelector('.loading-screen');
  window.addEventListener('load', screenFadeOut);

  function screenFadeOut() {
    preloadScreen.style.opacity = 0;
    setTimeout(function () {
      preloadScreen.style.display = 'none';
    }, 800);
  }

  // Show scroll to top button
  const mybutton = document.getElementById('mybutton');

  window.addEventListener('scroll', scrollFunction);

  function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
      mybutton.style.display = 'block';
    } else {
      mybutton.style.display = 'none';
    }
  }

  // Scroll to the top of the document
  mybutton.addEventListener('click', topFunction);

  function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

  // Accordion
  const menuItems = document.querySelectorAll('.menu-section-details-header');

  menuItems.forEach((element) => {
    element.addEventListener('click', showMenuDetails);
  });

  function showMenuDetails(e) {
    this.classList.toggle('active');

    let content = this.nextElementSibling;

    if (content.style.maxHeight) {
      content.style.maxHeight = null;
      this.style.height = '230px';
    } else {
      content.style.maxHeight = `${content.scrollHeight}px`;
      this.style.height = '300px';
    }
  }

  //Slide and Fade in on scroll
  const sliders = document.querySelectorAll('.slideIn');

  const slidersOptions = {
    threshold: 0.5,
  };

  const apperOnScroll = new IntersectionObserver((entries, apperOnScroll) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      } else {
        entry.target.classList.add('appear');
        apperOnScroll.unobserve(entry.target);
      }
    });
  }, slidersOptions);

  sliders.forEach((slider) => {
    apperOnScroll.observe(slider);
  });
})();
