function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    $model = arguments[0] ? arguments[0].$model : null;
    var $ = this, exports = {}, __defers = {};
    $.__views.productRow = Ti.UI.createTableViewRow({
        layout: "horizontal",
        id: "productRow"
    });
    $.addTopLevelView($.__views.productRow);
    $.__views.iconView = Ti.UI.createView({
        layout: "vertical",
        top: "0px",
        height: Ti.UI.SIZE,
        width: Ti.UI.SIZE,
        id: "iconView"
    });
    $.__views.productRow.add($.__views.iconView);
    $.__views.productIcon = Ti.UI.createImageView({
        left: "0px",
        top: "0px",
        height: "48px",
        width: "48px",
        id: "productIcon"
    });
    $.__views.iconView.add($.__views.productIcon);
    $.__views.labelView = Ti.UI.createView({
        layout: "vertical",
        height: Ti.UI.SIZE,
        id: "labelView"
    });
    $.__views.productRow.add($.__views.labelView);
    $.__views.productTitle = Ti.UI.createLabel({
        top: "5px",
        left: "5px",
        font: {
            fontSize: 14,
            fontWeight: "bold"
        },
        id: "productTitle"
    });
    $.__views.labelView.add($.__views.productTitle);
    $.__views.productShortDesc = Ti.UI.createLabel({
        left: "5px",
        font: {
            fontSize: 10
        },
        id: "productShortDesc"
    });
    $.__views.labelView.add($.__views.productShortDesc);
    $.__views.productPrice = Ti.UI.createLabel({
        left: "5px",
        top: "5px",
        font: {
            fontSize: 12,
            fontWeight: "bold"
        },
        id: "productPrice"
    });
    $.__views.labelView.add($.__views.productPrice);
    $.__views.__alloyId10 = Ti.UI.createView({
        height: "5px",
        id: "__alloyId10"
    });
    $.__views.labelView.add($.__views.__alloyId10);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var args = arguments[0] || {};
    $.productIcon.image = args.icon;
    $.productTitle.text = args.title;
    $.productShortDesc.text = args.shortDesc;
    $.productPrice.text = args.price;
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._, $model;

module.exports = Controller;