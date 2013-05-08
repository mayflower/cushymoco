var userModel = Alloy.createModel('userDetails');
userModel.on('change', function() {
    $.accountUsername.text = userModel.account.get('firstname') + ' ' + userModel.account.get('lastname');
    $.accountEmail.text = userModel.account.get('username');
    $.accountCompany.text = userModel.account.get('company');
    $.accountCallButton.visible = false;
    if (userModel.account.get('phone') && userModel.account.get('phone').length > 0) {
        $.accountCallButton.visible = true;
    }
    
    $.billingStreet.text = userModel.billingAddress.get('street') + ' ' + userModel.billingAddress.get('streetNo');
    $.billingStreetAdd.text = userModel.billingAddress.get('additional');
    $.billingZipCity.text = userModel.billingAddress.get('zip') + ' ' + userModel.billingAddress.get('city');
    $.billingState.text = userModel.billingAddress.get('state');
    $.billingCountry.text = userModel.billingAddress.get('country');
    if (!userModel.billingAddress.get('state') || userModel.billingAddress.get('state').length == 0) {
        $.billingState.visible = false;
    }
    if (!userModel.billingAddress.get('additional') || userModel.billingAddress.get('additional').length == 0) {
        $.billingStreetAdd.visible = false;
    }
});
userModel.fetch();

function doCall(e)
{
    var phoneNumber = (new String(userModel.account.get('phone'))).replace(/[^+0-9]/g, '');
    Titanium.Platform.openURL('tel:' + phoneNumber);
}
