//window.themeBridge = {
//    applySettings: function (settings) {
//        const pcoded = document.getElementById('pcoded');
//        if (!pcoded) return;

//        // 1. Layout Options
//        pcoded.setAttribute('pcoded-header-position', settings.isFixedHeader ? 'fixed' : 'relative');
//        pcoded.setAttribute('pcoded-navbar-position', settings.isFixedSidebar ? 'fixed' : 'relative');

//        // 2. Sidebar Settings
//        pcoded.setAttribute('v-theme', settings.mainLayout);
//        pcoded.setAttribute('vertical-menu-effect', settings.sidebarEffect);
//        pcoded.setAttribute('vertical-border-style', settings.borderStyle);
//        pcoded.setAttribute('vertical-dropdown-icon', settings.dropdownIcon);
//        pcoded.setAttribute('vertical-subitem-icon', settings.subItemIcon);

//        // Menu Type (st5/st6)
//        const navMenu = pcoded.querySelector('.pcoded-navbar');
//        if (navMenu) {
//            navMenu.setAttribute('pcoded-menutype', settings.menuType);
//        }

//        // 3. Colors
//        pcoded.setAttribute('logo-theme', settings.headerBrandColor);
//        pcoded.setAttribute('header-theme', settings.headerColor);
//        pcoded.setAttribute('active-item-theme', settings.activeLinkColor);
//        pcoded.setAttribute('lheader-theme', settings.menuCaptionColor);
//    }
//};


// Đảm bảo đối tượng được khởi tạo trên window
window.adminThemeBridge = {
    // 1. Xử lý tất cả các dropdown: Border, Icon, Effect
    setSelectOption: function (elementId, value) {
        const $pcoded = $('#pcoded');
        if ($pcoded.length === 0) return;

        // Cập nhật giá trị cho thẻ select (nếu có)
        const $el = $(`#${elementId}`);
        if ($el.length) {
            $el.val(value).trigger('change');
        }

        // Gán trực tiếp Attribute để CSS Adminty nhận diện
        switch (elementId) {
            case 'vertical-menu-effect':
                $pcoded.attr('vertical-effect', value);
                break;
            case 'vertical-border-style':
                $pcoded.attr('vborder-style', value);
                break;
            case 'vertical-dropdown-icon':
                $pcoded.attr('dropdown-icon', value);
                break;
            case 'vertical-subitem-icon':
                $pcoded.attr('subitem-icon', value);
                break;
        }
        this.refreshLayout();
    },

    // 2. Sửa lỗi UI Fixed Header
    setHeaderPosition: function (isFixed) {
        const $pcoded = $('#pcoded');
        const pos = isFixed ? "fixed" : "relative";

        $pcoded.attr("headerpos", pos);
        $('.pcoded-header').attr("pcoded-header-position", pos);

        if (!isFixed) {
            // Khi header không cố định, navbar thường chuyển sang absolute
            $('.pcoded-navbar').attr("pcoded-navbar-position", "absolute");
            $pcoded.attr("navbarpos", "absolute");
        } else {
            const isSidebarFixed = $('#sidebar-position').is(':checked');
            const sPos = isSidebarFixed ? "fixed" : "absolute";
            $('.pcoded-navbar').attr("pcoded-navbar-position", sPos);
            $pcoded.attr("navbarpos", sPos);
        }
        this.refreshLayout();
    },

    setSidebarPosition: function (isFixed) {
        const val = isFixed ? "fixed" : "absolute";
        $('.pcoded-navbar').attr("pcoded-navbar-position", val);
        $('#pcoded').attr("navbarpos", val);
        this.refreshLayout();
    },

    refreshLayout: function () {
        setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
        }, 150);
    },

    setTheme: function (type, value) {
        if (type === "navbar") $(`.navbar-theme[navbar-theme="${value}"]`).trigger('click');
        else if (type === "logo") $(`.logo-theme[logo-theme="${value}"]`).trigger('click');
        else if (type === "header") $(`.header-theme[header-theme="${value}"]`).trigger('click');
        else if (type === "active-item") $(`.active-item-theme[active-item-theme="${value}"]`).trigger('click');
        else if (type === "caption") $(`.leftheader-theme[lheader-theme="${value}"]`).trigger('click');
        this.refreshLayout();
    }
};


// Đảm bảo các hàm khởi tạo layout của template được gọi lại nếu cần
window.initAdminFunctions = function () {
    if (typeof $ !== 'undefined' && typeof $.mCustomScrollbar !== 'undefined') {
        $(".main-menu").mCustomScrollbar({
            setTop: "10px",
            setHeight: "calc(100% - 80px)",
        });
    }
    return true;
};