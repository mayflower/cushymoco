var args = arguments[0] || {};
var webStyle = require("webStyle");

var productPictures = Alloy.createCollection('productPicture');
var productDetails = Alloy.createModel('product');

productPictures.on("reset", function(){
    productPictures.map(function(productPicture){
        $.productPictures.addView(Titanium.UI.createImageView({image:productPicture.get("image")}));
    });
});

productPictures.fetch({data:{productId:args.productId}});

productDetails.on("change", function(){
    $.detailsWindow.setTitle(productDetails.get("title"));
    $.productTitle.setText(productDetails.get("title"));
    $.productPrice.setText(productDetails.get("formattedPrice"));
    $.cartButton.enabled = true;
    Alloy.Globals.cartButton = $.cartButton;
    Alloy.Globals.addToCartProductId = args.productId;
    
    if (productDetails.get("hasVariants") == 1) {
        $.cartButton.enabled = false;
        $.productInfo.addView(
            Alloy.createController(
                "product/variants",
                {
                    productId:productDetails.get("productId"),
                    variantGroupCount:productDetails.get("variantGroupCount")
                }
            ).getView()
        );
    }
    
    var content = webStyle.getBasicPageLayout(productDetails.get("longDesc"));
    var contentView = Titanium.UI.createWebView({html:content});
    contentView.setDisableBounce(true);
    $.productInfo.addView(contentView);
    
    // Show paging control if there are more than one information pages.
    $.productInfo.showPagingControl = ($.productInfo.views.length > 1);
});
productDetails.fetch({data:{productId:args.productId}});

function addToBasket()
{
    // TODO Make quantity editable for the user.
    Alloy.Globals.addToCart(Alloy.Globals.addToCartProductId, 1);
}
