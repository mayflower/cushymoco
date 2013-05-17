var args = arguments[0] || {};

var userDetails = Alloy.createModel('userDetails');
userDetails.fetch();
userDetails.on('change', function() {
    $.accountUsername.text = userDetails.account.get('firstname') + ' ' + userDetails.account.get('lastname');
    $.accountEmail.text = userDetails.account.get('username');
    $.accountCompany.text = userDetails.account.get('company');
    
    $.billingStreet.text = userDetails.billingAddress.get('street') + ' ' + userDetails.billingAddress.get('streetNo');
    $.billingStreetAdd.text = userDetails.billingAddress.get('additional');
    $.billingZipCity.text = userDetails.billingAddress.get('zip') + ' ' + userDetails.billingAddress.get('city');
    $.billingState.text = userDetails.billingAddress.get('state');
    $.billingCountry.text = userDetails.billingAddress.get('country');
    if (!userDetails.billingAddress.get('state') || userDetails.billingAddress.get('state').length == 0) {
        $.billingState.visible = false;
    }
    if (!userDetails.billingAddress.get('additional') || userDetails.billingAddress.get('additional').length == 0) {
        $.billingStreetAdd.visible = false;
    }
});

var nextStepButton = Ti.UI.createButton({
    title:"Weiter >"
});
nextStepButton.addEventListener('click', function(e) {
    var shippingPaymentWin = Alloy.createController('checkout/shippingPayment', {nav:args.nav}).getView();
    args.nav.open(shippingPaymentWin);
});
$.userDataWindow.rightNavButton = nextStepButton;