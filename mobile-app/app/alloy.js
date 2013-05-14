// The contents of this file will be executed before any of
// your view controllers are ever executed, including the index.
// You have access to all functionality on the `Alloy` namespace.
//
// This is a great place to do any initialization for your app
// or create any global variables/functions that you'd like to
// make available throughout your app. You can easily make things
// accessible globally by attaching them to the `Alloy.Globals`
// object. For example:
//
// Alloy.Globals.someGlobalFunction = function(){};
var communication = require('communication');
var settings = require('localSettings');
Alloy.Globals.settings = settings;

settings.init();

String.prototype.repeat = function (count) {
    return new Array(parseInt(count) + 1).join(this);
};

Alloy.Globals.updateCartItemCount = function (count) {
    if (count == 0) {
        count = null;
    }
    Alloy.Globals.cartTab.setBadge(count);
};

Alloy.Globals.addToCart = function(productId, quantity) {
    communication.addToCart(productId, quantity, function(response){
        Alloy.Globals.updateCartItemCount(response);
    }, function(error) {
        alert(error);
    });
};


Ti.App.addEventListener('linkClickEvent', function(e) {
	alert(e);
});
