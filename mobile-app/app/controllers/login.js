var comm = require("communication");

function loginSuccess(response) {
    Alloy.Globals.loggedIn = true;
    Alloy.Globals.userInfo = response;

    $.login.fireEvent('close:window.login');
}

function doLogin(e) {
	$.loginButton.enabled = false;
    comm.login($.loginUser.value, $.loginPass.value, $.loginStayLoggedIn.value, loginSuccess);
};

$.loginStayLoggedIn.value = Alloy.Globals.settings.get('stayLoggedIn');
