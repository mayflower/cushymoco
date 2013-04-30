var comm = require("communication");
var doLogin = function(e) {
    var loginSuccess = function(response) {
       Alloy.Globals.loggedIn = true;
       Alloy.Globals.user = reponse;

       if ($.loginStayLoggedIn.value) {
           Alloy.Globals.settings.set('stayLoggedIn', 1);
           Alloy.Globals.settings.set('user.name', $.loginUser.value);
           Alloy.Globals.settings.set('user.pass', $.loginPass.value);
       } else {
           Alloy.Globals.settings.set('stayLoggedIn', 0);
           Alloy.Globals.settings.delete('user.name');
           Alloy.Globals.settings.delete('user.pass');
       }
       
       $.login.fireEvent('close');
    };
    
    comm.login($.loginUser.value, $.loginPass.value, loginSuccess);
};
$.loginStayLoggedIn.value = Alloy.Globals.settings.get('stayLoggedIn');
