var userDataTable;

window.initUserDataTable = function () {
    if ($.fn.dataTable.isDataTable('#user-datatable')) {
        userDataTable = $('#user-datatable').DataTable();
        return;
    }

    userDataTable = $('#user-datatable').DataTable({
        responsive: true,
        pageLength: 10,
        autoWidth: false,
        language: {
            url: '//cdn.datatables.net/plug-ins/1.13.6/i18n/vi.json'
        },
        columnDefs: [
            {
                targets: -1,
                orderable: false
            }
        ]
    });
};

window.reinitUserDataTable = function () {
    if (userDataTable) {
        userDataTable.destroy();
    }
    setTimeout(function () {
        window.initUserDataTable();
    }, 200);
};