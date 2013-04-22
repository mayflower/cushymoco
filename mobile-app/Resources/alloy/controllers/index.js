function Controller() {
    function openProductsWin() {
        if (!productsWin) {
            productsWin = Alloy.createController("products").getView();
            $.productsWindow.add(productsWin);
        }
    }
    function fillStartPage(text) {
        $.startContent.html = text;
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    var $ = this;
    var exports = {};
    $.__views.index = Ti.UI.createTabGroup({
        id: "index"
    });
    $.__views.homeWindow = Ti.UI.createWindow({
        backgroundColor: "#fff",
        title: "Shop",
        id: "homeWindow"
    });
    $.__views.startContent = Ti.UI.createWebView({
        id: "startContent"
    });
    $.__views.homeWindow.add($.__views.startContent);
    $.__views.homeTab = Ti.UI.createTab({
        window: $.__views.homeWindow,
        id: "homeTab",
        title: "Home",
        icon: "/icons/home_small.png"
    });
    $.__views.index.addTab($.__views.homeTab);
    $.__views.productsWindow = Ti.UI.createWindow({
        backgroundColor: "#fff",
        title: "Window Title",
        id: "productsWindow",
        navBarHidden: "true"
    });
    $.__views.productsTab = Ti.UI.createTab({
        window: $.__views.productsWindow,
        id: "productsTab",
        title: "Products",
        icon: "/icons/magnifier_small.png"
    });
    $.__views.index.addTab($.__views.productsTab);
    $.__views.accountWindow = Ti.UI.createWindow({
        backgroundColor: "#fff",
        title: "Account",
        id: "accountWindow"
    });
    $.__views.__alloyId1 = Ti.UI.createLabel({
        text: "Brunsverreggd",
        id: "__alloyId1"
    });
    $.__views.accountWindow.add($.__views.__alloyId1);
    $.__views.accountTab = Ti.UI.createTab({
        window: $.__views.accountWindow,
        id: "accountTab",
        title: "Account",
        icon: "/icons/user_small.png"
    });
    $.__views.index.addTab($.__views.accountTab);
    $.__views.cartWindow = Ti.UI.createWindow({
        backgroundColor: "#fff",
        title: "Shopping cart",
        id: "cartWindow"
    });
    $.__views.__alloyId2 = Ti.UI.createLabel({
        text: "Buscare",
        id: "__alloyId2"
    });
    $.__views.cartWindow.add($.__views.__alloyId2);
    $.__views.cartTab = Ti.UI.createTab({
        window: $.__views.cartWindow,
        id: "cartTab",
        title: "Cart",
        icon: "/icons/cart_small.png"
    });
    $.__views.index.addTab($.__views.cartTab);
    $.__views.moreWindow = Ti.UI.createWindow({
        backgroundColor: "#fff",
        title: "More",
        id: "moreWindow"
    });
    $.__views.__alloyId3 = Ti.UI.createLabel({
        text: "I'm a label in a window in a tab in an iOS app!",
        id: "__alloyId3"
    });
    $.__views.moreWindow.add($.__views.__alloyId3);
    $.__views.moreTab = Ti.UI.createTab({
        window: $.__views.moreWindow,
        id: "moreTab",
        title: "More",
        icon: "/icons/gear_small.png"
    });
    $.__views.index.addTab($.__views.moreTab);
    $.__views.index && $.addTopLevelView($.__views.index);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var productsWin;
    $.productsTab.addEventListener("focus", openProductsWin);
    require("communication").startScreen(fillStartPage);
    $.index.open();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;