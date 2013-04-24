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
    
    $.contentTable.setData(tableData);
    
});

function openContent(e) {
	var selModel = contentList.at(e.index);
    var contentWin = Alloy.createController("more/contentDetail", {"contentId":e.rowData.id, "contentData":selModel.get('text')}).getView();
    Alloy.CFG.moreNavGroup.open(contentWin, {animated:true});
    contentWin.title = selModel.get("title");
}
