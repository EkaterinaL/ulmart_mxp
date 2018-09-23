(function () {
        var menuBtn = document.querySelector('.header__toggle');
        var menu = document.querySelector('.menu');
        
        var buttonClickHandler = function() {
                menu.classList.toggle('menu--open');
                menuBtn.classList.toggle('header__toggle--open');
        };

        menuBtn.addEventListener('click', buttonClickHandler);

        onload = function() {
            var menuLink = document.querySelectorAll('.menu__link');
            for (i = 0; i < menuLink.length; i++) {
                var link = menuLink[i];
                if (link.href === document.URL) {
                    link.classList.toggle('menu__link--active');
                }
            }
        }
})();