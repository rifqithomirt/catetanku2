requirejs(['/assets/js/uuid.min.js'],
    function (uuid) {
        $(document).ready(async function () {
            var xml = await R.agetFile('/pages/products/index.xml', '');
            $('#content-body-section').html(xml);
            var sql = `SELECT (catetanku.products.id) AS _id, column_json(catetanku.products.doc) AS doc
            FROM catetanku.products
            LIMIT 1000`;
            var resQueryProducts = await R.aget(`http://${R.host}:${R.port}/webapi/query/?sql=${ encodeURIComponent(sql)}`, '');
            var objDataProducts = resQueryProducts.results.map(function (obj) {
                return obj.doc;
            })
            $(function () {
                "use strict";
                var e = $(".datatables-basic"),
                    r = "/pages/products/";
                if (("laravel" === $("body").attr("data-framework") && (r = $("body").attr("data-asset-path")), e.length)) {
                    var o = e.DataTable({
                        //ajax: r + "table-datatable.json",
                        data: objDataProducts,
                        columns: [{
                            data: "Nama Barang"
                        }, {
                            data: "Kategori"
                        }, {
                            data: "Berat"
                        }, {
                            data: "Kadar"
                        }, {
                            data: "Harga"
                        }, {
                            data: ""
                        }, {
                            data: ""
                        }],
                        columnDefs: [
                            /*{
                                                    className: "control",
                                                    orderable: !1,
                                                    responsivePriority: 2,
                                                    targets: 0
                                                },*/
                            {
                                targets: 1,
                                orderable: !1,
                                responsivePriority: 3,
                                render: function (e, a, t, s) {
                                    //console.log(e)
                                    return (e);
                                },
                            },
                            {
                                targets: 2,
                                render: function (e, a, t, s) {
                                    return `<span class="text-right" data-berat="${e}" style="width:100%;">${e} gr</span>`;
                                },
                            },
                            {
                                targets: 4,
                                orderable: !1,
                                render: function (e, a, t, s) {
                                    return `<span data-price="${e}">Rp. ${R.numberToRupiah(e)}</span>`;
                                },
                            },
                            /*{
                                targets: 3,
                                responsivePriority: 4,
                                render: function (e, a, t, s) {
                                    var l = t.avatar,
                                        o = t.full_name,
                                        n = t.post;
                                    if (l) var d = '<img src="' + r + "images/avatars/" + l + '" alt="Avatar" width="32" height="32">';
                                    else {
                                        var i = ["success", "danger", "warning", "info", "dark", "primary", "secondary"][t.status],
                                            c = (o = t.full_name).match(/\b\w/g) || [];
                                        d = '<span class="avatar-content">' + (c = ((c.shift() || "") + (c.pop() || "")).toUpperCase()) + "</span>";
                                    }
                                    return (
                                        '<div class="d-flex justify-content-left align-items-center"><div class="avatar ' +
                                        ("" === l ? " bg-light-" + i + " " : "") +
                                        ' mr-1">' +
                                        d +
                                        '</div><div class="d-flex flex-column"><span class="emp_name text-truncate font-weight-bold">' +
                                        o +
                                        '</span><small class="emp_post text-truncate text-muted">' +
                                        n +
                                        "</small></div></div>"
                                    );
                                },
                            },*/
                            {
                                responsivePriority: 1,
                                targets: 3
                            },
                            {
                                targets: -2,
                                render: function (e, a, t, s) {
                                    //console.log(e, a, t, s)
                                    return `<span class="badge badge-pill badge-light-success">${t.Status}</span>`;
                                },
                            },
                            {
                                targets: -1,
                                title: "Actions",
                                orderable: !1,
                                render: function (e, a, t, s) {
                                    return (
                                        '<div class="d-inline-flex"><a class="pr-1 dropdown-toggle hide-arrow text-primary" data-toggle="dropdown">' +
                                        feather.icons["more-vertical"].toSvg({
                                            class: "font-small-4"
                                        }) +
                                        '</a><div class="dropdown-menu dropdown-menu-right"><a href="javascript:;" class="dropdown-item" data-toggle="modal" data-target="#modals-detail-record">' +
                                        feather.icons["file-text"].toSvg({
                                            class: "font-small-4 mr-50"
                                        }) +
                                        'Details</a><a href="javascript:;" class="dropdown-item delete-record">' +
                                        feather.icons["trash-2"].toSvg({
                                            class: "font-small-4 mr-50"
                                        }) +
                                        'Delete</a></div></div><a href="javascript:;" class="item-edit" data-toggle="modal" data-target="#modals-edit-record">' +
                                        feather.icons.edit.toSvg({
                                            class: "font-small-4"
                                        }) +
                                        "</a>"
                                    );
                                },
                            },
                        ],
                        order: [
                            [2, "desc"]
                        ],
                        dom: '<"card-header border-bottom p-1"<"head-label"><"dt-action-buttons text-right"B>><"d-flex justify-content-between align-items-center mx-0 row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>>t<"d-flex justify-content-between mx-0 row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>',
                        displayLength: 7,
                        lengthMenu: [7, 10, 25, 50, 75, 100],
                        buttons: [{
                                extend: "collection",
                                className: "btn btn-outline-secondary dropdown-toggle mr-2",
                                text: feather.icons.share.toSvg({
                                    class: "font-small-4 mr-50"
                                }) + "Export",
                                buttons: [{
                                        extend: "print",
                                        text: feather.icons.printer.toSvg({
                                            class: "font-small-4 mr-50"
                                        }) + "Print",
                                        className: "dropdown-item",
                                        exportOptions: {
                                            columns: [3, 4, 5, 6, 7]
                                        }
                                    },
                                    {
                                        extend: "csv",
                                        text: feather.icons["file-text"].toSvg({
                                            class: "font-small-4 mr-50"
                                        }) + "Csv",
                                        className: "dropdown-item",
                                        exportOptions: {
                                            columns: [3, 4, 5, 6, 7]
                                        }
                                    },
                                    {
                                        extend: "excel",
                                        text: feather.icons.file.toSvg({
                                            class: "font-small-4 mr-50"
                                        }) + "Excel",
                                        className: "dropdown-item",
                                        exportOptions: {
                                            columns: [3, 4, 5, 6, 7]
                                        }
                                    },
                                    {
                                        extend: "pdf",
                                        text: feather.icons.clipboard.toSvg({
                                            class: "font-small-4 mr-50"
                                        }) + "Pdf",
                                        className: "dropdown-item",
                                        exportOptions: {
                                            columns: [3, 4, 5, 6, 7]
                                        }
                                    },
                                    {
                                        extend: "copy",
                                        text: feather.icons.copy.toSvg({
                                            class: "font-small-4 mr-50"
                                        }) + "Copy",
                                        className: "dropdown-item",
                                        exportOptions: {
                                            columns: [3, 4, 5, 6, 7]
                                        }
                                    },
                                ],
                                init: function (e, a, t) {
                                    $(a).removeClass("btn-secondary"),
                                        $(a).parent().removeClass("btn-group"),
                                        setTimeout(function () {
                                            $(a).closest(".dt-buttons").removeClass("btn-group").addClass("d-inline-flex");
                                        }, 50);
                                },
                            },
                            {
                                text: feather.icons.plus.toSvg({
                                    class: "mr-50 font-small-4"
                                }) + "Add New Record",
                                className: "create-new btn btn-primary",
                                attr: {
                                    "data-toggle": "modal",
                                    "data-target": "#modals-new-record"
                                },
                                init: function (e, a, t) {
                                    $(a).removeClass("btn-secondary");
                                },
                            },
                        ],
                        responsive: {
                            details: {
                                display: $.fn.dataTable.Responsive.display.modal({
                                    header: function (e) {
                                        return "Details of " + e.data().full_name;
                                    },
                                }),
                                type: "column",
                                renderer: function (e, a, t) {
                                    var s = $.map(t, function (e, a) {
                                        return console.log(t), "" !== e.title ? '<tr data-dt-row="' + e.rowIndex + '" data-dt-column="' + e.columnIndex + '"><td>' + e.title + ":</td> <td>" + e.data + "</td></tr>" : "";
                                    }).join("");
                                    return !!s && $('<table class="table"/>').append(s);
                                },
                            },
                        },
                        language: {
                            paginate: {
                                previous: "&nbsp;",
                                next: "&nbsp;"
                            }
                        },
                    });
                    $("div.head-label").html('<h6 class="mb-0">Products</h6>');
                }

            });

            $('#modals-new-record').delegate('#addSubmit', 'click', async function () {
                $.confirm({
                    title: 'Add Product',
                    content: 'Anda yakin?',
                    buttons: {
                        confirm: async function () {
                            var newDataProduct = {
                                'Nama Barang': $('#nama_barang').val(),
                                'Kode Barang': $('#kode_barang').val(),
                                'Berat': $('#berat').val(),
                                'Kadar': $('#kadar').val(),
                                'Harga': $('#harga').val(),
                                'Kategori': $('#kategori').val(),
                                'Status': $('#status').val()
                            }
                            var id = uuid.v1(); 
                            var resultNewDataProduct = await R.apost(`http://${R.host}:${R.port}/webapi/products/${id}`, '', newDataProduct)
                            console.log(resultNewDataProduct)
                            $.alert('Confirmed!');
                            $('#modals-new-record').modal('hide');
                        },
                        cancel: function () {
                            $.alert('Canceled!');
                        }
                    }
                });
            })
        });
    }
);