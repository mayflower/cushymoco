
//TODO: check if file really exists
var pageTemplate = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, 'templates/page.html').read().text;


exports.getBasicPageLayout = function (content) {
	content = pageTemplate.replace("<%=content%>", content);
	return content;
};
