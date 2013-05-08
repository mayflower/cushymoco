var args = arguments[0] || {};
var webStyle = require('webStyle');

var contentDetails = Alloy.createModel('content');
contentDetails.fetch({data:{contentId:args.contentId}});

contentDetails.on('change', function(){
	var contentData = contentDetails.get('content') || '';
	$.contentData.html = webStyle.getBasicPageLayout(contentData);
});
