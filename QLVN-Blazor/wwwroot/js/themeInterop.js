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

    setHeaderFixed: function (isFixed) {
        const pcoded = document.getElementById('pcoded');
        const headerNavbar = document.querySelector('.header-navbar');
        const mainContainer = document.querySelector('.pcoded-main-container');
        const pcodedNavbar = document.querySelector('.pcoded-navbar');

        if (!pcoded || !headerNavbar) return;

        if (isFixed) {
            // === FIXED HEADER ===
            pcoded.setAttribute('pcoded-header-position', 'fixed');
            headerNavbar.setAttribute('pcoded-header-position', 'fixed');
            headerNavbar.style.position = 'fixed';
            headerNavbar.style.top = '0';
            headerNavbar.style.left = '0';
            headerNavbar.style.right = '0';
            headerNavbar.style.width = '100%';
            headerNavbar.style.zIndex = '1030';

            if (mainContainer) {
                mainContainer.style.marginTop = '56px';
            }

            if (pcodedNavbar) {
                pcodedNavbar.style.top = '56px';
                pcodedNavbar.style.height = 'calc(100vh - 56px)';
            }
        } else {
            // === RELATIVE HEADER ===
            pcoded.setAttribute('pcoded-header-position', 'relative');
            headerNavbar.setAttribute('pcoded-header-position', 'relative');
            headerNavbar.style.position = '';
            headerNavbar.style.top = '';
            headerNavbar.style.left = '';
            headerNavbar.style.right = '';
            headerNavbar.style.width = '';
            headerNavbar.style.zIndex = '';

            if (mainContainer) {
                mainContainer.style.marginTop = '';
            }

            if (pcodedNavbar) {
                pcodedNavbar.style.top = '';
                pcodedNavbar.style.height = '';
            }
            
            // Scroll về đầu trang khi chuyển sang relative header
            window.scrollTo(0, 0);
        }
    },

    setMenuType: function (type) {
        const pcoded = document.getElementById('pcoded');
        if (!pcoded) return;

        pcoded.setAttribute('nav-type', type);
        pcoded.offsetHeight;
    },

    // ==========================================
    // TOGGLE STYLE SELECTOR PANEL
    // ==========================================
    initStyleSelector: function () {
        // Remove old event handlers first
        $(document).off('click.styleSelector');
        $('.selector-toggle').off('click');

        // Bind click event on selector-toggle
        $('.selector-toggle').on('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            
            var $styleSelector = $('#styleSelector');
            
            if ($styleSelector.hasClass('open')) {
                // Close
                $styleSelector.removeClass('open');
                $styleSelector.css('right', '-300px');
            } else {
                // Open
                $styleSelector.addClass('open');
                $styleSelector.css('right', '0px');
            }
        });

        // Click outside to close
        $(document).on('click.styleSelector', function (e) {
            var $styleSelector = $('#styleSelector');
            if ($styleSelector.hasClass('open') && !$(e.target).closest('#styleSelector').length) {
                $styleSelector.removeClass('open');
                $styleSelector.css('right', '-300px');
            }
        });

        console.log('✅ Style selector initialized');
    }
};