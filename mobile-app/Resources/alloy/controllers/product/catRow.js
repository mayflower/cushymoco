function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    $model = arguments[0] ? arguments[0].$model : null;
    var $ = this, exports = {}, __defers = {};
    $.__views.catRow = Ti.UI.createTableViewRow({
        id: "catRow"
    });
    $.addTopLevelView($.__views.catRow);
    $.__views.cateoryTitle = Ti.UI.createLabel({
        id: "cateoryTitle",
        text: typeof $model.__transform.title != "undefined" ? $model.__transform.title : $model.get("title")
    });
    $.__views.catRow.add($.__views.cateoryTitle);
    exports.destroy = function() {};
    _.extend($, $.__views);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._, $model;

module.exports = Controller;