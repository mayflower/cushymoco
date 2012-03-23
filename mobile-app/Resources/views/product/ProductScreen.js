exports.ProductScreen = function(navigation, productData) {
    var globals = require('globals');
    var styles = require('UIStyle');
    var topHeight = globals.screenHeight * 0.30;
    var bottomHeight = globals.screenHeight * (globals.isAndroid ?  0.525 : 0.50);

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
        top: globals.isAndroid ? '35dp' : '60dp'
    });

    var dataOverview = Titanium.UI.createView({
        backgroundColor: '#000',
        height: bottomHeight,
        visible: true
    });

    var cartButtonoptions = {
        backgroundImage: (globals.isAndroid) ? '../../icons/icon_shopping_cart.png' : 'icons/icon_shopping_cart.png',
        top: globals.isAndroid ? '2dp' : '17dp',
        right: '35dp'
    };
    globals._.defaults(cartButtonoptions, styles.PageItems.IconButton);
    var cartButton = Titanium.UI.createButton(cartButtonoptions);
    cartButton.addEventListener('click', function() {
        if (globals.isAndroid) {
            Titanium.UI.createAlertDialog({
                title: '',
                message: L('product_add_to_cart'),
                ok: L('ok_button')
            }).show();
        }

        globals.httpManager.request(
            globals.httpManager.buildUrl({ fnc: 'addToBasket', anid: productData.id , qty: 1}),
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
        backgroundImage: (globals.isAndroid) ? '../../icons/icon_filming.png' : 'icons/icon_filming.png',
        top: globals.isAndroid ? '4dp' : '19dp',
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
        height: globals.isAndroid ? '30dp' : '60dp',
        width: globals.screenWidth * 0.6,
        top: '2dp',
        left: globals.isAndroid ? '0dp' : '2dp'
    });

    var priceLabel = Titanium.UI.createLabel({
        text: productData.price ? productData.price + productData.currency : L('price_on_request'),
        color: productData.campaign ? '#FF5555' : '#FFF',
        font: {
            fontSize: 16,
            fontWeight: 'bold'
        },
        height: globals.isAndroid ? '30dp' : '60dp',
        width: 'auto',
        top: '2dp',
        right: '70dp'
    });

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
    if (globals.isAndroid) {
        screen = Titanium.UI.createView({
            layout: 'vertical'
        });
    } else {
        screen = Titanium.UI.createWindow({
            title: productData.title,
            layout: 'vertical'
        });
    }

    screen.add(imageScrollView);
    screen.add(dataOverview);
    return screen;
};
