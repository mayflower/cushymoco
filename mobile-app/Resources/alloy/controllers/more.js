function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    var $ = this;
    var exports = {};
    $.__views.moreWindow = Ti.UI.createWindow({
        backgroundColor: "#fff",
        title: "More Info",
        id: "moreWindow"
    });
    $.__views.__alloyId3 = Alloy.createController("more/contents", {
        contentId: "",
        id: "__alloyId3",
        __parentSymbol: $.__views.moreWindow
    });
    $.__views.__alloyId3.setParent($.__views.moreWindow);
    $.__views.moreNavGroup = Ti.UI.iPhone.createNavigationGroup({
        window: $.__views.moreWindow,
        id: "moreNavGroup"
    });
    $.__views.moreNavGroup && $.addTopLevelView($.__views.moreNavGroup);
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.moreNavGroup;
    Alloy.CFG.moreNavGroup = $.moreNavGroup;
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;