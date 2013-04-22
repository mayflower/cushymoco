var args = arguments[0] || {};
// var categoryList = $.categoryList;
var categoryList = Alloy.createCollection("category");
var productList = Alloy.createCollection("productShort");
var tableData;

categoryList.fetch({data:{catId:args.catId}});

categoryList.on('reset', function () {
    tableData = [];
    
    categoryList.map(function(category){
        var row = Ti.UI.createTableViewRow({"id":category.get("categoryId"),"title":category.get("title"), hasChild:true});
        // row.setData(category);
        tableData.push(row);
    });
    
    $.categoryTable.setData(tableData);
    
    productList.fetch({data:{catId:args.catId}});
});

productList.on('reset', function () {
    productList.map(function(product){
        // var row = Ti.UI.createTableViewRow({"id":product.get("productId"),"title":product.get("title"), hasChild:false});
        // row.setData(product);
        var row = Alloy.createController("product/productRow", {
            "icon":product.get("icon"),
            "title":product.get("title"),
            "shortDesc":product.get("shortDesc"),
            "price":product.get("formattedPrice")
        }).getView();
        tableData.push(row);
    });
    
    $.categoryTable.setData(tableData);
});

function openNav(e) {
    var isProduct = e.index >= categoryList.length;
    var index = isProduct ? e.index - categoryList.length : e.index;
    if (isProduct) {
        var selModel = productList.at(index);
        var navWin = Alloy.createController("product/details", {"productId":selModel.get('productId')}).getView();
    } else  {
        var selModel = categoryList.at(index);
        var navWin = Alloy.createController("product/categories", {"catId":e.rowData.id}).getView();
    }
    Alloy.CFG.productNavGroup.open(navWin, {animated:true});
    navWin.title = selModel.get("title");
}
