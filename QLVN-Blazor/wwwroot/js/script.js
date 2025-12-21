"use strict";


console.log("QLVN: script.js is loading...");

"use strict";

window.initThemeSettings = function () {
    // --- 1. Xử lý Menu Type (Simple/Color Icon) ---
    window.handleMenuType = function (value) {
        $('.pcoded-navbar').attr('pcoded-menutype', value);
    };

    // --- 2. Xử lý Colors (Header, Logo, Active Link, Caption) ---
    $('.navbar-theme').off('click').on('click', function () {
        var ntheme = $(this).attr('navbar-theme');
        $('.pcoded').attr('navbar-theme', ntheme);
    });

    $('.logo-theme').off('click').on('click', function () {
        var ltheme = $(this).attr('logo-theme');
        $('.pcoded').attr('logo-theme', ltheme);
    });

    $('.header-theme').off('click').on('click', function () {
        var htheme = $(this).attr('header-theme');
        $('.pcoded').attr('header-theme', htheme);
    });

    $('.active-item-theme').off('click').on('click', function () {
        var atheme = $(this).attr('active-item-theme');
        $('.pcoded').attr('active-item-theme', atheme);
    });

    $('.leftheader-theme').off('click').on('click', function () {
        var ltheme = $(this).attr('lheader-theme');
        $('.pcoded').attr('lheader-theme', ltheme);
    });

    // --- 3. Xử lý Dropdown Icons & Effects ---
    $('#vertical-menu-effect').off('change').on('change', function () {
        $('.pcoded').attr('vertical-menu-effect', $(this).val());
    });

    $('#vertical-border-style').off('change').on('change', function () {
        $('.pcoded').attr('vertical-border-style', $(this).val());
    });

    $('#vertical-dropdown-icon').off('change').on('change', function () {
        $('.pcoded').attr('vertical-dropdown-icon', $(this).val());
    });

    $('#vertical-subitem-icon').off('change').on('change', function () {
        $('.pcoded').attr('vertical-subitem-icon', $(this).val());
    });

    // --- 4. Xử lý Sidebar/Header Position ---
    $('#sidebar-position').off('change').on('change', function () {
        if ($(this).is(":checked")) {
            $('.pcoded').attr('pcoded-navbar-position', 'fixed');
            $('.pcoded-navbar').attr('pcoded-header-position', 'fixed');
        } else {
            $('.pcoded').attr('pcoded-navbar-position', 'relative');
            $('.pcoded-navbar').attr('pcoded-header-position', 'relative');
        }
    });

    $('#header-position').off('change').on('change', function () {
        if ($(this).is(":checked")) {
            $('.pcoded').attr('pcoded-header-position', 'fixed');
            $('.pcoded-main-container').css('margin-top', $(".pcoded-header").outerHeight());
        } else {
            $('.pcoded').attr('pcoded-header-position', 'relative');
            $('.pcoded-main-container').css('margin-top', '0px');
        }
    });
};

// Hàm khởi tạo các hiệu ứng UI, gọi sau khi Blazor đã render xong Component
window.initAdminFunctions = function () {
    var $window = $(window);

    // Gán ID cho main menu mobile
    var getBody = $("body");
    var bodyClass = getBody[0].className;
    $(".main-menu").attr('id', bodyClass);

    // Card JS: Close, Minimize, Full-card
    // Sử dụng .off().on() để tránh việc gắn sự kiện nhiều lần khi render lại
    $(".card-header-right .close-card").off('click').on('click', function () {
        var $this = $(this);
        $this.parents('.card').animate({
            'opacity': '0',
            '-webkit-transform': 'scale3d(.3, .3, .3)',
            'transform': 'scale3d(.3, .3, .3)'
        });
        setTimeout(function () {
            $this.parents('.card').remove();
        }, 800);
    });

    $(".card-header-right .minimize-card").off('click').on('click', function () {
        var $this = $(this);
        var port = $($this.parents('.card'));
        $(port).children('.card-block').slideToggle();
        $(this).toggleClass("icon-minus icon-plus");
    });

    $(".card-header-right .full-card").off('click').on('click', function () {
        var $this = $(this);
        var port = $($this.parents('.card'));
        port.toggleClass("full-card");
        $(this).toggleClass("icon-maximize icon-minimize");
    });

    // Mở chi tiết User/Search
    $("#more-details").off('click').on('click', function () {
        $(".more-details").slideToggle(500);
    });

    $(".mobile-options").off('click').on('click', function () {
        $(".navbar-container .nav-right").slideToggle('slow');
    });

    // Scrollbar
    $.mCustomScrollbar.defaults.axis = "yx";
    $(".main-menu").mCustomScrollbar({
        setTop: "10px",
        setHeight: "calc(100% - 80px)",
    });

    // Toggle Sidebar Mobile
    $('#mobile-collapse').off('click').on('click', function () {
        $('#mobile-collapse i').toggleClass('icon-toggle-right icon-toggle-left');
    });

    // Initialize Tooltip
    $('[data-toggle="tooltip"]').tooltip();

    // Setting Theme Toggle (Phần quan quan trọng nhất cho SettingTheme.razor)
    $(".selector-toggle > a").off('click').on('click', function () {
        $('#styleSelector').toggleClass('open');
    });
};

// Hàm Toggle FullScreen (vẫn giữ nguyên như cũ)
window.toggleFullScreen = function () {
    if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement) {
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        }
    } else {
        if (document.cancelFullScreen) {
            document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        }
    }
    $('.full-screen').toggleClass('icon-maximize icon-minimize');
};