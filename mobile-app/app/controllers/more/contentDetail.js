var args = arguments[0] || {};

var contentDetails = Alloy.createModel('content');
contentDetails.fetch({data:{contentId:args.contentId}});

contentDetails.on('change', function(){
	var contentData = contentDetails.get('content') || '';
	$.contentData.html = contentData;
});
