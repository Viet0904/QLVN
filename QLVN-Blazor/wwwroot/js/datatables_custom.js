window.dataTableInstances = {};
window.selectedUserRows = {};

window.initDataTable = function (selector) {
    if ($.fn.DataTable.isDataTable(selector)) {
        $(selector).DataTable().destroy();
    }

    var viewportHeight = $(window).height();
    var scrollHeight = Math.max(200, Math.min(500, viewportHeight * 0.5));

    const table = $(selector).DataTable({
        responsive: true,
        searching: true,
        ordering: true,
        info: true,
        paging: true,
        scrollY: scrollHeight + 'px',
        scrollX: true,
        scrollCollapse: true,

        select: {
            style: 'multi',
            selector: 'td:not(:last-child)',
            info: false
        },

        pageLength: 10,
        lengthMenu: [[10, 25, 50, 100, -1], [10, 25, 50, 100, "Tất cả"]],
        pagingType: "full_numbers",
        order: [[0, "asc"]],

        layout: {
            topStart: 'pageLength',
            topEnd: 'search',
            bottomStart: 'info',
            bottomEnd: 'paging'
        },

        language: {
            lengthMenu: "Hiển thị _MENU_ bản ghi",
            zeroRecords: "Không tìm thấy dữ liệu phù hợp",
            info: "Hiển thị từ _START_ đến _END_ trong _TOTAL_ bản ghi",
            infoEmpty: "Hiển thị từ 0 đến 0 trong 0 bản ghi",
            infoFiltered: "(được lọc từ _MAX_ bản ghi)",
            search: "Tìm kiếm:",
            searchPlaceholder: "Nhập từ khóa...",
            paginate: {
                first: '«',
                last: '»',
                next: '›',
                previous: '‹'
            }
        },

        columnDefs: [
            { orderable: false, targets: -1 }
        ],

        initComplete: function () {
            var api = this.api();
            var totalColumns = api.columns().nodes().length;

            api.columns().every(function (index) {
                var column = this;
                var header = $(column.header());

                if (index === totalColumns - 1) return;
                if (header.find('.dt-column-menu').length > 0) return;

                var menuBtn = $('<span class="dt-column-menu" title="Menu"><i class="feather icon-menu"></i></span>');

                var dropdown = $(`
                    <div class="dt-column-dropdown">
                        <div class="dt-dropdown-item dt-sort-asc">
                            <i class="feather icon-arrow-up"></i>
                            <span>Sort Ascending</span>
                        </div>
                        <div class="dt-dropdown-item dt-sort-desc">
                            <i class="feather icon-arrow-down"></i>
                            <span>Sort Descending</span>
                        </div>
                        <div class="dt-dropdown-divider"></div>
                        <div class="dt-dropdown-section">
                            <label class="dt-dropdown-label">Filter Type</label>
                            <select class="dt-filter-type">
                                <option value="contains">Contains</option>
                                <option value="equals">Equals</option>
                                <option value="starts">Starts with</option>
                                <option value="ends">Ends with</option>
                            </select>
                        </div>
                        <div class="dt-dropdown-filter">
                            <input type="text" class="dt-filter-input" placeholder="Filter value...">
                        </div>
                        <div class="dt-dropdown-item dt-clear-filter">
                            <i class="feather icon-x-circle"></i>
                            <span>Clear Filter</span>
                        </div>
                    </div>
                `);

                header.append(menuBtn);
                $('body').append(dropdown);

                // Flag để ngăn dropdown đóng khi đang filter
                var isFiltering = false;

                function applyFilter(closeDropdown) {
                    var filterType = dropdown.find('.dt-filter-type').val();
                    var filterValue = dropdown.find('.dt-filter-input').val();

                    isFiltering = true;

                    if (!filterValue) {
                        if (column.search() !== '') {
                            column.search('').draw();
                        }
                    } else {
                        var regex = '';
                        switch (filterType) {
                            case 'equals':
                                regex = '^' + $.fn.dataTable.util.escapeRegex(filterValue) + '$';
                                break;
                            case 'starts':
                                regex = '^' + $.fn.dataTable.util.escapeRegex(filterValue);
                                break;
                            case 'ends':
                                regex = $.fn.dataTable.util.escapeRegex(filterValue) + '$';
                                break;
                            case 'contains':
                            default:
                                regex = $.fn.dataTable.util.escapeRegex(filterValue);
                                break;
                        }
                        column.search(regex, true, false).draw();
                    }

                    // Giữ dropdown mở và focus lại input
                    setTimeout(function () {
                        isFiltering = false;
                        if (!closeDropdown) {
                            dropdown.addClass('show');
                            dropdown.find('.dt-filter-input').focus();
                        }
                    }, 10);

                    if (closeDropdown) {
                        dropdown.removeClass('show');
                    }
                }

                function positionDropdown() {
                    var btnOffset = menuBtn.offset();
                    var btnHeight = menuBtn.outerHeight();
                    var dropdownWidth = dropdown.outerWidth();
                    var left = btnOffset.left - dropdownWidth + menuBtn.outerWidth();

                    dropdown.css({
                        top: btnOffset.top + btnHeight + 5,
                        left: left
                    });

                    if (dropdown.offset().left < 10) {
                        dropdown.css('left', 10);
                    }

                    var dropdownRight = dropdown.offset().left + dropdownWidth;
                    var windowWidth = $(window).width();
                    if (dropdownRight > windowWidth - 10) {
                        dropdown.css('left', windowWidth - dropdownWidth - 10);
                    }

                    var dropdownBottom = dropdown.offset().top + dropdown.outerHeight();
                    var windowHeight = $(window).height() + $(window).scrollTop();
                    if (dropdownBottom > windowHeight) {
                        dropdown.css('top', btnOffset.top - dropdown.outerHeight() - 5);
                    }
                }

                menuBtn.on('click', function (e) {
                    e.stopPropagation();
                    e.preventDefault();

                    $('.dt-column-dropdown').not(dropdown).removeClass('show');
                    dropdown.toggleClass('show');

                    if (dropdown.hasClass('show')) {
                        positionDropdown();
                    }
                });

                dropdown.find('.dt-sort-asc').on('click', function (e) {
                    e.stopPropagation();
                    column.order('asc').draw();
                    dropdown.removeClass('show');
                });

                dropdown.find('.dt-sort-desc').on('click', function (e) {
                    e.stopPropagation();
                    column.order('desc').draw();
                    dropdown.removeClass('show');
                });

                // Ngăn tất cả click trong dropdown đóng menu
                dropdown.on('click mousedown', function (e) {
                    e.stopPropagation();
                });

                // Filter type change
                dropdown.find('.dt-filter-type').on('change', function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    var filterValue = dropdown.find('.dt-filter-input').val();
                    if (filterValue) {
                        applyFilter(false);
                    }
                });

                // Filter input - realtime với debounce
                var filterTimeout;
                dropdown.find('.dt-filter-input').on('input', function (e) {
                    e.stopPropagation();
                    clearTimeout(filterTimeout);
                    filterTimeout = setTimeout(function () {
                        applyFilter(false);
                    }, 400);
                });

                // Enter để đóng dropdown
                dropdown.find('.dt-filter-input').on('keydown', function (e) {
                    e.stopPropagation();
                    if (e.key === 'Enter' || e.keyCode === 13) {
                        e.preventDefault();
                        clearTimeout(filterTimeout);
                        applyFilter(true);
                    }
                });

                // Ngăn các event khác
                dropdown.find('.dt-filter-input, .dt-filter-type').on('click focus mousedown mouseup', function (e) {
                    e.stopPropagation();
                });

                dropdown.find('.dt-clear-filter').on('click', function (e) {
                    e.stopPropagation();
                    dropdown.find('.dt-filter-input').val('');
                    dropdown.find('.dt-filter-type').val('contains');
                    column.search('').draw();
                    dropdown.removeClass('show');
                });

                // Lưu reference để check khi close
                dropdown.data('isFiltering', function () { return isFiltering; });
            });

            $(document).on('click.dtMenu', function (e) {
                if (!$(e.target).closest('.dt-column-menu, .dt-column-dropdown').length) {
                    // Kiểm tra không đang filter
                    var shouldClose = true;
                    $('.dt-column-dropdown.show').each(function () {
                        var checkFiltering = $(this).data('isFiltering');
                        if (checkFiltering && checkFiltering()) {
                            shouldClose = false;
                        }
                    });
                    if (shouldClose) {
                        $('.dt-column-dropdown').removeClass('show');
                    }
                }
            });

            $(window).on('scroll.dtMenu resize.dtMenu', function () {
                $('.dt-column-dropdown').removeClass('show');
            });

            $('.dt-scroll-body').on('scroll', function () {
                $('.dt-column-dropdown').removeClass('show');
            });
        }
    });

    window.dataTableInstances[selector] = table;
    window.selectedUserRows[selector] = [];

    table.on('select deselect', function (e, dt, type, indexes) {
        if (type === 'row') {
            const selectedRows = table.rows({ selected: true }).data();
            window.selectedUserRows[selector] = [];
            selectedRows.each(function (rowData, index) {
                const rowNode = table.row(index).node();
                const userId = $(rowNode).data('user-id');
                if (userId) window.selectedUserRows[selector].push(userId);
            });
        }
    });

    $(window).on('resize.dtResize', function () {
        if (window.dataTableInstances[selector]) {
            window.dataTableInstances[selector].columns.adjust();
        }
    });
    // Bind action events cho tất cả rows sau khi DataTable init xong
    table.on('draw', function () {
        window.bindAllRowEvents(selector);
    });

    // Bind lần đầu
    window.bindAllRowEvents(selector);

  
};

window.destroyDataTable = function (selector) {
    if (window.dataTableInstances[selector]) {
        $(document).off('click.dtMenu');
        $(window).off('scroll.dtMenu resize.dtMenu resize.dtResize');
        $('.dt-column-dropdown').remove();
        window.dataTableInstances[selector].destroy();
        delete window.dataTableInstances[selector];
        delete window.selectedUserRows[selector];
    }
};

window.reinitDataTable = function (selector) {
    window.destroyDataTable(selector);
    window.initDataTable(selector);
};

window.getSelectedUserIds = function (selector) {
    return window.selectedUserRows[selector] || [];
};

window.clearTableSelection = function (selector) {
    if (window.dataTableInstances[selector]) {
        window.dataTableInstances[selector].rows().deselect();
        window.selectedUserRows[selector] = [];
    }
};

// ==========================================
// USER DATA TABLE WITH CUSTOM COLUMN VISIBILITY
// ==========================================

window.initUserDataTable = function (selector) {
    if ($.fn.DataTable.isDataTable(selector)) {
        $(selector).DataTable().destroy();
    }

    // Xóa các element cũ nếu có
    $('.dt-column-dropdown').remove();
    $('.colvis-dropdown-custom').remove();
    $('.dt-custom-toolbar').remove();

    var viewportHeight = $(window).height();
    var scrollHeight = Math.max(200, Math.min(500, viewportHeight * 0.5));

    // Định nghĩa tên cột
    var columnNames = [
        'Id', 'Nhóm', 'Tên', 'Giới tính', 'Tên đăng nhập',
        'Email', 'Điện thoại', 'CMND/CCCD', 'Địa chỉ', 'Hình ảnh',
        'Ghi chú', 'Trạng thái', 'Ngày tạo', 'Người tạo', 'Ngày cập nhật', 'Người cập nhật',
        'Hành động'
    ];

    // Cột mặc định ẩn
    var defaultHiddenColumns = [3, 7, 8, 9, 10, 13, 14, 15];

    const table = $(selector).DataTable({
        responsive: false,
        searching: true,
        ordering: true,
        info: true,
        paging: true,
        lengthChange: false,
        scrollY: scrollHeight + 'px',
        scrollX: true,
        scrollCollapse: true,

        select: {
            style: 'multi',
            selector: 'td:not(:last-child)',
            info: false
        },

        pageLength: 10,
        pagingType: "full_numbers",
        order: [[0, "asc"]],

        layout: {
            topStart: null,
            topEnd: null,
            bottomStart: 'info',
            bottomEnd: 'paging'
        },

        language: {
            zeroRecords: "Không tìm thấy dữ liệu phù hợp",
            info: "Hiển thị từ _START_ đến _END_ trong _TOTAL_ bản ghi",
            infoEmpty: "Hiển thị từ 0 đến 0 trong 0 bản ghi",
            infoFiltered: "(được lọc từ _MAX_ bản ghi)",
            paginate: {
                first: '«',
                last: '»',
                next: '›',
                previous: '‹'
            }
        },

        columnDefs: [
            { orderable: false, targets: -1 },
            { visible: false, targets: defaultHiddenColumns }
        ],

        initComplete: function () {
            var api = this.api();
            var wrapper = $(api.table().container());
            var totalColumns = api.columns().nodes().length;

            // Tạo custom toolbar
            createCustomToolbar(api, wrapper, columnNames, totalColumns);

            // Tạo menu dropdown cho mỗi cột
            api.columns().every(function (index) {
                var column = this;
                var header = $(column.header());

                if (index === totalColumns - 1) return;
                if (header.find('.dt-column-menu').length > 0) return;

                var menuBtn = $('<span class="dt-column-menu" title="Menu"><i class="feather icon-menu"></i></span>');

                var dropdown = $(`
                    <div class="dt-column-dropdown">
                        <div class="dt-dropdown-item dt-sort-asc">
                            <i class="feather icon-arrow-up"></i>
                            <span>Sắp xếp tăng dần</span>
                        </div>
                        <div class="dt-dropdown-item dt-sort-desc">
                            <i class="feather icon-arrow-down"></i>
                            <span>Sắp xếp giảm dần</span>
                        </div>
                        <div class="dt-dropdown-divider"></div>
                        <div class="dt-dropdown-item dt-hide-column">
                            <i class="feather icon-eye-off"></i>
                            <span>Ẩn cột này</span>
                        </div>
                        <div class="dt-dropdown-divider"></div>
                        <div class="dt-dropdown-section">
                            <label class="dt-dropdown-label">Kiểu lọc</label>
                            <select class="dt-filter-type">
                                <option value="contains">Chứa</option>
                                <option value="equals">Bằng</option>
                                <option value="starts">Bắt đầu với</option>
                                <option value="ends">Kết thúc với</option>
                            </select>
                        </div>
                        <div class="dt-dropdown-filter">
                            <input type="text" class="dt-filter-input" placeholder="Nhập giá trị lọc...">
                        </div>
                        <div class="dt-dropdown-item dt-clear-filter">
                            <i class="feather icon-x-circle"></i>
                            <span>Xóa bộ lọc</span>
                        </div>
                    </div>
                `);

                header.append(menuBtn);
                $('body').append(dropdown);

                // Flag để ngăn dropdown đóng khi đang filter
                var isFiltering = false;

                function applyFilter(closeDropdown) {
                    var filterType = dropdown.find('.dt-filter-type').val();
                    var filterValue = dropdown.find('.dt-filter-input').val();

                    isFiltering = true;

                    if (!filterValue) {
                        if (column.search() !== '') {
                            column.search('').draw();
                        }
                    } else {
                        var regex = '';
                        switch (filterType) {
                            case 'equals':
                                regex = '^' + $.fn.dataTable.util.escapeRegex(filterValue) + '$';
                                break;
                            case 'starts':
                                regex = '^' + $.fn.dataTable.util.escapeRegex(filterValue);
                                break;
                            case 'ends':
                                regex = $.fn.dataTable.util.escapeRegex(filterValue) + '$';
                                break;
                            case 'contains':
                            default:
                                regex = $.fn.dataTable.util.escapeRegex(filterValue);
                                break;
                        }
                        column.search(regex, true, false).draw();
                    }

                    // Giữ dropdown mở và focus lại input
                    setTimeout(function () {
                        isFiltering = false;
                        if (!closeDropdown) {
                            dropdown.addClass('show');
                            dropdown.find('.dt-filter-input').focus();
                        }
                    }, 10);

                    if (closeDropdown) {
                        dropdown.removeClass('show');
                    }
                }

                function positionDropdown() {
                    var btnOffset = menuBtn.offset();
                    var btnHeight = menuBtn.outerHeight();
                    var dropdownWidth = dropdown.outerWidth();
                    var left = btnOffset.left - dropdownWidth + menuBtn.outerWidth();

                    dropdown.css({
                        top: btnOffset.top + btnHeight + 5,
                        left: left
                    });

                    if (dropdown.offset().left < 10) {
                        dropdown.css('left', 10);
                    }

                    var dropdownRight = dropdown.offset().left + dropdownWidth;
                    var windowWidth = $(window).width();
                    if (dropdownRight > windowWidth - 10) {
                        dropdown.css('left', windowWidth - dropdownWidth - 10);
                    }

                    var dropdownBottom = dropdown.offset().top + dropdown.outerHeight();
                    var windowHeight = $(window).height() + $(window).scrollTop();
                    if (dropdownBottom > windowHeight) {
                        dropdown.css('top', btnOffset.top - dropdown.outerHeight() - 5);
                    }
                }

                menuBtn.on('click', function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    $('.dt-column-dropdown').not(dropdown).removeClass('show');
                    $('.colvis-dropdown-custom').removeClass('show');
                    dropdown.toggleClass('show');
                    if (dropdown.hasClass('show')) {
                        positionDropdown();
                    }
                });

                dropdown.find('.dt-sort-asc').on('click', function (e) {
                    e.stopPropagation();
                    column.order('asc').draw();
                    dropdown.removeClass('show');
                });

                dropdown.find('.dt-sort-desc').on('click', function (e) {
                    e.stopPropagation();
                    column.order('desc').draw();
                    dropdown.removeClass('show');
                });

                dropdown.find('.dt-hide-column').on('click', function (e) {
                    e.stopPropagation();
                    column.visible(false);
                    dropdown.removeClass('show');
                    updateColumnVisibilityDropdown(api);
                });

                // Ngăn tất cả click trong dropdown đóng menu
                dropdown.on('click mousedown', function (e) {
                    e.stopPropagation();
                });

                // Filter type change
                dropdown.find('.dt-filter-type').on('change', function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    var filterValue = dropdown.find('.dt-filter-input').val();
                    if (filterValue) {
                        applyFilter(false);
                    }
                });

                // Filter input - realtime với debounce
                var filterTimeout;
                dropdown.find('.dt-filter-input').on('input', function (e) {
                    e.stopPropagation();
                    clearTimeout(filterTimeout);
                    filterTimeout = setTimeout(function () {
                        applyFilter(false);
                    }, 400);
                });

                // Enter để đóng dropdown
                dropdown.find('.dt-filter-input').on('keydown', function (e) {
                    e.stopPropagation();
                    if (e.key === 'Enter' || e.keyCode === 13) {
                        e.preventDefault();
                        clearTimeout(filterTimeout);
                        applyFilter(true);
                    }
                });

                // Ngăn các event khác
                dropdown.find('.dt-filter-input, .dt-filter-type').on('click focus mousedown mouseup', function (e) {
                    e.stopPropagation();
                });

                dropdown.find('.dt-clear-filter').on('click', function (e) {
                    e.stopPropagation();
                    dropdown.find('.dt-filter-input').val('');
                    dropdown.find('.dt-filter-type').val('contains');
                    column.search('').draw();
                    dropdown.removeClass('show');
                });

                // Lưu reference để check khi close
                dropdown.data('isFiltering', function () { return isFiltering; });
            });

            // Close dropdowns on outside click
            $(document).on('click.dtUserMenu', function (e) {
                if (!$(e.target).closest('.dt-column-menu, .dt-column-dropdown, .colvis-btn-custom, .colvis-dropdown-custom').length) {
                    // Kiểm tra không đang filter
                    var shouldClose = true;
                    $('.dt-column-dropdown.show').each(function () {
                        var checkFiltering = $(this).data('isFiltering');
                        if (checkFiltering && checkFiltering()) {
                            shouldClose = false;
                        }
                    });
                    if (shouldClose) {
                        $('.dt-column-dropdown').removeClass('show');
                        $('.colvis-dropdown-custom').removeClass('show');
                    }
                }
            });

            $(window).on('scroll.dtUserMenu resize.dtUserMenu', function () {
                $('.dt-column-dropdown').removeClass('show');
                $('.colvis-dropdown-custom').removeClass('show');
            });

            $('.dt-scroll-body').on('scroll', function () {
                $('.dt-column-dropdown').removeClass('show');
            });
        }
    });

    window.dataTableInstances[selector] = table;
    window.selectedUserRows[selector] = [];

    table.on('select deselect', function (e, dt, type, indexes) {
        if (type === 'row') {
            const selectedRows = table.rows({ selected: true }).data();
            window.selectedUserRows[selector] = [];
            selectedRows.each(function (rowData, index) {
                const rowNode = table.row(index).node();
                const userId = $(rowNode).data('user-id');
                if (userId) window.selectedUserRows[selector].push(userId);
            });
        }
    });

    $(window).on('resize.dtUserResize', function () {
        if (window.dataTableInstances[selector]) {
            window.dataTableInstances[selector].columns.adjust();
        }
    });

    console.log('User DataTable with Column Visibility initialized:', selector);
};

// Tạo custom toolbar với layout đẹp - CÓ NÚT THÊM MỚI
function createCustomToolbar(api, wrapper, columnNames, totalColumns) {
    var toolbarHtml = `
        <div class="dt-custom-toolbar">
            <div class="dt-toolbar-left">
                <div class="colvis-wrapper">
                    <button type="button" class="btn btn-secondary btn-sm colvis-btn-custom">
                        <i class="feather icon-columns"></i> Cột Hiển Thị
                        <i class="feather icon-chevron-down ms-1"></i>
                    </button>
                    <div class="colvis-dropdown-custom">
                        <div class="colvis-item colvis-show-all">
                            <i class="feather icon-eye"></i>
                            <span>Hiện tất cả</span>
                        </div>
                        <div class="colvis-divider"></div>
                        <div class="colvis-columns-list"></div>
                    </div>
                </div>
                <div class="dt-length-wrapper">
                    <select class="form-select form-select-sm dt-page-length">
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                        <option value="-1">Tất cả</option>
                    </select>
                    <span>bản ghi</span>
                </div>
            </div>
            <div class="dt-toolbar-right">
                <div class="dt-search-wrapper">
                    <label>Tìm kiếm:</label>
                    <input type="search" class="form-control form-control-sm dt-custom-search" placeholder="Nhập từ khóa...">
                </div>
                <button type="button" class="btn btn-primary btn-sm dt-add-new-btn" id="btnAddNewUser">
                    <i class="feather icon-plus"></i> Thêm Mới
                </button>
            </div>
        </div>
    `;

    // Chèn toolbar vào đầu wrapper
    wrapper.prepend(toolbarHtml);

    // Tạo danh sách các cột cho column visibility
    var columnsList = wrapper.find('.colvis-columns-list');
    for (var i = 0; i < totalColumns - 1; i++) {
        var isVisible = api.column(i).visible();
        var itemHtml = `
            <div class="colvis-item colvis-column-toggle" data-column="${i}">
                <span class="colvis-check">${isVisible ? '✓' : ''}</span>
                <span class="colvis-name">${columnNames[i]}</span>
            </div>
        `;
        columnsList.append(itemHtml);
    }

    // Toggle column visibility dropdown
    wrapper.find('.colvis-btn-custom').on('click', function (e) {
        e.stopPropagation();
        $('.dt-column-dropdown').removeClass('show');
        wrapper.find('.colvis-dropdown-custom').toggleClass('show');
    });

    // Toggle visibility cho từng cột
    wrapper.find('.colvis-column-toggle').on('click', function (e) {
        e.stopPropagation();
        var colIdx = $(this).data('column');
        var column = api.column(colIdx);
        var currentVisibility = column.visible();
        column.visible(!currentVisibility);

        $(this).find('.colvis-check').text(!currentVisibility ? '✓' : '');
    });

    // Hiện tất cả cột
    wrapper.find('.colvis-show-all').on('click', function (e) {
        e.stopPropagation();
        for (var i = 0; i < totalColumns - 1; i++) {
            api.column(i).visible(true);
        }
        wrapper.find('.colvis-column-toggle .colvis-check').text('✓');
    });

    // Page length change
    wrapper.find('.dt-page-length').on('change', function () {
        var val = $(this).val();
        api.page.len(parseInt(val)).draw();
    });

    // Custom search
    wrapper.find('.dt-custom-search').on('keyup', function () {
        api.search(this.value).draw();
    });
}

// Cập nhật dropdown khi visibility thay đổi
function updateColumnVisibilityDropdown(api) {
    var wrapper = $(api.table().container());
    wrapper.find('.colvis-column-toggle').each(function () {
        var colIdx = $(this).data('column');
        var isVisible = api.column(colIdx).visible();
        $(this).find('.colvis-check').text(isVisible ? '✓' : '');
    });
}

window.destroyUserDataTable = function (selector) {
    if (window.dataTableInstances[selector]) {
        $(document).off('click.dtUserMenu');
        $(window).off('scroll.dtUserMenu resize.dtUserMenu resize.dtUserResize');
        $('.dt-column-dropdown').remove();
        $('.colvis-dropdown-custom').remove();
        $('.dt-custom-toolbar').remove();
        window.dataTableInstances[selector].destroy();
        delete window.dataTableInstances[selector];
        delete window.selectedUserRows[selector];
    }
};

window.reinitUserDataTable = function (selector) {
    window.destroyUserDataTable(selector);
    window.initUserDataTable(selector);
};






// ==========================================
// ROW MANIPULATION FUNCTIONS
// ==========================================
window.addUserRow = function (selector, rowHtml) {
    if (window.dataTableInstances[selector]) {
        var table = window.dataTableInstances[selector];

        // Tạo row mới từ HTML
        var tempDiv = document.createElement('div');
        tempDiv.innerHTML = '<table><tbody><tr>' + rowHtml + '</tr></tbody></table>';
        var newRowData = [];
        var cells = tempDiv.querySelectorAll('td');
        cells.forEach(function (cell) {
            newRowData.push(cell.innerHTML);
        });

        // Thêm row vào DataTable
        var newRow = table.row.add(newRowData).draw(false);

        // Lấy node và set data-user-id
        var rowNode = newRow.node();
        var userId = cells[0].textContent; // Id nằm ở cột đầu tiên
        $(rowNode).attr('data-user-id', userId);
        $(rowNode).attr('id', 'user-row-' + userId);

        // Highlight row mới
        $(rowNode).addClass('row-highlight-new');
        setTimeout(function () {
            $(rowNode).removeClass('row-highlight-new');
        }, 2000);

        console.log('Added new row for user:', userId);
    }
};

window.updateUserRow = function (selector, userId, rowHtml) {
    if (window.dataTableInstances[selector]) {
        var table = window.dataTableInstances[selector];

        // Tìm row theo data-user-id
        var rowNode = $('tr[data-user-id="' + userId + '"]');

        if (rowNode.length > 0) {
            // Lấy DataTable row object
            var row = table.row(rowNode);

            // Parse HTML mới
            var tempDiv = document.createElement('div');
            tempDiv.innerHTML = '<table><tbody><tr>' + rowHtml + '</tr></tbody></table>';
            var newRowData = [];
            var cells = tempDiv.querySelectorAll('td');
            cells.forEach(function (cell) {
                newRowData.push(cell.innerHTML);
            });

            // Cập nhật dữ liệu row
            row.data(newRowData).draw(false);

            // Lấy lại node sau khi update và set lại attributes
            var updatedNode = row.node();
            $(updatedNode).attr('data-user-id', userId);
            $(updatedNode).attr('id', 'user-row-' + userId);

            // Highlight row đã update
            $(updatedNode).addClass('row-highlight-update');
            setTimeout(function () {
                $(updatedNode).removeClass('row-highlight-update');
            }, 2000);

            console.log('Updated row for user:', userId);
        } else {
            console.warn('Row not found for user:', userId);
        }
    }
};

window.removeUserRow = function (selector, userId) {
    if (window.dataTableInstances[selector]) {
        var table = window.dataTableInstances[selector];

        // Tìm row theo data-user-id
        var rowNode = $('tr[data-user-id="' + userId + '"]');

        if (rowNode.length > 0) {
            // Thêm animation trước khi xóa
            $(rowNode).addClass('row-highlight-delete');

            setTimeout(function () {
                // Xóa row khỏi DataTable
                table.row(rowNode).remove().draw(false);
                console.log('Removed row for user:', userId);
            }, 300);
        } else {
            console.warn('Row not found for user:', userId);
        }
    }
};



// Thêm vào đầu file, sau các biến global
window.blazorInstance = null;

window.registerBlazorInstance = function (instance) {
    window.blazorInstance = instance;
    console.log('Blazor instance registered');
};

// Sửa function createCustomToolbar - thêm event cho nút Thêm Mới
function createCustomToolbar(api, wrapper, columnNames, totalColumns) {
    var toolbarHtml = `
        <div class="dt-custom-toolbar">
            <div class="dt-toolbar-left">
                <div class="colvis-wrapper">
                    <button type="button" class="btn btn-secondary btn-sm colvis-btn-custom">
                        <i class="feather icon-columns"></i> Cột Hiển Thị
                        <i class="feather icon-chevron-down ms-1"></i>
                    </button>
                    <div class="colvis-dropdown-custom">
                        <div class="colvis-item colvis-show-all">
                            <i class="feather icon-eye"></i>
                            <span>Hiện tất cả</span>
                        </div>
                        <div class="colvis-divider"></div>
                        <div class="colvis-columns-list"></div>
                    </div>
                </div>
                <div class="dt-length-wrapper">
                    <select class="form-select form-select-sm dt-page-length">
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                        <option value="-1">Tất cả</option>
                    </select>
                    <span>bản ghi</span>
                </div>
            </div>
            <div class="dt-toolbar-right">
                <div class="dt-search-wrapper">
                    <label>Tìm kiếm:</label>
                    <input type="search" class="form-control form-control-sm dt-custom-search" placeholder="Nhập từ khóa...">
                </div>
                <button type="button" class="btn btn-primary btn-sm dt-add-new-btn" id="btnAddNewUser">
                    <i class="feather icon-plus"></i> Thêm Mới
                </button>
            </div>
        </div>
    `;

    wrapper.prepend(toolbarHtml);

    // Tạo danh sách các cột cho column visibility
    var columnsList = wrapper.find('.colvis-columns-list');
    for (var i = 0; i < totalColumns - 1; i++) {
        var isVisible = api.column(i).visible();
        var itemHtml = `
            <div class="colvis-item colvis-column-toggle" data-column="${i}">
                <span class="colvis-check">${isVisible ? '✓' : ''}</span>
                <span class="colvis-name">${columnNames[i]}</span>
            </div>
        `;
        columnsList.append(itemHtml);
    }

    // Toggle column visibility dropdown
    wrapper.find('.colvis-btn-custom').on('click', function (e) {
        e.stopPropagation();
        $('.dt-column-dropdown').removeClass('show');
        wrapper.find('.colvis-dropdown-custom').toggleClass('show');
    });

    // Toggle visibility cho từng cột
    wrapper.find('.colvis-column-toggle').on('click', function (e) {
        e.stopPropagation();
        var colIdx = $(this).data('column');
        var column = api.column(colIdx);
        var currentVisibility = column.visible();
        column.visible(!currentVisibility);
        $(this).find('.colvis-check').text(!currentVisibility ? '✓' : '');
    });

    // Hiện tất cả cột
    wrapper.find('.colvis-show-all').on('click', function (e) {
        e.stopPropagation();
        for (var i = 0; i < totalColumns - 1; i++) {
            api.column(i).visible(true);
        }
        wrapper.find('.colvis-column-toggle .colvis-check').text('✓');
    });

    // Page length change
    wrapper.find('.dt-page-length').on('change', function () {
        var val = $(this).val();
        api.page.len(parseInt(val)).draw();
    });

    // Custom search
    wrapper.find('.dt-custom-search').on('keyup', function () {
        api.search(this.value).draw();
    });

    // Nút Thêm Mới - gọi Blazor method
    wrapper.find('#btnAddNewUser').on('click', function (e) {
        e.preventDefault();
        e.stopPropagation();

        if (window.blazorInstance) {
            window.blazorInstance.invokeMethodAsync('OpenAddModal');
        } else {
            console.error('Blazor instance not registered');
        }
    });
}




// ==========================================
// DATATABLE ROW MANIPULATION - LOCAL STATE
// ==========================================

/**
 * Thêm row mới vào DataTable mà không reload
 */
window.dtAddRow = function (selector, rowData, userId) {
    var table = window.dataTableInstances[selector];
    if (!table) {
        console.warn('DataTable not found:', selector);
        return;
    }

    try {
        // Thêm row mới
        var newRow = table.row.add(rowData);

        // Draw lại DataTable (chỉ phần cần thiết)
        newRow.draw(false);

        // Lấy node và set data attribute
        var rowNode = newRow.node();
        if (rowNode) {
            $(rowNode).attr('data-user-id', userId);

            // Highlight row mới
            $(rowNode).addClass('row-added');
            setTimeout(function () {
                $(rowNode).removeClass('row-added');
            }, 2000);

            // Bind event cho action buttons
            bindRowActionEvents(rowNode);
        }

        console.log('Row added successfully:', userId);
    } catch (error) {
        console.error('Error adding row:', error);
    }
};

/**
 * Cập nhật row trong DataTable mà không reload
 */
window.dtUpdateRow = function (selector, userId, rowData) {
    var table = window.dataTableInstances[selector];
    if (!table) {
        console.warn('DataTable not found:', selector);
        return;
    }

    try {
        // Tìm row theo data-user-id
        var rowNode = $(selector + ' tbody tr[data-user-id="' + userId + '"]');

        if (rowNode.length > 0) {
            var row = table.row(rowNode);

            // Cập nhật data
            row.data(rowData);

            // Draw lại (chỉ row đó)
            row.draw(false);

            // Lấy lại node sau khi update
            var updatedNode = row.node();
            if (updatedNode) {
                $(updatedNode).attr('data-user-id', userId);

                // Highlight row đã update
                $(updatedNode).addClass('row-updated');
                setTimeout(function () {
                    $(updatedNode).removeClass('row-updated');
                }, 2000);

                // Re-bind event cho action buttons
                bindRowActionEvents(updatedNode);
            }

            console.log('Row updated successfully:', userId);
        } else {
            console.warn('Row not found for userId:', userId);
        }
    } catch (error) {
        console.error('Error updating row:', error);
    }
};

/**
 * Xóa row khỏi DataTable mà không reload
 */
window.dtRemoveRow = function (selector, userId) {
    var table = window.dataTableInstances[selector];
    if (!table) {
        console.warn('DataTable not found:', selector);
        return;
    }

    try {
        // Tìm row theo data-user-id
        var rowNode = $(selector + ' tbody tr[data-user-id="' + userId + '"]');

        if (rowNode.length > 0) {
            // Thêm animation trước khi xóa
            $(rowNode).addClass('row-removing');

            setTimeout(function () {
                var row = table.row(rowNode);
                row.remove().draw(false);
                console.log('Row removed successfully:', userId);
            }, 300);
        } else {
            console.warn('Row not found for userId:', userId);
        }
    } catch (error) {
        console.error('Error removing row:', error);
    }
};

/**
 * Bind event cho action buttons trong row
 */
function bindRowActionEvents(rowNode) {
    if (!rowNode || !window.blazorInstance) return;

    // Edit button
    $(rowNode).find('.btn-edit-user').off('click').on('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var userId = $(this).data('user-id');
        if (userId && window.blazorInstance) {
            window.blazorInstance.invokeMethodAsync('OpenEditModalById', userId.toString());
        }
    });

    // Delete button
    $(rowNode).find('.btn-delete-user').off('click').on('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var userId = $(this).data('user-id');
        if (userId && window.blazorInstance) {
            window.blazorInstance.invokeMethodAsync('OpenDeleteModalById', userId.toString());
        }
    });
}

/**
 * Bind events cho tất cả rows hiện có (gọi sau khi init DataTable)
 */
window.bindAllRowEvents = function (selector) {
    $(selector + ' tbody tr').each(function () {
        bindRowActionEvents(this);
    });
};