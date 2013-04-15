var communication = require('communication');
function openProductDetail()
{}

var categories = [
	{"id":"0xdeadbeef", "title":"Wakeboards"},
	{"id":"0xf00f00f", "title":"Bindungen"}
];
var data = [];
_.each(categories, function(stats, name){
	data.push(Alloy.createController('product/catRow', {
		title: stats.title,
		url: communication.buildUrl({"cnid":stats.id})
	}).getView());
});

$.categoryTable.setData(data)
