function Controller() {
    function openProductDetail() {}
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    $model = arguments[0] ? arguments[0].$model : null;
    var $ = this, exports = {}, __defers = {};
    $.__views.categories = Ti.UI.createWindow({
        backgroundColor: "#fff",
        title: "Categories",
        id: "categories"
    });
    $.addTopLevelView($.__views.categories);
    $.__views.categoryTable = Ti.UI.createTableView({
        id: "categoryTable"
    });
    $.__views.categories.add($.__views.categoryTable);
    $.__views.categoriesLabel = Ti.UI.createLabel({
        text: "Categories",
        id: "categoriesLabel"
    });
    $.__views.categoryTable.headerView = $.__views.categoriesLabel;
    openProductDetail ? $.__views.categoryTable.addEventListener("click", openProductDetail) : __defers["$.__views.categoryTable!click!openProductDetail"] = !0;
    exports.destroy = function() {};
    _.extend($, $.__views);
    var categories = [ {
        id: "0xdeadbeef",
        title: "Wakeboards"
    }, {
        id: "0xf00f00f",
        title: "Bindungen"
    } ], data = [];
    _.each(categories, function(stats, name) {
        data.push(Alloy.createController("product/catRow", {
            title: stats.title,
            url: require("communication").buildUrl([ {
                cnid: stats.id
            } ])
        }).getView());
    });
    $.categoryTable.setData(data);
    __defers["$.__views.categoryTable!click!openProductDetail"] && $.__views.categoryTable.addEventListener("click", openProductDetail);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._, $model;

module.exports = Controller;