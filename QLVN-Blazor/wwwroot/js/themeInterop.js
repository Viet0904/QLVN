window.themeInterop = {
    setSidebarFixed: function (isFixed) {

        const navbar = document.querySelector('.pcoded-navbar');
        const inner = document.querySelector('.pcoded-inner-navbar');

        if (!navbar || !inner) return;

        if (isFixed) {
            // === FIXED SIDEBAR ===
            navbar.setAttribute('pcoded-navbar-position', 'fixed');
            navbar.style.position = 'fixed';

            inner.style.overflowY = 'auto';
            inner.style.height = 'calc(100vh - 80px)';

        } else {
            // === ABSOLUTE SIDEBAR ===
            navbar.setAttribute('pcoded-navbar-position', 'absolute');
            navbar.style.position = 'absolute';
        }
    },

    setMenuType: function (type) {
        const pcoded = document.getElementById('pcoded');
        if (!pcoded) return;

        pcoded.setAttribute('nav-type', type);
        pcoded.offsetHeight;
    }
};