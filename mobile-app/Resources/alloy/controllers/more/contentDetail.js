function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    var $ = this;
    var exports = {};
    $.__views.index = Ti.UI.createWindow({
        backgroundColor: "#fff",
        title: "Window Title",
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    $.__views.contentData = Ti.UI.createWebView({
        id: "contentData"
    });
    $.__views.index.add($.__views.contentData);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var args = arguments[0] || {};
    var contentDetails = Alloy.createModel("content");
    contentDetails.fetch({
        data: {
            contentId: args.contentId
        }
    });
    contentDetails.on("change", function() {
        var contentData = contentDetails.get("content") || "";
        $.contentData.html = contentData;
    });
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;