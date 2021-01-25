$(document).ready(async function () {
    var qs = R.getUrlVars();
    var sql = `SELECT catetanku.transactions.id AS id, column_json(column_create(
        "Kode Product", column_get(catetanku.transactions.doc, "Kode Product" AS CHAR),
        "Harga Product", column_get(catetanku.transactions.doc, "Harga Product" AS CHAR),
        "Total Harga", column_get(catetanku.transactions.doc, "Total Harga" AS CHAR),
        "Jumlah Product", column_get(catetanku.transactions.doc, "Jumlah Product" AS CHAR),
        "Nama Product", column_get(catetanku.transactions.doc, "Nama Product" AS CHAR),
        "Customer", column_get(catetanku.transactions.doc, "Customer" AS CHAR),
        "Total", column_get(catetanku.transactions.doc, "Total" AS CHAR),
        "Total Before Discount", column_get(catetanku.transactions.doc, "Total Before Discount" AS CHAR),
        "Discount", column_get(catetanku.transactions.doc, "Discount" AS CHAR),
        "Transaction Code", column_get(catetanku.transactions.doc, "Transaction Code" AS CHAR),
        "Address", column_get(catetanku.transactions.doc, "Address" AS CHAR),
        "Description", column_get(catetanku.transactions.doc, "Description" AS CHAR),
        "Berat", column_get(catetanku.products.doc, "Berat" AS CHAR),
        "Kadar", column_get(catetanku.products.doc, "Kadar" AS CHAR)
       )) AS doc
       FROM catetanku.transactions
       INNER JOIN catetanku.products
       ON column_get(catetanku.transactions.doc,"Kode Product" AS CHAR) = column_get(catetanku.products.doc,"Kode Barang" AS CHAR)
    WHERE column_get(catetanku.transactions.doc,"Transaction Code" AS CHAR) = "${qs['transaction']}"`;
    var resultTransactions = await R.aget(`http://${R.host}:${R.port}/webapi/query?sql=${encodeURIComponent(sql)}`, '', {});

    console.log(resultTransactions)
    if (resultTransactions.results.length > 0) {
        var doc = resultTransactions.results[0]['doc'];
        $('#transactionCode').text(doc['Transaction Code']);
        $('#customer').text(doc['Customer']);
        $('#address').text(doc['Address']);
        $('#description').text(doc['Description']);
        $('#subtotal').text('Rp ' + R.numberToRupiah(doc['Total Before Discount'] * 1) + ',-');
        $('#discount').text(doc['Discount'] + ' %');
        $('#total').text( 'Rp ' + R.numberToRupiah(doc['Total Harga'] * 1) + ',-' );

        var strTableTransactions = resultTransactions.results.map(function (obj, index) {
            var doc = obj.doc;
            var products = obj.products;
            var str = `
            <tr ${ (index + 1) == resultTransactions.results.length ? 'class="border-bottom"' : '' }>
                <td class="py-1 pl-2">
                <p class="font-weight-semibold mb-25">${doc['Kode Product']}</p>
                </td>
                <td class="py-1">
                <p class="font-weight-semibold mb-25">${doc['Nama Product']}</p>
                </td>
                <td class="py-1">
                    <p class="font-weight-semibold mb-25">${doc['Berat']} gr</p>
                </td>
                <td class="py-1">
                    <p class="font-weight-semibold mb-25">${doc['Kadar']} %</p>
                </td>
                <td class="py-1">
                    <strong>${R.numberToRupiah((doc['Harga Product'] * 1) / (doc['Jumlah Product'] * 1))},-</strong>
                </td>
                <td class="py-1">
                    <p class="font-weight-semibold mb-25">${doc['Kadar']} %</p>
                </td>
                <td class="py-1">
                    <strong>${R.numberToRupiah(doc['Harga Product'] * 1)},-</strong>
                </td>
            </tr>`;
            return str;
        }).join('');
        $('#body-nota').html( strTableTransactions );
        setTimeout(function(){
            window.print();
        }, 1500);
    }
});