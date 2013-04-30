var comm = require("communication");

function loginSuccess(response) {
    Alloy.Globals.loggedIn = true;
    Alloy.Globals.userInfo = response;

    if ($.loginStayLoggedIn.value) {
        Alloy.Globals.settings.set('stayLoggedIn', 1);
        Alloy.Globals.settings.set('user.name', $.loginUser.value);
        Alloy.Globals.settings.set('user.pass', $.loginPass.value);
    } else {
        Alloy.Globals.settings.set('stayLoggedIn', 0);
        Alloy.Globals.settings.delete('user.name');
        Alloy.Globals.settings.delete('user.pass');
    }

    $.login.fireEvent('window.close');
}

function doLogin(e) {
    comm.login($.loginUser.value, $.loginPass.value, $.loginStayLoggedIn.value, loginSuccess);
};

$.loginStayLoggedIn.value = Alloy.Globals.settings.get('stayLoggedIn');
