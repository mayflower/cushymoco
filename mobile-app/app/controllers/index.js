var productsWin;
function openProductsWin(e)
{
    if (!productsWin) {
        productsWin = Alloy.createController('products').getView();
        $.productsWindow.add(productsWin);
    }
}
function fillStartPage(text)
{
	$.startContent.html = text;
	
}

$.productsTab.addEventListener("focus", openProductsWin);

require('communication').startScreen(fillStartPage);
$.index.open();
