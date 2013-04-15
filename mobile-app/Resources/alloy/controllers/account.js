function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    $model = arguments[0] ? arguments[0].$model : null;
    var $ = this, exports = {}, __defers = {};
    $.__views.__alloyId0 = Ti.UI.createWindow({
        backgroundColor: "#fff",
        title: "Accounts Window",
        id: "__alloyId0"
    });
    $.__views.__alloyId1 = Ti.UI.createLabel({
        text: "Brunsverreggd",
        id: "__alloyId1"
    });
    $.__views.__alloyId0.add($.__views.__alloyId1);
    $.__views.account = Ti.UI.createTab({
        window: $.__views.__alloyId0,
        title: "Accounts Tab",
        id: "account"
    });
    $.addTopLevelView($.__views.account);
    exports.destroy = function() {};
    _.extend($, $.__views);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._, $model;

module.exports = Controller;