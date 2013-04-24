var Alloy = require("alloy"), _ = Alloy._, Backbone = Alloy.Backbone;

var communication = require("communication");

String.prototype.repeat = function(count) {
    return new Array(parseInt(count) + 1).join(this);
};

Alloy.Globals.addToCart = function(productId, quantity) {
    communication.addToCart(productId, quantity, function(response) {
        Alloy.Globals.cartTab.setBadge(response);
    }, function(error) {
        alert(error);
    });
};

Alloy.createController("index");