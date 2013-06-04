var comm = require("communication");
var searchList = Alloy.createCollection("productSearch");

var searchMoreButtonPosition = -1;
var itemsShown = 0;
var currentSearchPhrase = "";
var tableData = [];
var productData = [];

var itemsPerPage = 10;
var currentPage = 0;

searchList.on('reset', redrawList);



function onSearchMoreButtonClicked(e) {
	//remove the search button
	if(searchMoreButtonPosition > 0 ) {
		$.searchResultTable.deleteRow(searchMoreButtonPosition);		
	}
	searchList.fetch({data:{searchParam:currentSearchPhrase, itemsPerPage: 5, page: currentPage}});	

}


function doSearch(e) {
	currentSearchPhrase = $.searchPhrase.value;
	tableData = [];
	productData = [];
	itemsShown = 0;
	searchList.fetch({data:{searchParam:currentSearchPhrase, itemsPerPage: 5, page: currentPage}});	
};


function redrawList() {
    currentPage++;
   
    if (_.size(searchList) == 0) {
    	$.searchResultTable.visible = false;
    	$.numberOfResults.text = "Es wurden leider keine zur Suchanfrage passenden Produkte gefunden.";
    	alert("Zu diesem Begriff konnten leider keine Ergebnisse gefunden werden.");
    	return;
    }
    $.numberOfResults.text = "Es wurden "+ searchList.totalAmount +" Produkte gefunden.";
    
    searchList.each(function (product, index, list) {    	
        var row = Alloy.createController("product/productRow", {
            "icon":product.get("icon"),
            "title":product.get("title"),
            "shortDesc":product.get("short"),
            "price":product.get("price")
        }).getView();
        tableData.push(row);
		productData.push(product);
    });
    
    var searchMoreRow = Ti.UI.createTableViewRow({
    	height:110
    });
    
    itemsShown += _.size(searchList);
    
    $.searchResultTable.setData(tableData);
    
    if (itemsShown < searchList.totalAmount) {
	    var searchMoreButton = Ti.UI.createButton({systemButton: Ti.UI.iPhone.SystemButton.REFRESH, top:6, left:10, width:50, height: 50});
	    searchMoreButton.addEventListener('click', onSearchMoreButtonClicked);
	    searchMoreRow.add(searchMoreButton);
	    searchMoreButtonPosition = tableData.length;
	    $.searchResultTable.appendRow(searchMoreRow);    	
    }
    $.searchResultTable.visible = true;
    
    
    
}



function onSearchItemClicked(e) {
	if (e.index == searchMoreButtonPosition) {
		return;
	}
	var selModel = productData[e.index];
    var navWin = Alloy.createController("product/details", {"productId":selModel.get('id')}).getView();
    Alloy.CFG.searchNavGroup.open(navWin, {animated:true});
	navWin.title = selModel.get("title");
}
