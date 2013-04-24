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

function tabChanged(e)
{
    Alloy.Globals.activeWindow = e.tab.getWindow();
}

function bindTabEvents(e)
{
    e.source.tabs.map(function(tab) {
        tab.addEventListener('focus', tabChanged);
    });
}

function fillStartPage(text)
{
	$.startContent.html = text;
	
}

$.productsTab.addEventListener("focus", openProductsWin);
$.moreTab.addEventListener("focus", openMoreWin);

require('communication').startScreen(fillStartPage);

Alloy.Globals.parent = $.index;
Alloy.Globals.cartTab = $.cartTab;
$.index.open();
