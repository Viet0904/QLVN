window.dataTableInstances = {};

window.initDataTable = (selector, options = {}) => {
    if ($.fn.DataTable.isDataTable(selector)) {
        $(selector).DataTable().destroy();
    }

    const defaultOptions = {
        // Layout giống demo: length/filter top, info/pagination bottom
        dom: '<"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>>rt<"row"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>',
        language: {
            url: '//cdn.datatables.net/plug-ins/1.13.8/i18n/vi.json' // Labels tiếng Việt: "Tìm kiếm:", "Hiển thị X đến Y"
        },
        pageLength: 10,
        lengthMenu: [[10, 25, 50, 100, -1], [10, 25, 50, 100, "Tất cả"]], // Dropdown entries per page
        searching: true, // Bật search box
        ordering: true, // Bật sort arrows trên header
        order: [[0, 'desc']], // Default sort ID desc
        info: true, // Bật info "Hiển thị 1 đến 10 của X entries"
        paging: true, // Bật pagination
        pagingType: 'full_numbers', // Pagination với numbers 1 2 3 ... >
        responsive: true, // Responsive columns
        // Không thêm buttons để tránh bloat; extend nếu cần
    };

    const mergedOptions = { ...defaultOptions, ...options };

    try {
        const table = $(selector).DataTable(mergedOptions);
        window.dataTableInstances[selector] = table;
        console.log('DataTable full features enabled: search, sort, pagination, info.');
        return table;
    } catch (error) {
        console.error('Lỗi init DataTable:', error);
    }
};

window.destroyDataTable = (selector) => {
    if (window.dataTableInstances[selector]) {
        window.dataTableInstances[selector].destroy();
        delete window.dataTableInstances[selector];
    }
};

window.reinitDataTable = (selector, options) => {
    destroyDataTable(selector);
    return initDataTable(selector, options);
};

window.updateDataTableRow = (selector, userId, updatedUser) => {
    const table = window.dataTableInstances[selector];
    if (!table) return;

    const row = $(selector + ' tbody tr[data-user-id="' + userId + '"]');
    if (row.length === 0) return;

    row.find('td:nth-child(2)').text(updatedUser.name || '');
    row.find('td:nth-child(3)').text(updatedUser.email || '');
    row.find('td:nth-child(4)').text(updatedUser.phone || '');

    const rowIndex = table.row(row).index();
    if (rowIndex !== null) {
        table.row(rowIndex).data([
            updatedUser.id,
            updatedUser.name,
            updatedUser.email,
            updatedUser.phone,
            row.find('td:last-child').html()
        ]);
    }

    table.draw(false);
};

window.removeDataTableRow = (selector, userId) => {
    const table = window.dataTableInstances[selector];
    if (!table) return;

    const row = $(selector + ' tbody tr[data-user-id="' + userId + '"]');
    if (row.length === 0) return;

    table.row(row).remove().draw(false);
};