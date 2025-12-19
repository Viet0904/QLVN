window.themeHelper = {
    applySettings: function (settings) {
        const pcoded = document.getElementById('pcoded');
        if (!pcoded) return;

        // 1. Layout Options
        pcoded.setAttribute('pcoded-header-position', settings.isFixedHeader ? 'fixed' : 'relative');
        pcoded.setAttribute('pcoded-navbar-position', settings.isFixedSidebar ? 'fixed' : 'relative');

        // 2. Sidebar Settings
        pcoded.setAttribute('v-theme', settings.mainLayout);
        pcoded.setAttribute('vertical-menu-effect', settings.sidebarEffect);
        pcoded.setAttribute('vertical-border-style', settings.borderStyle);
        pcoded.setAttribute('vertical-dropdown-icon', settings.dropdownIcon);
        pcoded.setAttribute('vertical-subitem-icon', settings.subItemIcon);

        const navMenu = document.querySelector('.pcoded-navbar');
        if (navMenu) {
            navMenu.setAttribute('pcoded-menutype', settings.menuType);
        }

        // 3. Colors
        pcoded.setAttribute('logo-theme', settings.headerBrandColor);
        pcoded.setAttribute('header-theme', settings.headerColor);
        pcoded.setAttribute('active-item-theme', settings.activeLinkColor);
        pcoded.setAttribute('lheader-theme', settings.menuCaptionColor);
    }
};