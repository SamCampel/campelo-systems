const navToggle = document.querySelector('.nav-toggle');
const siteNavigation = document.querySelector('.site-navigation');

if (navToggle && siteNavigation) {
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    siteNavigation.classList.toggle('mobile-open');
  });
}
