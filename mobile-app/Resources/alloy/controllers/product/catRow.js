function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    var $model = arguments[0] ? arguments[0]["$model"] : null;
    var $ = this;
    var exports = {};
    $.__views.catRow = Ti.UI.createTableViewRow({
        id: "catRow"
    });
    $.__views.catRow && $.addTopLevelView($.__views.catRow);
    $.__views.cateoryTitle = Ti.UI.createLabel({
        id: "cateoryTitle",
        text: "undefined" != typeof $model.__transform["title"] ? $model.__transform["title"] : $model.get("title")
    });
    $.__views.catRow.add($.__views.cateoryTitle);
    exports.destroy = function() {};
    _.extend($, $.__views);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;