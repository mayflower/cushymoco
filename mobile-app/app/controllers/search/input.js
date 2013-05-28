var comm = require("communication");
var searchList = Alloy.createCollection("productSearch");

searchList.on('reset', redrawList);

function doSearch(e) {
	searchList.fetch({data:{searchParam:$.searchPhrase.value}});	
};


function redrawList() {
    var tableData = [];
    
    if (_.size(searchList) == 0) {
    	$.searchResultTable.visible = false;
    	$.numberOfResults.text = "Es wurden leider keine zur Suchanfrage passenden Produkte gefunden.";
    	alert("Zu diesem Begriff konnten leider keine Ergebnisse gefunden werden.");
    	return;
    }
    $.numberOfResults.text = "Es wurden "+ _.size(searchList)+" Produkte gefunden.";
    
    searchList.each(function (product, index, list) {    	
        var row = Alloy.createController("product/productRow", {
            "icon":product.get("icon"),
            "title":product.get("title"),
            "shortDesc":product.get("short"),
            "price":product.get("price")
        }).getView();
        tableData.push(row);

	    $.searchResultTable.setData(tableData);
	    $.searchResultTable.visible = true;
    });
}


function onSearchItemClicked(e) {
	var selModel = searchList.at(e.index);
    var navWin = Alloy.createController("product/details", {"productId":selModel.get('id')}).getView();
    Alloy.CFG.searchNavGroup.open(navWin, {animated:true});
	navWin.title = selModel.get("title");
}
