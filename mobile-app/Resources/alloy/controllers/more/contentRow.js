function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    var $model = arguments[0] ? arguments[0]["$model"] : null;
    var $ = this;
    var exports = {};
    $.__views.contentRow = Ti.UI.createTableViewRow({
        id: "contentRow"
    });
    $.__views.contentRow && $.addTopLevelView($.__views.contentRow);
    $.__views.contentTitle = Ti.UI.createLabel({
        id: "contentTitle",
        text: "undefined" != typeof $model.__transform["title"] ? $model.__transform["title"] : $model.get("title")
    });
    $.__views.contentRow.add($.__views.contentTitle);
    exports.destroy = function() {};
    _.extend($, $.__views);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;