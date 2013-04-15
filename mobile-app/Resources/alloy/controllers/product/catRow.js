function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    $model = arguments[0] ? arguments[0].$model : null;
    var $ = this, exports = {}, __defers = {};
    $.__views.catRow = Ti.UI.createTableViewRow({
        id: "catRow"
    });
    $.addTopLevelView($.__views.catRow);
    $.__views.title = Ti.UI.createLabel({
        id: "title"
    });
    $.__views.catRow.add($.__views.title);
    $.__views.url = Ti.UI.createLabel({
        id: "url"
    });
    $.__views.catRow.add($.__views.url);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var args = arguments[0] || {};
    Ti.API.info(args);
    $.catRow.title = args.title;
    $.url = args.url;
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._, $model;

module.exports = Controller;