requirejs(['/assets/js/uuid.min.js'],
    function (uuid) {
        $(document).ready(async function () {
            var xml = await R.agetFile('/pages/categories/index.xml', '');
            $('#content-body-section').html(xml);
            var sql = `SELECT (catetanku.categories.id) AS _id, column_json(catetanku.categories.doc) AS doc
            FROM catetanku.categories`;
            var resQueryProducts = await R.aget(`${R.protocol}://${R.host}:${R.port}/webapi/query/?sql=${ encodeURIComponent(sql)}`, '');
            if (resQueryProducts.results.length > 0) {
                var objDataProducts = resQueryProducts.results.map(function (obj) {
                    return obj.doc;
                });
            } else {
                var objDataProducts = [];
            }
            $(function () {
                "use strict";
                var e = $(".datatables-basic"),
                    r = "/pages/products/";
                if (("laravel" === $("body").attr("data-framework") && (r = $("body").attr("data-asset-path")), e.length)) {
                    var o = e.DataTable({
                        data: objDataProducts,
                        columns: [{
                            data: "Kategori"
                        }, {
                            data: "Description"
                        }, {
                            data: "Status"
                        }, {
                            data: ""
                        }],
                        columnDefs: [{
                                targets: 0,
                                orderable: !1,
                                responsivePriority: 3
                            },
                            {
                                targets: 1,
                                render: function (e, a, t, s) {
                                    return `<span class="text-right" >${e}</span>`;
                                },
                            },
                            {
                                targets: 2,
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
                    $("div.head-label").html('<h6 class="mb-0">Categories</h6>');
                }

                $('#modals-new-record').delegate('#addSubmit', 'click', async function () {
                    $.confirm({
                        title: 'Add Category',
                        content: 'Anda yakin?',
                        buttons: {
                            confirm: async function () {
                                var newDataProduct = {
                                    'Kategori': $('#kategori').val(),
                                    'Description': $('#description').val(),
                                    'Status': $('#status').val()
                                }
                                var id = uuid.v1();
                                var resultNewDataProduct = await R.apost(`${R.protocol}://${R.host}:${R.port}/webapi/categories/${id}`, '', newDataProduct)
                                console.log(resultNewDataProduct)
                                $.alert('Confirmed!');
                                $('#modals-new-record').modal('hide');
                            },
                            cancel: function () {
                                $.alert('Canceled!');
                            }
                        }
                    });
                });

                $('#modals-new-record').on('hide.bs.modal', async function () {
                    var sql = `SELECT (catetanku.categories.id) AS _id, column_json(catetanku.categories.doc) AS doc
                    FROM catetanku.categories`;
                    resQueryProducts = await R.aget(`${R.protocol}://${R.host}:${R.port}/webapi/query/?sql=${ encodeURIComponent(sql)}`, '');
                    if (resQueryProducts.results.length > 0) {
                        objDataProducts = resQueryProducts.results.map(function (obj) {
                            return obj.doc;
                        });
                    } else {
                        objDataProducts = [];
                    }
                    window.location.reload()
                });
            });
        });
    }
);