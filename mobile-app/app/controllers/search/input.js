var comm = require("communication");
var searchList = Alloy.createCollection("productSearch");

var searchMoreButtonPosition = -1;
var itemsShown = 0;
var currentSearchPhrase = "";
var tableData = [];
var productData = [];

var itemsPerPage = 25;
var currentPage = 0;

searchList.on('reset', redrawList);



function onSearchMoreButtonClicked(e) {
	//remove the search button
	if(searchMoreButtonPosition > 0 ) {
	    var loadingRow = Ti.UI.createTableViewRow({
	    	height:110
	    });

		var loadingLabel = Ti.UI.createLabel({
		  color: '#000',
		  font: { fontSize:22 },
		  shadowColor: '#aaa',
		  shadowOffset: {x:1, y:1},
		  text: 'Lade weitere Produkte... bitte warten!',
		  textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
		  top: 30,
		  width: Ti.UI.SIZE, height: Ti.UI.SIZE
		});
		loadingRow.add(loadingLabel);
	    $.searchResultTable.appendRow(loadingRow);    	

		$.searchResultTable.deleteRow(searchMoreButtonPosition);		
	}
	searchList.fetch({data:{searchParam:currentSearchPhrase, itemsPerPage: itemsPerPage, page: currentPage}});	

}


function doSearch(e) {
	currentSearchPhrase = $.searchPhrase.value;
	tableData = [];
	productData = [];
	itemsShown = 0;
	currentPage = 0;
	searchList.fetch({data:{searchParam:currentSearchPhrase, itemsPerPage: itemsPerPage, page: currentPage}});	
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
    
    searchMoreButtonPosition = tableData.length;
    
    if (itemsShown < searchList.totalAmount) {
	    var searchMoreButton = Ti.UI.createButton({systemButton: Ti.UI.iPhone.SystemButton.REFRESH, top:6, left:10, width:50, height: 50});
	    searchMoreButton.addEventListener('click', onSearchMoreButtonClicked);
	    searchMoreRow.add(searchMoreButton);
	    $.searchResultTable.appendRow(searchMoreRow);    	
    } else {
    	
    	//show "No more products availalbe for this search"
	    var noMoreProductsRow = Ti.UI.createTableViewRow({
	    	height:110
	    });

		var noMoreProductsLabel = Ti.UI.createLabel({
		  color: '#000',
		  font: { fontSize:22 },
		  shadowColor: '#aaa',
		  shadowOffset: {x:1, y:1},
		  text: 'Zu dieser Suche wurden keine weiteren Produkte gefunden. Versuchen Sie es mit einem anderen Suchbegriff!',
		  textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
		  top: 30,
		  width: Ti.UI.SIZE, height: Ti.UI.SIZE
		});
		noMoreProductsRow.add(noMoreProductsLabel);
	    $.searchResultTable.appendRow(noMoreProductsRow);    	    	
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