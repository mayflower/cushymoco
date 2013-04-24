function Controller() {
    function openNav(e) {
        var isProduct = e.index >= categoryList.length;
        var index = isProduct ? e.index - categoryList.length : e.index;
        if (isProduct) {
            var selModel = productList.at(index);
            var navWin = Alloy.createController("product/details", {
                productId: selModel.get("productId")
            }).getView();
        } else {
            var selModel = categoryList.at(index);
            var navWin = Alloy.createController("product/categories", {
                catId: e.rowData.id
            }).getView();
        }
        Alloy.CFG.productNavGroup.open(navWin, {
            animated: true
        });
        navWin.title = selModel.get("title");
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    var $ = this;
    var exports = {};
    var __defers = {};
    $.categoryList = Alloy.createCollection("category");
    $.__views.index = Ti.UI.createWindow({
        backgroundColor: "#fff",
        title: "Window Title",
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    $.__views.categoryTable = Ti.UI.createTableView({
        id: "categoryTable"
    });
    $.__views.index.add($.__views.categoryTable);
    openNav ? $.__views.categoryTable.addEventListener("click", openNav) : __defers["$.__views.categoryTable!click!openNav"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    var args = arguments[0] || {};
    var categoryList = Alloy.createCollection("category");
    var productList = Alloy.createCollection("productShort");
    var tableData;
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
                hasChild: true
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

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;