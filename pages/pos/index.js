requirejs(['/assets/js/uuid.min.js'],
  function (uuid, mask) {
    $(document).ready(async function () {
      console.log(uuid)
      var xml = await R.agetFile('/pages/pos/index.xml', '');
      $('#content-body-section').html(xml);

      var sql = `SELECT (catetanku.categories.id) AS _id, column_json(catetanku.categories.doc) AS doc
      FROM catetanku.categories
      LIMIT 1000`;
      var resQueryCategories = await R.aget(`https://${R.host}:${R.port}/webapi/query/?sql=${ encodeURIComponent(sql)}`, '');
      var objCategories = resQueryCategories.results.map(function (obj) {
        return obj.doc.Kategori;
      });

      var strSelectCategory = `<option disabled="disabled" selected>Select Category</option>
      <option value="all">All</option>` + objCategories.map(function (category) {
        return `<option value="${category}">${category}</option>`;
      }).join('');

      $('#categorySelect').html(strSelectCategory);

      var sql = `SELECT catetanku.transactions.id AS id, column_json(catetanku.transactions.doc) AS doc
      FROM catetanku.transactions
      WHERE column_get(catetanku.transactions.doc,"Transaction Code" AS CHAR) REGEXP "${ new Date().toISOString().substr(0,10).replace(/\-/g, '') }"
      GROUP BY column_get(catetanku.transactions.doc,"Transaction Code" AS CHAR)
      ORDER BY column_get(catetanku.transactions.doc,"Transaction Code" AS CHAR)`;
      var resQueryTransactions = await R.aget(`https://${R.host}:${R.port}/webapi/query/?sql=${ encodeURIComponent(sql)}`, '');
      if( resQueryTransactions.results.length > 0 ) {
        noUrut = resQueryTransactions.results[0]['doc']['Transaction Code'].split('-')[1] * 1 + 1;
      } else {
        noUrut = 0;
      }

      var sql = `SELECT (catetanku.products.id) AS _id, column_json(catetanku.products.doc) AS doc
      FROM catetanku.products
      LIMIT 1000`;
      var resQueryProducts = await R.aget(`https://${R.host}:${R.port}/webapi/query/?sql=${ encodeURIComponent(sql)}`, '');
      var objData = resQueryProducts.results.map(function (obj) {
        return obj.doc;
      })

      var allStrItemLists = objData.map(function (obj) {
        return `<div class="col-3">
                        <div class="card border-secondary" data-kode="${obj['Kode Barang']}">
                          <img class="card-img-top" data-kode="${obj['Kode Barang']}" src="/upload/${obj['Kode Barang']}.png" alt="Card image cap">
                          <div class="card-body px-05 py-05">
                            <h4 class="card-title card-item-title font-weight-bolder mb-0">${obj['Nama Barang']}</h4>
                            <p class="card-item-berat-kadar card-text font-small-2 ">${obj['Berat']} gr / Kadar ${obj['Kadar']}</p>
                            <h5 class="card-item-price  font-weight-bolder mb-0 text-right">Rp. ${R.numberToRupiah(obj['Harga'])},-</h5>
                          </div>
                        </div>
                      </div>`;
      }).join('');

      $('#cart-items').delegate('span.minus', 'click', function () {
        var minusElement = this;
        var valueElement = $(this.parentNode).find('input.count');
        var valueNow = $(valueElement).val() * 1;
        var valueNext = valueNow - 1;
        if (valueNext == 0) {
          $.confirm({
            title: 'Delete',
            content: 'Anda yakin?',
            buttons: {
              confirm: function () {
                $(minusElement.parentNode.parentNode.parentNode.parentNode).remove();
              },
              cancel: function () {
                $.alert('Canceled!');
              }
            }
          });
        } else $(valueElement).val(valueNext);
        var priceCartElement = $(minusElement.parentNode.parentNode.parentNode).find('.item-price');
        //console.log(priceCartElement, this.parentNode.parentNode)
        var priceCartValue = $(priceCartElement).data('price') * 1;
        var multiplyPriceCartValue = valueNext * priceCartValue;
        $(priceCartElement).text(`Rp. ${ R.numberToRupiah(multiplyPriceCartValue) }`);
        updateTotalPriceShop();
      })
      $('#cart-items').delegate('span.plus', 'click', function () {
        var valueElement = $(this.parentNode).find('input.count');
        var valueNow = $(valueElement).val() * 1;
        var valueNext = valueNow + 1;
        $(valueElement).val(valueNext);
        var priceCartElement = $(this.parentNode.parentNode.parentNode).find('.item-price');
        //console.log(priceCartElement, this.parentNode.parentNode)
        var priceCartValue = $(priceCartElement).data('price') * 1;
        var multiplyPriceCartValue = valueNext * priceCartValue;
        $(priceCartElement).text(`Rp. ${ R.numberToRupiah(multiplyPriceCartValue) }`);
        updateTotalPriceShop();
      })
      $('#item-cards').html(allStrItemLists);
      findChildKode = function (kode) {
        var cartChilds = $('#cart-items').children();
        var cartChildsKodeElement = $(cartChilds).toArray().filter(element => {
          //console.log($(element).data('kode') == kode, $(element).data('kode'), element)
          return $(element).data('kode') == kode;
        });
        if (cartChildsKodeElement.length > 0) {
          return cartChildsKodeElement[0]
        } else return false;
      }
      updateTotalPriceShop = function () {
        var cartChilds = $('#cart-items').children();
        var cartChildsTotalPrice = $(cartChilds).toArray().reduce((old, element) => {
          var valueCountElement = $(element).find('.item-price');
          var value = $(valueCountElement[0]).text().replace(/\./g, '').replace('Rp', '').trim() * 1;
          //console.log(value, $(valueCountElement[0]).text() , $(valueCountElement[0]).text().replace(/\./g, ''), $(valueCountElement[0]).text().replace(/\./g, '').replace('Rp.', '') )
          old += value;
          return old;
        }, 0);
        $('.totalshop').text('Rp. ' + R.numberToRupiah(cartChildsTotalPrice));
      }
      $("#item-cards").delegate("div.card", "click", function () {
        var kode = $(this).data('kode');
        //alert(kode);
        var checkExistElement = findChildKode(kode);
        //console.log(checkExistElement)
        if (!checkExistElement) {
          var dataOnClick = objData.filter((obj) => {
            return obj['Kode Barang'] == kode;
          });
          var strItemCart = `
                        <div class="row pb-1 cart-item-product" data-kode="${dataOnClick[0]['Kode Barang']}">
                          <div class="col-2 px-0 " >
                            <img class="item-img img-fluid rounded" data-toggle="modal" data-target="#modalPhoto" alt="Responsive image" data-kode="${dataOnClick[0]['Kode Barang']}" src="/upload/${dataOnClick[0]['Kode Barang']}.png">
                          </div>
                          <div class="col-5 ">
                            <span class="item-name">${ dataOnClick[0]['Nama Barang'] }</span>
                            <p class="item-details font-small-2">${ dataOnClick[0]['Berat'] } gr/ Kadar ${ dataOnClick[0]['Kadar'] }</p>
                          </div>
                          <div class="col-5 mx-auto">
                            <div class="row text-center">
                              <div class="col qty px-auto ">
                                <span class="minus bg-dark">-</span>
                                <input type="number" class="count" name="qty" value=1>
                                <span class="plus bg-dark">+</span>
                              </div>
                            </div>
                            <div class="row">
                              <div class="col text-right">
                                <span class="item-price" data-price="${ dataOnClick[0]['Harga'] }">Rp. ${ R.numberToRupiah(dataOnClick[0]['Harga']) }</span>
                              </div>
                            </div>
                          </div>
                        </div>`;
          $('#cart-items').append(strItemCart);
        } else {
          var counterCartElement = $(checkExistElement).find('.count')
          var counterCartValue = $(counterCartElement).val() * 1;
          var addCounterCartValue = counterCartValue + 1;
          $(counterCartElement).val(addCounterCartValue);
          var priceCartElement = $(checkExistElement).find('.item-price');
          var priceCartValue = $(priceCartElement).data('price') * 1;
          var multiplyPriceCartValue = addCounterCartValue * priceCartValue;
          //console.log(multiplyPriceCartValue)
          $(priceCartElement).text(`Rp. ${ R.numberToRupiah(multiplyPriceCartValue) }`)
        }
        updateTotalPriceShop();
      });
      $('#cartCheckout').on('click', function () {
        var totalShopPrice = R.rupiahToNumber($('.totalshop').text());
      });

      const webcamElement = document.getElementById('webcam');
      const canvasElement = document.getElementById('canvas');
      const snapSoundElement = document.getElementById('snapSound');
      const webcam = new Webcam(webcamElement, 'user', canvasElement, snapSoundElement);
      console.log(webcam)
      $('#modalPhoto').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget) // Button that triggered the modal
        var kode = button.data('kode');
        $('#capture').data("kode", kode);
        webcam.start()
          .then(result => {
            console.log("webcam started");
          })
          .catch(err => {
            console.log(err);
          });
      })

      $('#modalPhoto').on('hide.bs.modal', function (event) {
        webcam.stop();
      });
      $('#modalPhoto').delegate('#capture', 'click', async function (event) {
        var button = $(event.relatedTarget) // Button that triggered the modal
        var kode = $(this).data('kode');
        console.log(button, kode)
        var picture = webcam.snap();
        await R.apost('/upload', '', {
          base64: picture,
          filename: kode
        });
        $(`img[data-kode="${kode}"]`).removeAttr("src").attr("src", `/upload/${kode}.png?timestamp=${new Date().getTime()}`);
        $(`#item-cards img[data-kode="${kode}"]`).removeAttr("src").attr("src", `/upload/${kode}.png?timestamp=${new Date().getTime()}`);
      });



      $('#checkoutModal').on('show.bs.modal', function (event) {
        var button = event.relatedTarget // Button that triggered the modal
        var buttonParent = button.parentNode.parentNode.parentNode;
        var subTotalShop = $(buttonParent).find('.totalshop');
        var subTotalShopValue = R.rupiahToNumber($(subTotalShop).text());
        $('#subtotal').val(subTotalShopValue).trigger('change');
        $('#subtotal').mask('000.000.000.000', {
          reverse: true
        });

        $('#total').val(subTotalShopValue).trigger('change');
        $('#total').mask('000.000.000.000', {
          reverse: true
        });
      });

      $('#discount').on('keyup', function(){
        var subtotalValueString = $('#subtotal').val();
        var subtotalValue = R.rupiahToNumber(subtotalValueString);
        var discountValue = $(this).val();
        var discountedTotal = subtotalValue - ( ( discountValue / 100 ) * subtotalValue);
        $('#total').val( R.numberToRupiah(discountedTotal) );
        $('#total').mask('000.000.000.000', {
          reverse: true
        });
      });

      $('#submit').on('click', async function(){
        /*$('div#checkoutModal').find('input').toArray().forEach(function( element ){
          $(element).prop('disabled', true);
        });
        $('div#checkoutModal').find('textarea').toArray().forEach(function( element ){
          $(element).prop('disabled', true);
        })*/
        var nowString = new Date().toISOString();
        var objTransactions = {
          Customer: R.conditionerString($('#customer').val()),
          Address:  R.conditionerString($('#address').val()),
          Description:  R.conditionerString($('#description').val()),
          Discount: $('#discount').val(),
          'Total Harga': R.rupiahToNumber($('#total').val()),
          'Total Before Discount': R.rupiahToNumber($('#subtotal').val()),
          'Transaction Code': nowString.substr(0,10).replace(/\-/g, '') + '-' + R.pad(noUrut, 4),
          'Transaction Date': nowString
        };

        var arrayDataCart = $('#cart-items').find('.cart-item-product').toArray().map(function(element){
          var kodeProduct = $(element).data('kode');
          var jumlahElement = $(element).find('.count')[0];
          var hargaElement = $(element).find('.item-price')[0];
          var nameElement = $(element).find('.item-name')[0];
          var jumlahProduct = $(jumlahElement).val() * 1; 
          var hargaProduct = $(hargaElement).text(); 
          var hargaItem = $(hargaElement).data('price'); 
          var nameProduct = $(nameElement).text(); 
          var objResult = {
            'Kode Product': kodeProduct,
            'Harga Product': R.rupiahToNumber(hargaProduct),
            'Harga Item': R.rupiahToNumber(hargaProduct),
            'Jumlah Product': jumlahProduct,
            'Nama Product': nameProduct
          };
          return Object.assign({}, objResult, objTransactions);
        });

        await R.asyncForEach(arrayDataCart, async function( obj ){
          var uid = uuid.v1();
          var res = await R.apost(`https://${R.host}:${R.port}/webapi/transactions/${uid}`, '', obj);
          console.log(res);
        });
        $.alert({
          'title': 'Alert!',
          'content': 'Success'
        });
        $('#submit').prop('disabled', true);
        $('#cancelCart').prop('disabled', true);
        $('#printNota').data('transaction', objTransactions['Transaction Code']);
        $('#printNota').removeClass('d-none');
      });

      $('#printNota').on('click', function(){
        var transactionCode = $(this).data('transaction');
        window.open('/print/nota.html?transaction=' + transactionCode , '_blank');
        $('#checkoutModal').modal('hide')
      });
    });
  }
);