requirejs([], function (xml) {
    console.log('run')
    // A $( document ).ready() block.
    
    //This function is called when scripts/helper/util.js is loaded.
    //If util.js calls define(), then this function is not fired until
    //util's dependencies have loaded, and the util argument will hold
    //the module value for "helper/util".
});


$(document).ready(async function () {

    var xml = await R.agetFile('/pages/pos/index.xml', '');
    $('#content-body-section').html(xml);
    //console.log(xml);
});