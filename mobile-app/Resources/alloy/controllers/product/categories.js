function Controller() {
    function openNav(e) {
        var isProduct = e.index >= categoryList.length, index = isProduct ? e.index - categoryList.length : e.index;
        if (isProduct) {
            var selModel = productList.at(index);
            Ti.API.error("Selected product ID: " + selModel.get("productId"));
        } else {
            var selModel = categoryList.at(index), navWin = Alloy.createController("product/categories", {
                catId: e.rowData.id
            }).getView();
            Alloy.CFG.productNavGroup.open(navWin, {
                animated: !0
            });
            navWin.title = selModel.get("title");
        }
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    $model = arguments[0] ? arguments[0].$model : null;
    var $ = this, exports = {}, __defers = {};
    $.categoryList = Alloy.createCollection("category");
    $.__views.index = Ti.UI.createWindow({
        backgroundColor: "#fff",
        title: "Window Title",
        id: "index"
    });
    $.addTopLevelView($.__views.index);
    $.__views.categoryTable = Ti.UI.createTableView({
        id: "categoryTable"
    });
    $.__views.index.add($.__views.categoryTable);
    openNav ? $.__views.categoryTable.addEventListener("click", openNav) : __defers["$.__views.categoryTable!click!openNav"] = !0;
    exports.destroy = function() {};
    _.extend($, $.__views);
    var args = arguments[0] || {}, categoryList = Alloy.createCollection("category"), productList = Alloy.createCollection("productShort"), tableData;
    categoryList.fetch({
        data: {
            catId: args.catId
        }
    });
    categoryList.on("reset", function() {
        tableData = [];
        categoryList.map(function(category) {
            var row = Ti.UI.createTableViewRow({
                id: category.get("categoryId"),
                title: category.get("title"),
                hasChild: !0
            });
            tableData.push(row);
        });
        $.categoryTable.setData(tableData);
        productList.fetch({
            data: {
                catId: args.catId
            }
        });
    });
    productList.on("reset", function() {
        productList.map(function(product) {
            var row = Alloy.createController("product/productRow", {
                icon: product.get("icon"),
                title: product.get("title"),
                shortDesc: product.get("shortDesc"),
                price: product.get("formattedPrice")
            }).getView();
            tableData.push(row);
        });
        $.categoryTable.setData(tableData);
    });
    __defers["$.__views.categoryTable!click!openNav"] && $.__views.categoryTable.addEventListener("click", openNav);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._, $model;

module.exports = Controller;