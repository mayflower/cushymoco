var userModel;

exports.showUserData = function() {
	Ti.API.debug("creating usermodel");
	userModel = Alloy.createModel('user');
	userModel.on('change', function() {
	    $.accountUsername.text = userModel.get('firstname') + ' ' + userModel.get('lastname');
	    $.accountEmail.text = userModel.get('username');
	    $.accountCompany.text = userModel.get('company');
	});
	userModel.fetch();
};

exports.run = function() {
	this.showUserData();
}
