function Controller() {
    function fillStartPage(text) {
        $.startContent.html = text;
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    $model = arguments[0] ? arguments[0].$model : null;
    var $ = this, exports = {}, __defers = {};
    $.__views.index = Ti.UI.createTabGroup({
        id: "index"
    });
    $.__views.win1 = Ti.UI.createWindow({
        backgroundColor: "#fff",
        title: "Window 1",
        layout: "vertical",
        id: "win1"
    });
    $.__views.startContent = Ti.UI.createWebView({
        id: "startContent"
    });
    $.__views.win1.add($.__views.startContent);
    $.__views.tab1 = Ti.UI.createTab({
        title: "Tab 1",
        window: $.__views.win1,
        id: "tab1"
    });
    $.__views.index.addTab($.__views.tab1);
    $.__views.__alloyId4 = Alloy.createController("products", {
        id: "__alloyId4"
    });
    $.__views.index.addTab($.__views.__alloyId4.getViewEx({
        recurse: !0
    }));
    $.__views.__alloyId6 = Alloy.createController("search", {
        id: "__alloyId6"
    });
    $.__views.index.addTab($.__views.__alloyId6.getViewEx({
        recurse: !0
    }));
    $.__views.__alloyId8 = Alloy.createController("account", {
        id: "__alloyId8"
    });
    $.__views.index.addTab($.__views.__alloyId8.getViewEx({
        recurse: !0
    }));
    $.addTopLevelView($.__views.index);
    exports.destroy = function() {};
    _.extend($, $.__views);
    require("communication").startScreen(fillStartPage);
    $.index.open();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._, $model;

module.exports = Controller;