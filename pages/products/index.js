window.addEventListener('DOMContentLoaded', (event) => {
    requirejs(['/assets/js/uuid.min.js'],
        function (uuid) {

            $(document).ready(async function () {
                var xml = await R.agetFile('/pages/products/index.xml', '');
                $('#content-body-section').html(xml);
                var sql = `SELECT (catetanku.products.id) AS _id, column_json(catetanku.products.doc) AS doc
            FROM catetanku.products
            LIMIT 1000`;
                var resQueryProducts = await R.aget(`${R.protocol}://${R.host}:${R.port}/webapi/query/?sql=${ encodeURIComponent(sql)}`, '');
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
                                data: "Kode Barang"
                            }, {
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
                            }, {
                                data: ""
                            }],
                            columnDefs: [{
                                    targets: 1,
                                    orderable: !1,
                                    responsivePriority: 3,
                                    render: function (e, a, t, s) {
                                        return (e);
                                    },
                                },
                                {
                                    targets: 3,
                                    render: function (e, a, t, s) {
                                        return `<span class="text-right" data-berat="${e}" style="width:100%;">${e} gr</span>`;
                                    },
                                },
                                {
                                    targets: 5,
                                    orderable: !1,
                                    render: function (e, a, t, s) {
                                        return `<span data-price="${e}">Rp. ${R.numberToRupiah(e)}</span>`;
                                    },
                                },
                                {
                                    targets: 6,
                                    orderable: !1,
                                    render: function (e, a, t, s) {
                                        var str = 'Stock' in t ? t.Stock : '';
                                        return str;
                                    },
                                },
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
                                    text: feather.icons.download.toSvg({
                                        class: "mr-50 font-small-4"
                                    }) + "Import",
                                    className: "mr-2 import btn btn-outline-secondary",
                                    attr: {
                                        "data-toggle": "modal",
                                        "data-target": "#modals-import"
                                    },
                                    init: function (e, a, t) {
                                        $(a).removeClass("btn-secondary");
                                    },
                                },
                                {
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
                                                columns: [0, 1, 2, 3, 4, 5, 6, 7]
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
                                }
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
                                var resultNewDataProduct = await R.apost(`${R.protocol}://${R.host}:${R.port}/webapi/products/${id}`, '', newDataProduct)
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

                var sheetNameValidation = function (wb) {
                    var sheetName = Object.keys(wb.Sheets)[0];
                    if (sheetName == 'Sheet1') {
                        var result = XLSX.utils.sheet_to_json(wb.Sheets[sheetName], {
                            header: 1
                        });
                        var headers = `Kode Barang,Nama Barang,Kategori,Berat,Kadar,Harga,Vendor,Stock,Status`;
                        if (result[1].join(',') == headers) {
                            var arrData = result.filter(function (arr, i) {
                                return i >= 2 && arr[0] != '';
                            });
                            var objData = arrData.map(function (arr) {
                                console.log(arr)
                                var obj = {};
                                arr.forEach(function (e, i) {
                                    //console.log(result[1][i])
                                    if( result[1][i].toLowerCase().indexOf('harga') > -1 ) e = R.rupiahToNumber(e.toString());
                                    else if( result[1][i].toLowerCase().indexOf('berat') > -1 ) e = e.toString().replace('gr', '').trim() * 1;
                                    else if( result[1][i].toLowerCase().indexOf('kadar') > -1 ) e = e.toString().replace('%', '').trim() * 1;
                                    obj[result[1][i]] = e;
                                });
                                return obj;
                            })
                            return {
                                result: true,
                                data: objData
                            }
                        } else {
                            return {
                                result: false,
                                message: 'Wrong Header Column'
                            };
                        }
                    } else {
                        return {
                            result: false,
                            message: 'Wrong Sheet Name'
                        };
                    }
                }

                $('#inputFileImport').on('change', async function (e) {
                    var files = e.target.files,
                        f = files[0];
                    $('.custom-file-label').text(f.name);
                    if (f.name.indexOf('.xlsx') > -1) {
                        var reader = new FileReader();
                        reader.onload = async function (e) {
                            var data = new Uint8Array(e.target.result);
                            workbook = XLSX.read(data, {
                                type: 'array'
                            });
                            $('#submitUpload').removeAttr('disabled');
                        };
                        reader.readAsArrayBuffer(f);
                    } else {
                        $('#statusUploadXLSX').empty().addClass('text-danger').text('Wrong File');
                    }
                });

                $('#submitUpload').on('click', async function () {
                    $(this).prop('disabled', true)
                    var checkResult = sheetNameValidation(workbook);
                    workbook = {};
                    var strError = '';
                    var indexError = 0;
                    if (checkResult.result) {
                        $('.progress-wrapper').removeClass('d-none');
                        await R.asyncForEach(checkResult.data, async function (obj, i) {
                            var percentage = Math.round((i / (checkResult.data.length - 1)) * 100);
                            $('#progressValue').empty().text(percentage);
                            $('#progress-bar-upload').css('width', percentage + '%')
                            var sql = `SELECT catetanku.products.id AS id, column_json(catetanku.products.doc) AS doc
                                    FROM catetanku.products
                                    WHERE column_get(catetanku.products.doc,"Kode Barang" AS CHAR) = "${ obj['Kode Barang'] }"`;
                            resQueryProducts = await R.aget(`${R.protocol}://${R.host}:${R.port}/webapi/query/?sql=${ encodeURIComponent(sql)}`, '');
                            if (resQueryProducts.results.length == 0) {
                                var id = uuid.v1();
                                console.log(obj)
                                var resultNewDataProduct = await R.apost(`${R.protocol}://${R.host}:${R.port}/webapi/products/${id}`, '', obj);
                                if( resultNewDataProduct.message.indexOf('affectedRows') == -1 ) {    
                                    var dataOnLine = Object.values(obj)[0];
                                    if(indexError <= 10) strError += dataOnLine + ' --> is Error' + '<br>';
                                    indexError ++;
                                } 
                            } else {
                                var dataOnLine = Object.values(obj)[0];
                                if(indexError <= 10) strError += dataOnLine + ' --> is duplicate' + '<br>';
                                indexError ++;
                            }
                            //console.log(resQueryProducts);
                        });
                        $('#statusUploadXLSX').empty().addClass('text-danger').html(strError);
                        var a = $.alert({
                            title: 'Alert!',
                            content: 'Done'
                        });
                        if(a) window.location.reload();
                    } else {
                        $('#statusUploadXLSX').empty().addClass('text-danger').text(checkResult.message);
                    }
                })
            });
        }
    );
});