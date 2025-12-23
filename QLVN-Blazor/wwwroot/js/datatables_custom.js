window.dataTableInstances = {};

window.initDataTable = (selector, options = {}) => {
    if ($.fn.DataTable.isDataTable(selector)) {
        $(selector).DataTable().destroy();
    }

    const defaultOptions = {
        language: {
            url: '//cdn.datatables.net/plug-ins/1.13.8/i18n/vi.json' // Tiếng Việt (tùy chọn)
        },
        pageLength: 10,
        lengthMenu: [5, 10, 25, 50, 100],
        responsive: true,
        order: [[0, 'desc']]
    };

    const mergedOptions = { ...defaultOptions, ...options };

    const table = $(selector).DataTable(mergedOptions);
    window.dataTableInstances[selector] = table;
    return table;
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


// Thêm hàm update row cụ thể bằng ID
window.updateDataTableRow = (selector, userId, updatedUser) => {
    const table = window.dataTableInstances[selector];
    if (!table) return;

    // Tìm row bằng data-user-id attribute (từ Razor)
    const row = $(selector + ' tbody tr[data-user-id="' + userId + '"]');
    if (row.length === 0) return;

    // Update cells (chỉ các cột data: ID không thay đổi, Name, Email, Phone)
    row.find('td:nth-child(2)').text(updatedUser.name || ''); // Tên
    row.find('td:nth-child(3)').text(updatedUser.email || ''); // Email
    row.find('td:nth-child(4)').text(updatedUser.phone || ''); // Phone

    // Cập nhật data cho row (để sort/search hoạt động đúng)
    const rowIndex = table.row(row).index();
    if (rowIndex !== null) {
        table.row(rowIndex).data([
            updatedUser.id,
            updatedUser.name,
            updatedUser.email,
            updatedUser.phone,
            row.find('td:last-child').html() // Giữ nguyên action buttons
        ]);
    }

    table.draw(false); // Redraw mà không reset paging
};

// Thêm hàm remove row cụ thể (cho delete)
window.removeDataTableRow = (selector, userId) => {
    const table = window.dataTableInstances[selector];
    if (!table) return;

    const row = $(selector + ' tbody tr[data-user-id="' + userId + '"]');
    if (row.length === 0) return;

    table.row(row).remove().draw(false); // Remove và redraw không reset
};

// Thêm hàm add row mới (cho create, nhưng vì create reload full, có thể optional)
window.addDataTableRow = (selector, newUser) => {
    const table = window.dataTableInstances[selector];
    if (!table) return;

    const newRowData = [
        newUser.id,
        newUser.name,
        newUser.email,
        newUser.phone,
        '<button class="btn btn-sm btn-warning" onclick="editUser(\'' + newUser.id + '\')">Sửa</button> <button class="btn btn-sm btn-danger" onclick="deleteUser(\'' + newUser.id + '\')">Xóa</button>'
    ];
    table.row.add(newRowData).draw(false);
};