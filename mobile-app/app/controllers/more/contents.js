var args = arguments[0] || {};
// var categoryList = $.categoryList;
var contentList = Alloy.createCollection("content");
var tableData;

contentList.fetch({data:{contentId:args.contentId}});

contentList.on('reset', function () {
    tableData = [];
    
    contentList.map(function(content){
        var row = Ti.UI.createTableViewRow({"id":content.get("contentId"),"title":content.get("title")});
        tableData.push(row);
    });
    tableData.push(Ti.UI.createTableViewRow({'id':'about', 'title':'About'})); // TODO: i18n
    
    $.contentTable.setData(tableData);
    
});

function openContent(e) {
	if (e.rowData.id == 'about') {
	    var contentWin = Alloy.createController("more/contentAbout").getView();
	    Alloy.CFG.moreNavGroup.open(contentWin, {animated:true});
	    contentWin.title = "About";
	} else {  
		var selModel = contentList.at(e.index);
	    var contentWin = Alloy.createController("more/contentDetail", {"contentId":e.rowData.id, "contentData":selModel.get('text')}).getView();
	    Alloy.CFG.moreNavGroup.open(contentWin, {animated:true});
	    contentWin.title = selModel.get("title");
    }
}
