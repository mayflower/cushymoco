function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    var $ = this;
    var exports = {};
    $.__views.detailsWindow = Ti.UI.createWindow({
        backgroundColor: "#fff",
        title: "Window Title",
        id: "detailsWindow"
    });
    $.__views.detailsWindow && $.addTopLevelView($.__views.detailsWindow);
    $.__views.productDetailsPage = Ti.UI.createScrollView({
        type: "vertical",
        id: "productDetailsPage"
    });
    $.__views.detailsWindow.add($.__views.productDetailsPage);
    $.__views.__alloyId5 = Ti.UI.createView({
        layout: "vertical",
        id: "__alloyId5"
    });
    $.__views.productDetailsPage.add($.__views.__alloyId5);
    var __alloyId6 = [];
    $.__views.productPictures = Ti.UI.createScrollableView({
        views: __alloyId6,
        backgroundColor: "#000",
        showPagingControl: true,
        disableBounce: true,
        height: "50%",
        id: "productPictures"
    });
    $.__views.__alloyId5.add($.__views.productPictures);
    $.__views.__alloyId7 = Ti.UI.createView({
        backgroundColor: "#000",
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        id: "__alloyId7"
    });
    $.__views.__alloyId5.add($.__views.__alloyId7);
    $.__views.productTitle = Ti.UI.createLabel({
        left: "5px",
        color: "#FFF",
        font: {
            fontSize: 16,
            fontWeight: "bold"
        },
        height: Ti.UI.SIZE,
        width: "60%",
        id: "productTitle"
    });
    $.__views.__alloyId7.add($.__views.productTitle);
    $.__views.productPrice = Ti.UI.createLabel({
        right: "40px",
        color: "#FFF",
        font: {
            fontSize: 16,
            fontWeight: "bold"
        },
        height: Ti.UI.SIZE,
        width: Ti.UI.SIZE,
        id: "productPrice"
    });
    $.__views.__alloyId7.add($.__views.productPrice);
    $.__views.cartButton = Ti.UI.createButton({
        right: "5px",
        backgroundImage: "/icons/icon_shopping_cart.png",
        title: "",
        style: Titanium.UI.iPhone.SystemButtonStyle.PLAIN,
        height: "30px",
        width: "30px",
        id: "cartButton"
    });
    $.__views.__alloyId7.add($.__views.cartButton);
    var __alloyId8 = [];
    $.__views.productInfo = Ti.UI.createScrollableView({
        views: __alloyId8,
        id: "productInfo"
    });
    $.__views.__alloyId5.add($.__views.productInfo);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var args = arguments[0] || {};
    var productPictures = Alloy.createCollection("productPicture");
    var productDetails = Alloy.createModel("product");
    productPictures.fetch({
        data: {
            productId: args.productId
        }
    });
    productPictures.on("reset", function() {
        productPictures.map(function(productPicture) {
            $.productPictures.addView(Titanium.UI.createImageView({
                image: productPicture.get("image")
            }));
        });
    });
    productDetails.fetch({
        data: {
            productId: args.productId
        }
    });
    productDetails.on("change", function() {
        $.productTitle.setText(productDetails.get("title"));
        $.productPrice.setText(productDetails.get("formattedPrice"));
        $.productInfo.addView(Titanium.UI.createWebView({
            data: productDetails.get("longDesc")
        }));
    });
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;