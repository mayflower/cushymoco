var productsWin;
function openProductsWin(e)
{
    if (!productsWin) {
        productsWin = Alloy.createController('products').getView();
        $.productsWindow.add(productsWin);
    }
}
var moreWin;
function openMoreWin(e)
{
    if (!moreWin) {
        moreWin = Alloy.createController('more').getView();
        $.moreWindow.add(moreWin);
    }
}
function fillStartPage(text)
{
	$.startContent.html = text;
	
}

$.productsTab.addEventListener("focus", openProductsWin);
$.moreTab.addEventListener("focus", openMoreWin);

require('communication').startScreen(fillStartPage);
$.index.open();
