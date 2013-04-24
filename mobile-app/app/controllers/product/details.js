var args = arguments[0] || {};

var productPictures = Alloy.createCollection('productPicture');
var productDetails = Alloy.createModel('product');

productPictures.on("reset", function(){
    productPictures.map(function(productPicture){
        $.productPictures.addView(Titanium.UI.createImageView({image:productPicture.get("image")}));
    });
});

productPictures.fetch({data:{productId:args.productId}});

productDetails.on("change", function(){
    $.productTitle.setText(productDetails.get("title"));
    $.productPrice.setText(productDetails.get("formattedPrice"));
    $.cartButton.enabled = true;
    
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
    
    $.productInfo.addView(Titanium.UI.createWebView({html:productDetails.get("longDesc")}));
    
    // Show paging control if there are more than one information pages.
    $.productInfo.showPagingControl = ($.productInfo.views.length > 1);
});
productDetails.fetch({data:{productId:args.productId}});
