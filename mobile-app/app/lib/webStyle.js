
var templateFile = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, 'templates/page.html');
var pageTemplate = '';
if (templateFile.exists()) {
    pageTemplate = templateFile.read().text;
}


exports.getBasicPageLayout = function (content, isEmbedded) {
	
	if (isEmbedded === undefined) {
		isEmbedded = true;
	}
	
	//inject fireEvent code to a tags
    //content = content.replace(/<a /gi, '<a onClick="fireLinkClickEvent"');
    
    if (isEmbedded) {
    	content = '<div class="embedded-view">'+content+'</div>';
    }
    
	content = pageTemplate.replace("<%=content%>", content);
    return content;
};
