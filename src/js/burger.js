const burger = document.querySelector('.burgerButton');
const closeBurger = document.querySelector('.burgerButtonMobile');
const menu = document.getElementById('mobileMenu');

document.querySelectorAll('#mobileMenu a:not(.burgerButtonMobile)').forEach(link => {
  link.addEventListener('click', () => {
    menu.classList.remove('active');
  });
});


burger.addEventListener('click', () => {
  menu.classList.add('active');
});

closeBurger.addEventListener('click', () => {
  menu.classList.remove('active');
});
