var userDataTable;

window.initUserDataTable = function () {
    // Kiểm tra nếu đã tồn tại DataTable thì không khởi tạo lại
    if ($.fn.dataTable.isDataTable('#footer-search')) {
        userDataTable = $('#footer-search').DataTable();
        return;
    }

    // Khởi tạo DataTable
    userDataTable = $('#footer-search').DataTable({
        responsive: true,
        pageLength: 10,
        autoWidth: false,
        order: [[1, 'asc']], // Sắp xếp mặc định theo cột Tên
        language: {
            url: '//cdn.datatables.net/plug-ins/1.13.6/i18n/vi.json'
        },
        columnDefs: [
            {
                targets: -1, // Cột cuối cùng (Thao tác)
                orderable: false,
                searchable: false
            }
        ],
        initComplete: function () {
            // Thiết lập tính năng tìm kiếm cho từng cột tại footer
            this.api().columns().every(function () {
                var that = this;
                $('input', this.footer()).on('keyup change clear', function () {
                    if (that.search() !== this.value) {
                        that
                            .search(this.value)
                            .draw();
                    }
                });

                // Ngăn sự kiện click vào input gây ra sort cột
                $('input', this.footer()).on('click', function (e) {
                    e.stopPropagation();
                });
            });
        }
    });
};

window.reinitUserDataTable = function () {
    if (userDataTable) {
        userDataTable.destroy();
        userDataTable = null;
    }
    // Chờ một khoảng thời gian ngắn để Blazor render lại DOM
    setTimeout(function () {
        window.initUserDataTable();
    }, 300);
};