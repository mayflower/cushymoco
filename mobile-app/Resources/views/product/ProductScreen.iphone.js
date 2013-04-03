exports.ProductScreen = function(navigation, productData) {
   
   Ti.API.info("iphone screen");

	var globals = require('globals');
    var styles = require('UIStyle');
    var PickerElements = require('views/PickerElements');

    var topHeight = globals.screenHeight * 0.30;
    var bottomHeight = globals.screenHeight * 0.50;

    var dataViews = [];
    globals._.each(productData.data, function(data) {
        if (data && data.length > 0) {
            dataViews.push(Titanium.UI.createWebView({
                backgroundColor: '#FFF',
                enableZoomControls: false,
                html: data
            }));
        }
    });

    /**
     * Add information for product data
     */
    var dataScrollView = Titanium.UI.createScrollableView({
        views: dataViews,
        backgroundColor: '#FFF',
        showPagingControl: true,
        disableBounce: true,
        height: bottomHeight,
        top: '60dp'
    });

    var dataOverview = Titanium.UI.createView({
        backgroundColor: '#000',
        height: bottomHeight,
        visible: true
    });

    var cartButtonoptions = {
        backgroundImage: 'icons/icon_shopping_cart.png',
        top: '17dp',
        right: '35dp'
    };
    globals._.defaults(cartButtonoptions, styles.PageItems.IconButton);
    var cartButton = Titanium.UI.createButton(cartButtonoptions);
    cartButton.addEventListener('click', function() {
        var productId = productData.hasVariants ? productData.variantId : productData.id;
        globals.httpManager.request(
            globals.httpManager.buildUrl({ fnc: 'addToBasket', anid: productId , qty: 1}),
            function() {
                var response = JSON.parse(this.responseText);
                if (response.result) {
                    Titanium.App.fireEvent('additemtocart', { source: cartButton, type: 'additemtocart' });
                } else {
                    alert(response.error);
                }
            }
        );
    });

    var videoButtonOptions = {
        backgroundImage: 'icons/icon_filming.png',
        top: '19dp',
        right: '8dp',
        visible: false
    };
    globals._.defaults(videoButtonOptions, styles.PageItems.IconButton);
    var videoButton = Titanium.UI.createButton(videoButtonOptions);
    videoButton.hide();

    var titleLabel = Titanium.UI.createLabel({
        text: productData.title,
        color: '#FFF',
        font: {
            fontSize: 16,
            fontWeight: 'bold'
        },
        height: '60dp',
        width: globals.screenWidth * 0.6,
        top: '2dp',
        left: '2dp'
    });

    var priceLabel = Titanium.UI.createLabel({
        text: productData.price ? productData.price + productData.currency : L('price_on_request'),
        color: productData.campaign ? '#FF5555' : '#FFF',
        font: {
            fontSize: 16,
            fontWeight: 'bold'
        },
        height: '60dp',
        width: 'auto',
        top: '2dp',
        right: '70dp'
    });

    var checkVariantSelection = function () {
        var variantSelected = true;
        var variantIDs = "";
        globals._.each(variantPicker, function(pickerObject, key) {
            if ((typeof pickerObject.valueId != 'undefined') && pickerObject.valueId != '') {
                variantSelected = variantSelected && true;
                variantIDs += "&selectedVariant[" + key + "]=" + pickerObject.valueId;
            } else {
                variantSelected = variantSelected && false;
            }
        });
        
        if (variantSelected) {
            var requestUrl = globals.httpManager.buildUrl({fnc:'getVariantProductId',anid:productData.id}) + variantIDs;
            
            globals.httpManager.request(
                requestUrl,
                function () {
                    var result = JSON.parse(this.responseText).result;
                    globals._.extend(productData, {variantId:result});
                }
            );
        }
        
        cartButton.enabled = variantSelected;
    };
    
    var buildVariantSelects = function (screen, picker, pickerIndex) {
        var requestUrl = globals.httpManager.buildUrl({fnc:'getArticleVariants',anid:productData.id});
        globals._.each(variantPicker, function(pickerObject, vgKey){
            var variantId = '';
            if (typeof pickerObject.valueId != 'undefined') {
                variantId = pickerObject.valueId;
            }
            requestUrl += "&selectedVariant[" + vgKey + "]=" + variantId;
        });
        
        globals.httpManager.request(
            requestUrl,
            function() {
                var clickCallback = function (field) {
                    checkVariantSelection();
                };
                
                var pickerData = [];
                var variantsData = JSON.parse(this.responseText).result;
                globals._.each(variantsData[pickerIndex], function(variant, key){
                    pickerData.push(Titanium.UI.createPickerRow(variant));
                });
                PickerElements.PickerView(screen, picker, pickerData, clickCallback);
            }
        );
    };
    
    if (productData.hasVariants) {
        var variantsScrollView = Titanium.UI.createScrollView({
            contentHeight:'auto',
            contentWidth:'auto',
            showVerticalScrollIndicator:true,
            showHorizontalScrollIndicator:false,
            height:'100%',
            width:'100%',
            layout:'vertical'
        });
        var variantsView = Titanium.UI.createView({
            backgroundColor: '#FFF',
            height:(70 * productData.variantGroups.length + 95),
            top:0,
            width:globals.screenWidth
        });

        var variantsLabel = Titanium.UI.createLabel({
            textid:"products_variants",
            width:'auto',
            height:'auto',
            top: '0dp',
            left:'10dp',
            font: {
                fontSize: '20dp',
                fontWeight: 'bold'
            }
        });
        variantsView.add(variantsLabel);

        var variantPicker = [];
        var pickerLabels = [];
        globals._.each(
            productData.variantGroups,
            function (variantGroup, vgKey) {
                pickerLabels[vgKey] = Titanium.UI.createLabel({
                    text:variantGroup,
                    width:'auto',
                    height:'auto',
                    top: globals.isAndroid ? '35dp' : ((vgKey * 70 + 25) + 'dp'),
                    left:'10dp',
                    font: {
                        fontSize: '16dp',
                        fontWeight: 'bold'
                    }
                });
                variantsView.add(pickerLabels[vgKey]);

                variantPicker[vgKey] = new PickerElements.PickerField(
                    function(){
                        buildVariantSelects(screen, variantPicker[vgKey], vgKey);
                    },
                    {top:(48 + vgKey * 70) + 'dp',left:'10dp'}
                );
                variantsView.add(variantPicker[vgKey]);
            }
        );
        variantsScrollView.add(variantsView);
        
        dataScrollView.addView(variantsScrollView);
        cartButton.enabled = false;
    }

    dataOverview.add(dataScrollView);
    dataOverview.add(cartButton);
    dataOverview.add(videoButton);
    dataOverview.add(titleLabel);
    dataOverview.add(priceLabel);

    /**
     * Add (expandable) scrollable image view
     */
    var imageScrollView = Titanium.UI.createScrollableView({
        backgroundColor: '#000',
        views: [],
        showPagingControl: true,
        disableBounce: true,
        height: topHeight
    });

    globals.httpManager.request(
        globals.httpManager.buildUrl({ fnc: 'getArticleImages', anid: productData.id }),
        function() {
            var response = JSON.parse(this.responseText);
            globals._.each(response.result.Pics, function(image) {
                if (image.length > 0) {
                    var imageView = Titanium.UI.createImageView({
                        image: image
                    });

                    imageView.addEventListener('dblclick', function() {
                        if (dataOverview.visible) {
                            dataOverview.hide();
                            dataOverview.visible = false;
                            imageScrollView.animate({ height: topHeight + bottomHeight, top: 0, duration: 750 });
                        } else {
                            imageScrollView.animate(
                                { height: topHeight, duration: 750 },
                                function() { dataOverview.show(); dataOverview.visible = true; }
                            );
                        }
                    });

                    imageScrollView.addView(imageView);
                }
            });
        }
    );

    var screen = null;
    
    screen = Titanium.UI.createWindow({
    	title: productData.title,
        layout: 'vertical'
    });

    screen.add(imageScrollView);
    screen.add(dataOverview);
    return screen;
};
