function Controller() {
    function openContent(e) {
        var selModel = contentList.at(e.index);
        var contentWin = Alloy.createController("more/contentDetail", {
            contentId: e.rowData.id,
            contentData: selModel.get("text")
        }).getView();
        Alloy.CFG.moreNavGroup.open(contentWin, {
            animated: true
        });
        contentWin.title = selModel.get("title");
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    var $ = this;
    var exports = {};
    var __defers = {};
    $.contentList = Alloy.createCollection("content");
    $.__views.index = Ti.UI.createWindow({
        backgroundColor: "#fff",
        title: "Window Title",
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    $.__views.contentTable = Ti.UI.createTableView({
        id: "contentTable"
    });
    $.__views.index.add($.__views.contentTable);
    openContent ? $.__views.contentTable.addEventListener("click", openContent) : __defers["$.__views.contentTable!click!openContent"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    var args = arguments[0] || {};
    var contentList = Alloy.createCollection("content");
    var tableData;
    contentList.fetch({
        data: {
            contentId: args.contentId
        }
    });
    contentList.on("reset", function() {
        tableData = [];
        contentList.map(function(content) {
            var row = Ti.UI.createTableViewRow({
                id: content.get("contentId"),
                title: content.get("title")
            });
            tableData.push(row);
        });
        $.contentTable.setData(tableData);
    });
    __defers["$.__views.contentTable!click!openContent"] && $.__views.contentTable.addEventListener("click", openContent);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;