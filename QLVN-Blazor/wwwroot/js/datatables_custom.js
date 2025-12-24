window.dataTableInstances = {};
window.selectedUserRows = {};
window.blazorInstance = null;

// Register Blazor instance
window.registerBlazorInstance = function (instance) {
    window.blazorInstance = instance;
    console.log('✅ Blazor instance registered');
};

// ==========================================
// USER DATA TABLE - FULL FEATURES
// ==========================================
window.initUserDataTable = function (selector) {
    console.log('🚀 Initializing UserDataTable:', selector);

    if ($.fn.DataTable.isDataTable(selector)) {
        console.log('⚠️ Destroying existing DataTable');
        $(selector).DataTable().destroy();
    }

    // Clean up old elements
    $('.dt-column-dropdown').remove();
    $('.colvis-dropdown-custom').remove();
    $('.dt-custom-toolbar').remove();

    var viewportHeight = $(window).height();
    var scrollHeight = Math.max(200, Math.min(500, viewportHeight * 0.5));

    var columnNames = [
        'Id', 'Nhóm', 'Tên', 'Giới tính', 'Tên đăng nhập',
        'Email', 'Điện thoại', 'CMND/CCCD', 'Địa chỉ', 'Hình ảnh',
        'Ghi chú', 'Trạng thái', 'Ngày tạo', 'Người tạo', 'Ngày cập nhật', 'Người cập nhật',
        'Hành động'
    ];

    var defaultHiddenColumns = [3, 7, 8, 9, 10, 13, 14, 15];

    const table = $(selector).DataTable({
        responsive: false,
        searching: false,
        ordering: true,
        info: false,
        paging: false,
        lengthChange: false,
        scrollY: scrollHeight + 'px',
        scrollX: true,
        scrollCollapse: true,
        autoWidth: false,

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
            bottomStart: null,
            bottomEnd: null
        },

        language: {
            zeroRecords: "Không tìm thấy dữ liệu phù hợp",
            paginate: {
                first: '«',
                last: '»',
                next: '›',
                previous: '‹'
            }
        },

        columnDefs: [
            { orderable: false, targets: -1 },
            { visible: false, targets: defaultHiddenColumns },
            { width: '80px', targets: 0 },
            { width: '120px', targets: -1 }
        ],

        drawCallback: function (settings) {
            console.log('📊 DataTable drawn');
            // Re-bind events after draw
            bindAllRowEvents(selector);
        },

        initComplete: function () {
            console.log('✅ DataTable initialized');
            var api = this.api();
            var wrapper = $(api.table().container());
            var totalColumns = api.columns().nodes().length;

            // Create custom toolbar
            createCustomToolbar(api, wrapper, columnNames, totalColumns);

            // Restore page size
            var savedPageSize = localStorage.getItem('userTablePageSize') || '10';
            wrapper.find('.dt-page-length').val(savedPageSize);

            // Column menus
            api.columns().every(function (index) {
                var column = this;
                var header = $(column.header());

                if (index === totalColumns - 1) return;
                if (header.find('.dt-column-menu').length > 0) return;

                createColumnMenu(column, header, index);
            });

            // Bind row events
            bindAllRowEvents(selector);

            // Close dropdowns on outside click
            $(document).off('click.dtUserMenu').on('click.dtUserMenu', function (e) {
                if (!$(e.target).closest('.dt-column-menu, .dt-column-dropdown, .colvis-btn-custom, .colvis-dropdown-custom').length) {
                    $('.dt-column-dropdown').removeClass('show');
                    $('.colvis-dropdown-custom').removeClass('show');
                }
            });

            $(window).off('scroll.dtUserMenu resize.dtUserMenu').on('scroll.dtUserMenu resize.dtUserMenu', function () {
                $('.dt-column-dropdown').removeClass('show');
                $('.colvis-dropdown-custom').removeClass('show');
            });
        }
    });

    // Store instance
    window.dataTableInstances[selector] = table;
    window.selectedUserRows[selector] = [];

    // Selection events
    table.on('select deselect', function (e, dt, type, indexes) {
        if (type === 'row') {
            const selectedRows = table.rows({ selected: true }).nodes();
            window.selectedUserRows[selector] = [];

            $(selectedRows).each(function () {
                const userId = $(this).data('user-id');
                if (userId) {
                    window.selectedUserRows[selector].push(userId);
                }
            });

            console.log('✅ Selected rows:', window.selectedUserRows[selector]);
        }
    });

    // Window resize
    $(window).off('resize.dtUserResize').on('resize.dtUserResize', function () {
        if (window.dataTableInstances[selector]) {
            window.dataTableInstances[selector].columns.adjust();
        }
    });

    console.log('✅ UserDataTable initialized successfully');
};

// ==========================================
// CREATE CUSTOM TOOLBAR
// ==========================================
function createCustomToolbar(api, wrapper, columnNames, totalColumns) {
    var toolbarHtml = `
        <div class="dt-custom-toolbar" style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 0;
            margin-bottom: 15px;
            border-bottom: 1px solid #e0e0e0;
        ">
            <div class="dt-toolbar-left" style="display: flex; gap: 15px; align-items: center;">
                <div class="colvis-wrapper" style="position: relative;">
                    <button type="button" class="btn btn-secondary btn-sm colvis-btn-custom" style="
                        display: flex;
                        align-items: center;
                        gap: 8px;
                    ">
                        <i class="feather icon-columns"></i>
                        <span>Cột Hiển Thị</span>
                        <i class="feather icon-chevron-down" style="font-size: 12px;"></i>
                    </button>
                    <div class="colvis-dropdown-custom" style="
                        position: absolute;
                        top: 100%;
                        left: 0;
                        margin-top: 5px;
                        background: white;
                        border: 1px solid #ddd;
                        border-radius: 6px;
                        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                        z-index: 9999;
                        min-width: 220px;
                        max-height: 400px;
                        overflow-y: auto;
                        display: none;
                    ">
                        <div class="colvis-item colvis-show-all" style="
                            padding: 12px 16px;
                            cursor: pointer;
                            border-bottom: 1px solid #eee;
                            display: flex;
                            align-items: center;
                            gap: 10px;
                            font-weight: 600;
                            color: #4680ff;
                        ">
                            <i class="feather icon-eye"></i>
                            <span>Hiện tất cả</span>
                        </div>
                        <div class="colvis-columns-list"></div>
                    </div>
                </div>
                <div class="dt-length-wrapper" style="display: flex; gap: 8px; align-items: center;">
                    <select class="form-select form-select-sm dt-page-length" style="width: auto;">
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                    </select>
                    <span style="font-size: 14px; color: #666;">bản ghi</span>
                </div>
            </div>
            <div class="dt-toolbar-right" style="display: flex; gap: 15px; align-items: center;">
                <div class="dt-search-wrapper" style="display: flex; gap: 8px; align-items: center;">
                    <label style="margin: 0; font-size: 14px; color: #666;">Tìm kiếm:</label>
                    <input type="search" class="form-control form-control-sm dt-custom-search" 
                        placeholder="Nhập từ khóa..." style="width: 250px;">
                </div>
                <button type="button" class="btn btn-primary btn-sm dt-add-new-btn" id="btnAddNewUser" style="
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    white-space: nowrap;
                ">
                    <i class="feather icon-plus"></i>
                    <span>Thêm Mới</span>
                </button>
            </div>
        </div>
    `;

    wrapper.prepend(toolbarHtml);

    // Populate column visibility list
    var columnsList = wrapper.find('.colvis-columns-list');
    for (var i = 0; i < totalColumns - 1; i++) {
        var isVisible = api.column(i).visible();
        var itemHtml = `
            <div class="colvis-item colvis-column-toggle" data-column="${i}" style="
                padding: 10px 16px;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 10px;
                transition: background 0.2s;
            ">
                <span class="colvis-check" style="
                    width: 18px;
                    height: 18px;
                    border: 2px solid #ddd;
                    border-radius: 3px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 12px;
                    color: #4680ff;
                    font-weight: bold;
                ">${isVisible ? '✓' : ''}</span>
                <span class="colvis-name" style="font-size: 14px;">${columnNames[i]}</span>
            </div>
        `;
        columnsList.append(itemHtml);
    }

    // Add hover effect
    columnsList.on('mouseenter', '.colvis-column-toggle', function () {
        $(this).css('background', '#f5f5f5');
    }).on('mouseleave', '.colvis-column-toggle', function () {
        $(this).css('background', 'white');
    });

    // Column visibility button
    wrapper.find('.colvis-btn-custom').on('click', function (e) {
        e.stopPropagation();
        $('.dt-column-dropdown').removeClass('show');
        var dropdown = wrapper.find('.colvis-dropdown-custom');
        if (dropdown.is(':visible')) {
            dropdown.hide();
        } else {
            dropdown.show();
        }
    });

    // Toggle column visibility - FIXED
    wrapper.find('.colvis-column-toggle').on('click', function (e) {
        e.stopPropagation();
        var colIdx = $(this).data('column');
        var column = api.column(colIdx);
        var currentVisibility = column.visible();

        // Toggle visibility
        column.visible(!currentVisibility);

        // Update checkbox
        var check = $(this).find('.colvis-check');
        if (!currentVisibility) {
            check.text('✓');
        } else {
            check.text('');
        }

        // Keep dropdown open
        console.log('✅ Column visibility toggled:', columnNames[colIdx], !currentVisibility);
    });

    // Show all columns
    wrapper.find('.colvis-show-all').on('click', function (e) {
        e.stopPropagation();
        for (var i = 0; i < totalColumns - 1; i++) {
            api.column(i).visible(true);
        }
        wrapper.find('.colvis-column-toggle .colvis-check').text('✓');
        wrapper.find('.colvis-dropdown-custom').hide();
        console.log('✅ All columns shown');
    });

    // Page length change
    wrapper.find('.dt-page-length').on('change', function () {
        var pageSize = parseInt($(this).val());
        localStorage.setItem('userTablePageSize', pageSize);

        if (window.blazorInstance) {
            window.blazorInstance.invokeMethodAsync('ChangePageSize', pageSize)
                .then(() => console.log('✅ Page size changed:', pageSize))
                .catch(err => console.error('❌ Page size change error:', err));
        }
    });

    // Custom search - FIXED
    var searchTimeout;
    wrapper.find('.dt-custom-search').on('input', function (e) {
        e.stopPropagation();
        var searchValue = $(this).val();

        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(function () {
            if (window.blazorInstance) {
                console.log('🔍 Searching:', searchValue);
                window.blazorInstance.invokeMethodAsync('SearchUsers', searchValue || '')
                    .then(() => console.log('✅ Search completed'))
                    .catch(err => console.error('❌ Search error:', err));
            }
        }, 500);
    });

    // Add new button
    wrapper.find('#btnAddNewUser').on('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (window.blazorInstance) {
            window.blazorInstance.invokeMethodAsync('OpenAddModal')
                .then(() => console.log('✅ Add modal opened'))
                .catch(err => console.error('❌ Add modal error:', err));
        }
    });
}

// ==========================================
// CREATE COLUMN MENU
// ==========================================
function createColumnMenu(column, header, index) {
    var menuBtn = $('<span class="dt-column-menu" title="Menu" style="cursor: pointer; margin-left: 8px;"><i class="feather icon-menu"></i></span>');

    var dropdown = $(`
        <div class="dt-column-dropdown" style="
            position: absolute;
            background: white;
            border: 1px solid #ddd;
            border-radius: 6px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 99999;
            min-width: 200px;
            display: none;
        ">
            <div class="dt-dropdown-item dt-sort-asc" style="
                padding: 10px 16px;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 10px;
                transition: background 0.2s;
            ">
                <i class="feather icon-arrow-up"></i>
                <span>Sắp xếp tăng dần</span>
            </div>
            <div class="dt-dropdown-item dt-sort-desc" style="
                padding: 10px 16px;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 10px;
                transition: background 0.2s;
            ">
                <i class="feather icon-arrow-down"></i>
                <span>Sắp xếp giảm dần</span>
            </div>
            <div class="dt-dropdown-divider" style="height: 1px; background: #eee; margin: 5px 0;"></div>
            <div class="dt-dropdown-item dt-hide-column" style="
                padding: 10px 16px;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 10px;
                transition: background 0.2s;
            ">
                <i class="feather icon-eye-off"></i>
                <span>Ẩn cột này</span>
            </div>
            <div class="dt-dropdown-divider" style="height: 1px; background: #eee; margin: 5px 0;"></div>
            <div class="dt-dropdown-section" style="padding: 10px 16px;">
                <label class="dt-dropdown-label" style="font-size: 12px; color: #666; margin-bottom: 5px; display: block;">Kiểu lọc</label>
                <select class="dt-filter-type form-select form-select-sm">
                    <option value="contains">Chứa</option>
                    <option value="equals">Bằng</option>
                    <option value="starts">Bắt đầu với</option>
                    <option value="ends">Kết thúc với</option>
                </select>
            </div>
            <div class="dt-dropdown-filter" style="padding: 0 16px 10px;">
                <input type="text" class="dt-filter-input form-control form-control-sm" placeholder="Nhập giá trị lọc...">
            </div>
            <div class="dt-dropdown-item dt-clear-filter" style="
                padding: 10px 16px;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 10px;
                border-top: 1px solid #eee;
                transition: background 0.2s;
            ">
                <i class="feather icon-x-circle"></i>
                <span>Xóa bộ lọc</span>
            </div>
        </div>
    `);

    header.append(menuBtn);
    $('body').append(dropdown);

    // Add hover effects
    dropdown.find('.dt-dropdown-item').on('mouseenter', function () {
        $(this).css('background', '#f5f5f5');
    }).on('mouseleave', function () {
        $(this).css('background', 'white');
    });

    // Position dropdown
    function positionDropdown() {
        var btnOffset = menuBtn.offset();
        var btnHeight = menuBtn.outerHeight();
        var dropdownWidth = dropdown.outerWidth();
        var left = btnOffset.left - dropdownWidth + menuBtn.outerWidth();

        dropdown.css({
            top: btnOffset.top + btnHeight + 5,
            left: Math.max(10, left),
            display: 'block'
        });
    }

    // Toggle dropdown
    menuBtn.on('click', function (e) {
        e.stopPropagation();
        e.preventDefault();

        $('.dt-column-dropdown').not(dropdown).hide();
        $('.colvis-dropdown-custom').hide();

        if (dropdown.is(':visible')) {
            dropdown.hide();
        } else {
            positionDropdown();
        }
    });

    // Sort ascending
    dropdown.find('.dt-sort-asc').on('click', function (e) {
        e.stopPropagation();
        column.order('asc').draw();
        dropdown.hide();
        console.log('✅ Sorted ascending');
    });

    // Sort descending
    dropdown.find('.dt-sort-desc').on('click', function (e) {
        e.stopPropagation();
        column.order('desc').draw();
        dropdown.hide();
        console.log('✅ Sorted descending');
    });

    // Hide column
    dropdown.find('.dt-hide-column').on('click', function (e) {
        e.stopPropagation();
        column.visible(false);
        dropdown.hide();
        console.log('✅ Column hidden');
    });

    // Filter - FIXED
    var filterTimeout;
    dropdown.find('.dt-filter-input').on('input', function (e) {
        e.stopPropagation();
        clearTimeout(filterTimeout);

        var filterType = dropdown.find('.dt-filter-type').val();
        var filterValue = $(this).val();

        filterTimeout = setTimeout(function () {
            if (!filterValue) {
                column.search('').draw();
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
            console.log('✅ Filter applied:', filterType, filterValue);
        }, 400);
    });

    // Clear filter
    dropdown.find('.dt-clear-filter').on('click', function (e) {
        e.stopPropagation();
        dropdown.find('.dt-filter-input').val('');
        dropdown.find('.dt-filter-type').val('contains');
        column.search('').draw();
        dropdown.hide();
        console.log('✅ Filter cleared');
    });

    // Prevent closing
    dropdown.on('click mousedown', function (e) {
        e.stopPropagation();
    });
}

// ==========================================
// BIND ROW EVENTS
// ==========================================
function bindAllRowEvents(selector) {
    $(selector + ' tbody tr').each(function () {
        bindRowActionEvents(this);
    });
}

function bindRowActionEvents(rowNode) {
    if (!rowNode || !window.blazorInstance) return;

    // Edit button
    $(rowNode).find('.btn-edit-user').off('click').on('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var userId = $(this).data('user-id') || $(this).closest('tr').data('user-id');
        if (userId && window.blazorInstance) {
            console.log('✏️ Edit user:', userId);
            window.blazorInstance.invokeMethodAsync('OpenEditModalById', userId.toString());
        }
    });

    // Delete button
    $(rowNode).find('.btn-delete-user').off('click').on('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var userId = $(this).data('user-id') || $(this).closest('tr').data('user-id');
        if (userId && window.blazorInstance) {
            console.log('🗑️ Delete user:', userId);
            window.blazorInstance.invokeMethodAsync('OpenDeleteModalById', userId.toString());
        }
    });
}

// ==========================================
// DESTROY
// ==========================================
window.destroyUserDataTable = function (selector) {
    console.log('🗑️ Destroying UserDataTable:', selector);

    if (window.dataTableInstances[selector]) {
        $(document).off('click.dtUserMenu');
        $(window).off('scroll.dtUserMenu resize.dtUserMenu resize.dtUserResize');
        $('.dt-column-dropdown').remove();
        $('.colvis-dropdown-custom').remove();
        $('.dt-custom-toolbar').remove();

        window.dataTableInstances[selector].destroy();
        delete window.dataTableInstances[selector];
        delete window.selectedUserRows[selector];

        console.log('✅ DataTable destroyed');
    }
};

window.reinitUserDataTable = function (selector) {
    window.destroyUserDataTable(selector);
    window.initUserDataTable(selector);
};

// ==========================================
// HELPER FUNCTIONS
// ==========================================
window.getSelectedUserIds = function (selector) {
    return window.selectedUserRows[selector] || [];
};

window.clearTableSelection = function (selector) {
    if (window.dataTableInstances[selector]) {
        window.dataTableInstances[selector].rows().deselect();
        window.selectedUserRows[selector] = [];
    }
};





window.updateUserDataTableData = function (selector, paginatedData) {
    var table = window.dataTableInstances[selector];
    if (!table) {
        console.warn('DataTable not found for update');
        return;
    }

    try {
        // Clear existing data
        table.clear();

        // Add new data rows
        if (paginatedData && paginatedData.items && paginatedData.items.length > 0) {
            paginatedData.items.forEach(function (user) {
                var rowData = [
                    user.id,
                    user.groupId,
                    user.name,
                    getUserGenderBadge(user.gender),
                    user.userName,
                    user.email || '',
                    user.phone || '',
                    user.cmnd || '',
                    user.address || '',
                    getUserImageHtml(user.image),
                    user.note || '',
                    getUserStatusBadge(user.rowStatus),
                    formatDateTime(user.createdAt),
                    user.createdBy,
                    formatDateTime(user.updatedAt),
                    user.updatedBy,
                    getUserActionButtons(user.id)
                ];

                table.row.add(rowData);
            });
        }

        // Draw without resetting paging
        table.draw(false);

        // Re-bind events
        bindAllRowEvents(selector);

        console.log('✅ DataTable data updated smoothly');
    } catch (error) {
        console.error('❌ Error updating DataTable data:', error);
    }
};

/**
 * Add user row with smooth animation
 */
window.addUserRowSmooth = function (selector, userId) {
    var $row = $(selector + ' tbody tr[data-user-id="' + userId + '"]');

    if ($row.length > 0) {
        // Smooth fade-in and highlight
        $row.hide().fadeIn(600, function () {
            $row.addClass('row-added');
            setTimeout(function () {
                $row.removeClass('row-added');
            }, 2000);
        });
    }
};

/**
 * Update user row with smooth animation
 */
window.updateUserRowSmooth = function (selector, userId) {
    var $row = $(selector + ' tbody tr[data-user-id="' + userId + '"]');

    if ($row.length > 0) {
        // Pulse effect
        $row.addClass('row-updated');
        setTimeout(function () {
            $row.removeClass('row-updated');
        }, 1500);
    }
};

/**
 * Delete user row with smooth animation
 */
window.deleteUserRowSmooth = function (selector, userId) {
    var $row = $(selector + ' tbody tr[data-user-id="' + userId + '"]');

    if ($row.length > 0) {
        // Smooth slide out and fade
        $row.addClass('row-removing');

        return new Promise(function (resolve) {
            setTimeout(function () {
                $row.fadeOut(300, function () {
                    $(this).remove();
                    resolve();
                });
            }, 100);
        });
    }
};

// ==========================================
// HELPER FUNCTIONS FOR ROW RENDERING
// ==========================================

function getUserGenderBadge(gender) {
    if (gender === 1) {
        return '<span class="badge bg-primary">Nam</span>';
    } else if (gender === 0) {
        return '<span class="badge bg-info">Nữ</span>';
    } else {
        return '<span class="badge bg-secondary">Không xác định</span>';
    }
}

function getUserStatusBadge(rowStatus) {
    if (rowStatus === 1) {
        return '<span class="badge bg-success">Hoạt động</span>';
    } else {
        return '<span class="badge bg-danger">Ngừng hoạt động</span>';
    }
}

function getUserImageHtml(image) {
    if (image) {
        return '<img src="' + image + '" alt="Avatar" style="width: 40px; height: 40px; border-radius: 50%;" />';
    } else {
        return '<span class="text-muted">-</span>';
    }
}

function getUserActionButtons(userId) {
    return '<button class="btn btn-sm btn-warning me-1 btn-edit-user" data-user-id="' + userId + '" title="Chỉnh sửa">' +
        '<i class="feather icon-edit"></i></button>' +
        '<button class="btn btn-sm btn-danger btn-delete-user" data-user-id="' + userId + '" title="Xóa">' +
        '<i class="feather icon-trash-2"></i></button>';
}

function formatDateTime(dateString) {
    if (!dateString) return '';

    var date = new Date(dateString);
    var day = ('0' + date.getDate()).slice(-2);
    var month = ('0' + (date.getMonth() + 1)).slice(-2);
    var year = date.getFullYear();
    var hours = ('0' + date.getHours()).slice(-2);
    var minutes = ('0' + date.getMinutes()).slice(-2);

    return day + '/' + month + '/' + year + ' ' + hours + ':' + minutes;
}