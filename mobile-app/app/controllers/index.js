
function fillStartPage(text)
{
	$.startContent.html = text;
	
}
require('communication').startScreen(fillStartPage);
$.index.open();
