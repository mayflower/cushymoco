
//TODO: check if file really exists
var pageTemplate = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, 'templates/page.html').read().text;


exports.getBasicPageLayout = function (content) {
	
	//inject fireEvent code to a tags
    content = content.replace(/<a /gi, "<a onClick='Ti.App.fireEvent(\"linkClickEvent\", {url: this.href}); return false;'");
	content = pageTemplate.replace("<%=content%>", content);
    return content;
};
