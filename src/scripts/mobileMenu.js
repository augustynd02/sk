document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuSocial = document.getElementById('mobileMenuSocial');
    const header = document.querySelector('header');

    menuToggle.addEventListener('click', function() {
        menuToggle.classList.toggle('active');

        mobileMenu.classList.toggle('active');
        mobileMenuSocial.classList.toggle('active');

        header.classList.toggle('menu-active');

        if (mobileMenu.classList.contains('active')) {
            const menuItems = mobileMenu.querySelectorAll('li');
            menuItems.forEach((item, index) => {
                item.style.transitionDelay = `${0.1 + index * 0.05}s`;
            });

            const socialItems = mobileMenuSocial.querySelectorAll('li');
            socialItems.forEach((item, index) => {
                item.style.transitionDelay = `${0.3 + index * 0.05}s`;
            });
        } else {
            const allItems = document.querySelectorAll('#mobileMenu li, #mobileMenuSocial li');
            allItems.forEach(item => {
                item.style.transitionDelay = '0s';
            });
        }
    });

    const links = document.querySelectorAll('#mobileMenu a, #mobileMenuSocial a');
    links.forEach(link => {
        link.addEventListener('click', function() {
            if (window.getComputedStyle(menuToggle).display !== 'none') {
                menuToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                mobileMenuSocial.classList.remove('active');
                header.classList.remove('menu-active');

                const allItems = document.querySelectorAll('#mobileMenu li, #mobileMenuSocial li');
                allItems.forEach(item => {
                    item.style.transitionDelay = '0s';
                });
            }
        });
    });

    window.addEventListener('resize', function() {
        if (window.innerWidth > 900) {
            menuToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            mobileMenuSocial.classList.remove('active');
            header.classList.remove('menu-active');

            const allItems = document.querySelectorAll('#mobileMenu li, #mobileMenuSocial li');
            allItems.forEach(item => {
                item.style.transitionDelay = '0s';
            });
        }
    });
});
