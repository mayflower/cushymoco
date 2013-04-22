var args = arguments[0] || {};

var productPictures = Alloy.createCollection('productPicture');
var productDetails = Alloy.createModel('product');

productPictures.fetch({data:{productId:args.productId}});
productPictures.on("reset", function(){
    productPictures.map(function(productPicture){
        $.productPictures.addView(Titanium.UI.createImageView({image:productPicture.get("image")}));
    });
});

productDetails.fetch({data:{productId:args.productId}});
productDetails.on("change", function(){
    $.productTitle.setText(productDetails.get("title"));
    $.productPrice.setText(productDetails.get("formattedPrice"));
    $.productInfo.addView(Titanium.UI.createWebView({data:productDetails.get("longDesc")}));
});
