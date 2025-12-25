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
        searching: true,
        ordering: true,
        info: false,
        paging: false,
        lengthChange: false,
        scrollY: scrollHeight + 'px',
        scrollX: true,
        scrollCollapse: true,
        autoWidth: false,
        fixedColumns: false,
        deferRender: true,
        
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
            bindAllRowEvents(selector);
        },

        initComplete: function () {
            console.log('✅ DataTable initialized');
            var api = this.api();
            var wrapper = $(api.table().container());
            var totalColumns = api.columns().nodes().length;

            createCustomToolbar(api, wrapper, columnNames, totalColumns);

            // Set default page size từ localStorage
            var savedPageSize = localStorage.getItem('userTablePageSize');
            if (!savedPageSize) {
                savedPageSize = '10';
                localStorage.setItem('userTablePageSize', '10');
            }
            wrapper.find('.dt-page-length').val(savedPageSize);

            api.columns().every(function (index) {
                var column = this;
                var header = $(column.header());

                if (index === totalColumns - 1) return;
                if (header.find('.dt-column-menu').length > 0) return;

                createColumnMenu(column, header, index, api);
            });

            bindAllRowEvents(selector);

            // Logic đóng dropdown - chỉ đóng khi click NGOÀI hoàn toàn
            $(document).off('click.dtUserMenu').on('click.dtUserMenu', function (e) {
                var $target = $(e.target);
                
                if ($target.closest('.dt-column-dropdown').length > 0) {
                    return;
                }
                
                if ($target.closest('.colvis-dropdown-custom').length > 0) {
                    return;
                }

                if ($target.closest('.dt-column-menu').length > 0) {
                    return;
                }
                
                if ($target.closest('.colvis-btn-custom').length > 0) {
                    return;
                }

                $('.dt-column-dropdown').hide();
                $('.colvis-dropdown-custom').hide();
            });

            $(window).off('scroll.dtUserMenu');

            setTimeout(function () {
                api.columns.adjust();
            }, 150);
        }
    });

    window.dataTableInstances[selector] = table;
    window.selectedUserRows[selector] = [];

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

    $(window).off('resize.dtUserResize');

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
                        <option value="10" selected>10</option>
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

    columnsList.on('mouseenter', '.colvis-column-toggle', function () {
        $(this).css('background', '#f5f5f5');
    }).on('mouseleave', '.colvis-column-toggle', function () {
        $(this).css('background', 'white');
    });

    wrapper.find('.colvis-btn-custom').on('click', function (e) {
        e.stopPropagation();
        e.preventDefault();
        $('.dt-column-dropdown').hide();
        var dropdown = wrapper.find('.colvis-dropdown-custom');
        if (dropdown.is(':visible')) {
            dropdown.hide();
        } else {
            dropdown.show();
        }
    });

    wrapper.find('.colvis-column-toggle').on('click', function (e) {
        e.stopPropagation();
        e.preventDefault();

        var colIdx = $(this).data('column');
        var column = api.column(colIdx);
        var currentVisibility = column.visible();

        column.visible(!currentVisibility);

        var check = $(this).find('.colvis-check');
        check.text(!currentVisibility ? '✓' : '');

        console.log('✅ Column visibility toggled:', columnNames[colIdx], !currentVisibility);
    });

    wrapper.find('.colvis-show-all').on('click', function (e) {
        e.stopPropagation();
        e.preventDefault();
        
        for (var i = 0; i < totalColumns - 1; i++) {
            api.column(i).visible(true);
        }
        wrapper.find('.colvis-column-toggle .colvis-check').text('✓');
        wrapper.find('.colvis-dropdown-custom').hide();

        console.log('✅ All columns shown');
    });

    // Page length change
    wrapper.find('.dt-page-length').off('change').on('change', function (e) {
        e.stopPropagation();
        e.preventDefault();
        
        var pageSize = parseInt($(this).val(), 10);
        
        if (isNaN(pageSize) || pageSize <= 0) {
            pageSize = 10;
        }
        
        console.log('📊 Page size selected:', pageSize);
        
        localStorage.setItem('userTablePageSize', pageSize.toString());

        if (window.blazorInstance) {
            console.log('📊 Calling Blazor ChangePageSize:', pageSize);
            window.blazorInstance.invokeMethodAsync('ChangePageSize', pageSize)
                .then(function() {
                    console.log('✅ Page size changed successfully to:', pageSize);
                })
                .catch(function(err) {
                    console.error('❌ Page size change error:', err);
                });
        } else {
            console.warn('⚠️ Blazor instance not found');
        }
    });

    // Search với debounce
    var searchTimeout;
    wrapper.find('.dt-custom-search').on('input', function (e) {
        e.stopPropagation();
        var searchValue = $(this).val();

        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(function () {
            if (window.blazorInstance) {
                console.log('🔍 Searching:', searchValue);
                window.blazorInstance.invokeMethodAsync('SearchUsers', searchValue || '')
                    .then(function() { console.log('✅ Search completed'); })
                    .catch(function(err) { console.error('❌ Search error:', err); });
            }
        }, 500);
    });

    // Add new button
    wrapper.find('#btnAddNewUser').on('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (window.blazorInstance) {
            window.blazorInstance.invokeMethodAsync('OpenAddModal')
                .then(function() { console.log('✅ Add modal opened'); })
                .catch(function(err) { console.error('❌ Add modal error:', err); });
        }
    });
}

// ==========================================
// CREATE COLUMN MENU
// ==========================================
function createColumnMenu(column, header, index, api) {
    var menuBtn = $('<span class="dt-column-menu" title="Menu" style="cursor: pointer; margin-left: 8px;"><i class="feather icon-menu"></i></span>');

    var dropdown = $(`
        <div class="dt-column-dropdown" data-column-index="${index}" style="
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

    dropdown.find('.dt-dropdown-item').on('mouseenter', function () {
        $(this).css('background', '#f5f5f5');
    }).on('mouseleave', function () {
        $(this).css('background', 'white');
    });

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

    dropdown.find('.dt-sort-asc').on('click', function (e) {
        e.stopPropagation();
        e.preventDefault();
        column.order('asc').draw(false);
        dropdown.hide();
        console.log('✅ Sorted ascending');
    });

    dropdown.find('.dt-sort-desc').on('click', function (e) {
        e.stopPropagation();
        e.preventDefault();
        column.order('desc').draw(false);
        dropdown.hide();
        console.log('✅ Sorted descending');
    });

    dropdown.find('.dt-hide-column').on('click', function (e) {
        e.stopPropagation();
        e.preventDefault();
        column.visible(false);
        dropdown.hide();
        console.log('✅ Column hidden');
    });

    var filterTimeout;
    var $filterInput = dropdown.find('.dt-filter-input');
    var $filterType = dropdown.find('.dt-filter-type');
    
    $filterInput.on('click mousedown mouseup focus blur keydown keyup keypress', function(e) {
        e.stopPropagation();
    });
    
    $filterInput.on('input', function(e) {
        e.stopPropagation();
        
        clearTimeout(filterTimeout);
        
        var filterValue = $(this).val().trim();
        var filterType = $filterType.val();
        
        filterTimeout = setTimeout(function() {
            applyColumnFilter(column, filterType, filterValue);
        }, 300);
    });

    $filterType.on('click mousedown mouseup focus change', function(e) {
        e.stopPropagation();
        
        if (e.type === 'change') {
            var filterValue = $filterInput.val().trim();
            if (filterValue) {
                var filterType = $(this).val();
                applyColumnFilter(column, filterType, filterValue);
            }
        }
    });

    dropdown.find('.dt-clear-filter').on('click', function (e) {
        e.stopPropagation();
        e.preventDefault();
        
        $filterInput.val('');
        $filterType.val('contains');
        column.search('').draw(false);
        dropdown.hide();
        
        console.log('✅ Filter cleared for column', index);
    });

    dropdown.find('.dt-dropdown-section, .dt-dropdown-filter').on('click mousedown', function(e) {
        e.stopPropagation();
    });
    
    dropdown.on('click mousedown', function(e) {
        e.stopPropagation();
    });
}

function applyColumnFilter(column, filterType, filterValue) {
    if (!filterValue) {
        column.search('').draw(false);
        return;
    }
    
    var regex = '';
    var escapedValue = $.fn.dataTable.util.escapeRegex(filterValue);
    
    switch (filterType) {
        case 'equals':
            regex = '^' + escapedValue + '$';
            break;
        case 'starts':
            regex = '^' + escapedValue;
            break;
        case 'ends':
            regex = escapedValue + '$';
            break;
        case 'contains':
        default:
            regex = escapedValue;
            break;
    }
    
    column.search(regex, true, false).draw(false);
    console.log('✅ Filter applied:', filterType, filterValue);
}

// ==========================================
// BIND ROW EVENTS
// ==========================================
function bindAllRowEvents(selector) {
    var $table = $(selector);
    if (!$table.length) return;
    
    $table.find('tbody tr').each(function () {
        bindRowActionEvents(this);
    });
}

function bindRowActionEvents(rowNode) {
    if (!rowNode || !window.blazorInstance) return;

    var $row = $(rowNode);
    
    $row.find('.btn-edit-user').off('click').on('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var userId = $(this).data('user-id') || $row.data('user-id');
        if (userId && window.blazorInstance) {
            console.log('✏️ Edit user:', userId);
            window.blazorInstance.invokeMethodAsync('OpenEditModalById', userId.toString());
        }
    });

    $row.find('.btn-delete-user').off('click').on('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var userId = $(this).data('user-id') || $row.data('user-id');
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

// Update data - cập nhật bảng qua DataTables API, không qua Blazor
window.updateUserDataTableData = function (selector, paginatedData) {
    var table = window.dataTableInstances[selector];
    if (!table) {
        console.warn('DataTable not found for update');
        return;
    }

    try {
        console.log('📊 Updating DataTable with', paginatedData?.items?.length || 0, 'items');
        
        // Lưu scroll position
        var scrollBody = $(selector).closest('.dt-scroll').find('.dt-scroll-body');
        var scrollTop = scrollBody.scrollTop();
        var scrollLeft = scrollBody.scrollLeft();

        // Clear và add data
        table.clear();

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
                    user.createdBy || '',
                    formatDateTime(user.updatedAt),
                    user.updatedBy || '',
                    getUserActionButtons(user.id)
                ];

                // Add row với createdRow callback để set data-user-id
                var rowNode = table.row.add(rowData).node();
                $(rowNode).attr('data-user-id', user.id);
            });
        }

        // Draw table
        table.draw(false);

        // Restore scroll position
        setTimeout(function() {
            scrollBody.scrollTop(scrollTop);
            scrollBody.scrollLeft(scrollLeft);
            
            // Bind events sau khi draw
            bindAllRowEvents(selector);
        }, 50);

        console.log('✅ DataTable data updated successfully');
    } catch (error) {
        console.error('❌ Error updating DataTable data:', error);
    }
};

// FIX 4: Hiệu ứng khi thêm row mới
window.addUserRowSmooth = function (selector, userId) {
    console.log('🎬 addUserRowSmooth called for:', userId);
    
    setTimeout(function () {
        var table = window.dataTableInstances[selector];
        if (!table) {
            console.warn('DataTable not found');
            return;
        }
        
        // Tìm row theo data-user-id
        var $row = $(selector).find('tbody tr[data-user-id="' + userId + '"]');
        
        if ($row.length > 0) {
            console.log('✅ Found row for animation:', userId);
            
            // Thêm class highlight
            $row.addClass('row-added');
            $row.css({
                'background-color': '#d4edda',
                'transition': 'background-color 2s ease'
            });
            
            // Xóa highlight sau 2 giây
            setTimeout(function () {
                $row.removeClass('row-added');
                $row.css('background-color', '');
            }, 2000);
        } else {
            console.warn('⚠️ Row not found for userId:', userId);
        }
    }, 200);
};

// FIX 4: Hiệu ứng khi cập nhật row
window.updateUserRowSmooth = function (selector, userId) {
    console.log('🎬 updateUserRowSmooth called for:', userId);
    
    setTimeout(function () {
        var table = window.dataTableInstances[selector];
        if (!table) {
            console.warn('DataTable not found');
            return;
        }
        
        // Tìm row theo data-user-id
        var $row = $(selector).find('tbody tr[data-user-id="' + userId + '"]');
        
        if ($row.length > 0) {
            console.log('✅ Found row for update animation:', userId);
            
            // Thêm class highlight cho update
            $row.addClass('row-updated');
            $row.css({
                'background-color': '#fff3cd',
                'transition': 'background-color 1.5s ease'
            });
            
            // Xóa highlight sau 1.5 giây
            setTimeout(function () {
                $row.removeClass('row-updated');
                $row.css('background-color', '');
            }, 1500);
        } else {
            console.warn('⚠️ Row not found for update userId:', userId);
        }
    }, 200);
};

// Hiệu ứng khi xóa row
window.deleteUserRowSmooth = function (selector, userId) {
    console.log('🎬 deleteUserRowSmooth called for:', userId);
    
    return new Promise(function (resolve) {
        var $row = $(selector).find('tbody tr[data-user-id="' + userId + '"]');

        if ($row.length > 0) {
            console.log('✅ Found row for delete animation:', userId);
            
            $row.addClass('row-removing');
            $row.css({
                'background-color': '#f8d7da',
                'opacity': '0.7',
                'transition': 'all 0.3s ease'
            });

            setTimeout(function () {
                $row.fadeOut(300, function () {
                    console.log('✅ Row fade out complete');
                    resolve();
                });
            }, 100);
        } else {
            console.warn('⚠️ Row not found for delete userId:', userId);
            resolve();
        }
    });
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

    try {
        var date = new Date(dateString);
        if (isNaN(date.getTime())) return '';
        
        var day = ('0' + date.getDate()).slice(-2);
        var month = ('0' + (date.getMonth() + 1)).slice(-2);
        var year = date.getFullYear();
        var hours = ('0' + date.getHours()).slice(-2);
        var minutes = ('0' + date.getMinutes()).slice(-2);

        return day + '/' + month + '/' + year + ' ' + hours + ':' + minutes;
    } catch (e) {
        return '';
    }
}