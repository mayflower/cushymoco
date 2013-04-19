function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    $model = arguments[0] ? arguments[0].$model : null;
    var $ = this, exports = {}, __defers = {};
    $.__views.categoriesWindow = Ti.UI.createWindow({
        backgroundColor: "#fff",
        title: "Catalog",
        id: "categoriesWindow"
    });
    $.__views.__alloyId4 = Alloy.createController("product/categories", {
        catId: "",
        id: "__alloyId4"
    });
    $.__views.__alloyId4.setParent($.__views.categoriesWindow);
    $.__views.productNavGroup = Ti.UI.iPhone.createNavigationGroup({
        window: $.__views.categoriesWindow,
        id: "productNavGroup"
    });
    $.addTopLevelView($.__views.productNavGroup);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var productNavGroup = $.productNavGroup;
    Alloy.CFG.productNavGroup = $.productNavGroup;
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._, $model;

module.exports = Controller;