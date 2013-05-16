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
    Alloy.Globals.cartItemCount = count;
    Alloy.Globals.cartTab.setBadge(count);
};

Alloy.Globals.addToCart = function(productId, quantity) {
    communication.addToCart(productId, quantity, function(response){
        Alloy.Globals.updateCartItemCount(response);
    }, function(error) {
        alert(error);
    });
};

Ti.App.addEventListener('webView:linkClick', function(e) {
    var baseUrl = Alloy.CFG.oxid.baseUrl,
        targetDomain = e.protocol + '//' + e.hostname + (e.port > 0 ? ':' + e.port : '') + '/',
        isExternal = (baseUrl.substr(0, targetDomain.length) != targetDomain);
    
    if (isExternal) {
        Ti.Platform.openURL(e.href);
        return;
    }
    
    // TODO Move query string parser to shop specific JS file!
    var queryString = e.search;
    if (queryString.substr(0, 1) == '?') {
        queryString = queryString.substr(1);
    }
    
    var queryParams = queryString.split('&'),
        params = {};
    for (var i = 0; i < queryParams.length; i++) {
        var paramName = queryParams[i].substr(0, queryParams[i].indexOf('=')),
            paramValue = queryParams[i].substr(queryParams[i].indexOf('=') + 1);
        params[paramName] = paramValue;
    }
    
    var targetWin;
    if (params.cl == 'details') {
        targetWin = Alloy.createController('product/details', {productId:params.anid}).getView();
    }
    
    if (params.cl == 'alist') {
        targetWin = Alloy.createController("product/categories", {"catId":params.cnid}).getView();
    }
    
    if (targetWin) {
        Alloy.CFG.productNavGroup = Alloy.Globals.homeTab;
        Alloy.Globals.homeTab.open(targetWin);
    }
});
