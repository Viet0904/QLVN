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