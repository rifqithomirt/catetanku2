$(document).ready(async function () {
    console.log("ready!");

    var xml = await R.agetFile('/pages/invoice/index.xml', '');
    $('#content-body-section').html(xml);
    console.log(xml);
});