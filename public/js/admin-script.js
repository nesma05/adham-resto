(function () {
  //Show Preview of uploaded avatar
  const uploadedavatar = document.getElementById('uploaded-avatar');
  const avatarPreview = document.getElementById('avatar-preview');

  if (uploadedavatar) {
    uploadedavatar.addEventListener('change', showImagePreview(avatarPreview));
  }

  //Show Preview of uploaded dish
  const uploadeddish = document.getElementById('uploaded-dish');
  const dishPreview = document.getElementById('dish-preview');

  if (uploadeddish) {
    uploadeddish.addEventListener('change', showImagePreview(dishPreview));
  }

  function showImagePreview(element) {
    return function (e) {
      if (e.target.files.length > 0) {
        let src = URL.createObjectURL(e.target.files[0]);
        console.log('src', src);
        element.src = src;
        element.classList.add('show');
      }
    };
  }

  //Burger Menu
  const navToggler = document.getElementById('nav-toggler');
  const sideMenu = document.querySelector('.side-menu');
  const mainSection = document.querySelector('.main');
  const dashboard = document.querySelector('.dashboard');
  const mainSectionStyle = getComputedStyle(mainSection).getPropertyValue('height');

  navToggler.addEventListener('click', showSideMenu);

  function showSideMenu(e) {
    navToggler.classList.toggle('change');
    sideMenu.classList.toggle('show');
    mainSection.classList.toggle('slide');
    adjustHeight();
  }

  //adjust dashboard height
  window.addEventListener('load', adjustHeight);

  function adjustHeight() {
    if (!sideMenu.classList.contains('show') && window.innerWidth < 1200) {
      dashboard.style.height = mainSection.clientHeight + 150 + 'px';
    } else {
      dashboard.style.height = 'auto';
    }
  }
})();
