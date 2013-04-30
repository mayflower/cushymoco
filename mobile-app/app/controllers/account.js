var userModel = Alloy.createModel('user');
userModel.on('change', function() {
    $.accountUsername.text = userModel.get('firstname') + ' ' + userModel.get('lastname');
    $.accountEmail.text = userModel.get('username');
    $.accountCompany.text = userModel.get('company');
});
userModel.fetch();
