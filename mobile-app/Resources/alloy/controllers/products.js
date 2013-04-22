function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    var $ = this;
    var exports = {};
    $.__views.categoriesWindow = Ti.UI.createWindow({
        id: "categoriesWindow",
        title: "Catalog"
    });
    $.__views.__alloyId4 = Alloy.createController("product/categories", {
        catId: "",
        id: "__alloyId4",
        __parentSymbol: $.__views.categoriesWindow
    });
    $.__views.__alloyId4.setParent($.__views.categoriesWindow);
    $.__views.productNavGroup = Ti.UI.iPhone.createNavigationGroup({
        window: $.__views.categoriesWindow,
        id: "productNavGroup"
    });
    $.__views.productNavGroup && $.addTopLevelView($.__views.productNavGroup);
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.productNavGroup;
    Alloy.CFG.productNavGroup = $.productNavGroup;
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;