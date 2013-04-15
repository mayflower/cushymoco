function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    $model = arguments[0] ? arguments[0].$model : null;
    var $ = this, exports = {}, __defers = {};
    $.__views.productWindow = Ti.UI.createWindow({
        backgroundColor: "#fff",
        title: "Products",
        id: "productWindow"
    });
    $.__views.__alloyId9 = Alloy.createController("product/categories", {
        id: "__alloyId9"
    });
    $.__views.productGroup = Ti.UI.iPhone.createNavigationGroup({
        window: $.__views.__alloyId9.getViewEx({
            recurse: !0
        }),
        id: "productGroup"
    });
    $.__views.productWindow.add($.__views.productGroup);
    $.__views.products = Ti.UI.createTab({
        window: $.__views.productWindow,
        title: "Products Tab",
        id: "products"
    });
    $.addTopLevelView($.__views.products);
    exports.destroy = function() {};
    _.extend($, $.__views);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._, $model;

module.exports = Controller;