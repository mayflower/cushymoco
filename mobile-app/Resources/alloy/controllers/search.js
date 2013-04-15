function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    $model = arguments[0] ? arguments[0].$model : null;
    var $ = this, exports = {}, __defers = {};
    $.__views.__alloyId11 = Ti.UI.createWindow({
        backgroundColor: "#fff",
        title: "Search Window",
        id: "__alloyId11"
    });
    $.__views.__alloyId12 = Ti.UI.createLabel({
        text: "Buscare",
        id: "__alloyId12"
    });
    $.__views.__alloyId11.add($.__views.__alloyId12);
    $.__views.search = Ti.UI.createTab({
        window: $.__views.__alloyId11,
        title: "Search Tab",
        id: "search"
    });
    $.addTopLevelView($.__views.search);
    exports.destroy = function() {};
    _.extend($, $.__views);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._, $model;

module.exports = Controller;