exports.SummaryScreen = function(navigation, windowStack) {
    var globals = require('globals');
    var styles = require('UIStyle');

    var acceptTermsAndConditions = false;
    var screen = null;
    var continueToNextStep = function() {
        if (acceptTermsAndConditions) {
            var deliveryId = globals.Database.getSetting('deliveryId');
            var billingId = globals.Database.getSetting('billingId');
            globals.httpManager.request(
                globals.httpManager.buildUrl({ fnc: 'executeOrder', ord_agb: 1, sShipSet: deliveryId, payment: billingId}),
                function() {
                    var response = JSON.parse(this.responseText);
                    if (response.result) {
                        var orderSuccessfulDialog = Titanium.UI.createAlertDialog({
                            title: '',
                            message: L('checkout_complete'),
                            ok: L('ok_button')
                        });
                        orderSuccessfulDialog.addEventListener('click', function() {
                            globals._.each(windowStack, function(window) {
                                navigation.close(window);
                            });
                            navigation.close(screen, { animated: true });
                        });

                        Titanium.App.fireEvent('updatecart', { source: screen, type: 'updatecart'});
                        orderSuccessfulDialog.show();

                    } else {
                        alert(response.error.message);
                    }
                }
            );
        } else {
            alert(L('terms_and_condition_not_accept'));
        }
    };

    if (globals.isAndroid) {
        screen = Titanium.UI.createView();
    } else {
        screen = Titanium.UI.createWindow({ titleid: 'checkout_billing_address_title' });

        var nextButton = Titanium.UI.createButton({ titleid: 'order_button'});
        nextButton.addEventListener('click', continueToNextStep);

        screen.setRightNavButton(nextButton);
    }

    var scrollView = Titanium.UI.createScrollView({
        backgroundColor: '#FFF',
        contentHeight: 'auto',
        top: '0dp',
        bottom: '0dp',
        scrollType: 'vertical',
        showVerticalScrollIndicator: true,
        showHorizontalScrollIndicator: false,
        disableBounce: true
    });
    screen.add(scrollView);

    var containerView = Ti.UI.createView({
        layout: 'vertical',
        backgroundColor: '#FFF',
        width: globals.screenWidth,
        height: 'auto',
        top: '10dp'
    });
    scrollView.add(containerView);

    var articleLabel = Titanium.UI.createLabel({
        textid: 'checkout_article_title',
        height: 'auto',
        width: 'auto',
        top: '10dp',
        left: '10dp',
        font: {
            fontSize: '16dp',
            fontWeight: 'bold'
        }
    });
    containerView.add(articleLabel);

    var deliveryLabel = Titanium.UI.createLabel({
        textid: 'checkout_delivery_total',
        font: {
            fontSize: '14dp',
            fontWeight: 'bold'
        },
        left: '10dp',
        height: 'auto',
        width: 'auto'
    });
    var deliveryValue = Titanium.UI.createLabel({
        text: '-',
        font: {
            fontSize: '14dp',
            fontWeight: 'bold'
        },
        right: '10dp',
        height: 'auto',
        width: 'auto'
    });
    var deliveryView = Titanium.UI.createView({ top: '10dp', height: 'auto', width: globals.screenWidth });
    deliveryView.add(deliveryLabel);
    deliveryView.add(deliveryValue);

    var totalLabel = Titanium.UI.createLabel({
        textid: 'checkout_article_total',
        font: {
            fontSize: '14dp',
            fontWeight: 'bold'
        },
        left: '10dp',
        height: 'auto',
        width: 'auto'
    });
    var totalValue = Titanium.UI.createLabel({
        text: '-',
        font: {
            fontSize: '14dp',
            fontWeight: 'bold'
        },
        right: '10dp',
        height: 'auto',
        width: 'auto'
    });
    var totalView = Titanium.UI.createView({ top: '10dp', height: 'auto', width: globals.screenWidth });
    totalView.add(totalLabel);
    totalView.add(totalValue);

    var footerView = Titanium.UI.createView({ layout: 'vertical', height: 'auto', width: 'auto' });
    footerView.add(deliveryView);
    footerView.add(totalView);

    var articleView = Titanium.UI.createView({ layout: 'vertical', height: 'auto', width: 'auto' });
    containerView.add(articleView);

    var articleDataView = Titanium.UI.createView({ layout: 'vertical', height: 'auto', width: 'auto', visible: false });
    articleDataView.hide();

    articleView.add(articleDataView);
    articleView.add(footerView);

    globals.httpManager.request(
        globals.httpManager.buildUrl({ fnc: 'getBasket' }),
        function() {
            var response = JSON.parse(this.responseText);
            totalValue.setText(response.result.totalBrutto + response.result.currency);
            deliveryValue.setText((response.result.totalDelivery ? response.result.totalDelivery : String.formatDecimal(0, '0.00')) + response.result.currency);

            globals._.each(response.result.articles, function(article) {
                var detailsView = Titanium.UI.createView({
                    layout: 'vertical',
                    height: 'auto',
                    width: '210dp',
                    left: '10dp'
                });

                var nameLabelOptions = { text: article.title };
                globals._.defaults(nameLabelOptions, styles.PageItems.Cart.NameLabel);
                var nameLabel = Titanium.UI.createLabel(nameLabelOptions);
                detailsView.add(nameLabel);

                var priceLabelOptions = { text: article.total ? article.total + article.currency :  L('price_on_request') };
                globals._.defaults(priceLabelOptions, styles.PageItems.Cart.PriceLabel);
                var totalPriceLabel = Titanium.UI.createLabel(priceLabelOptions);
                detailsView.add(totalPriceLabel);

                articleDataView.add(detailsView);
            });
            articleDataView.show();
            articleDataView.visible = true;
        }
    );

    var addressLabel = Titanium.UI.createLabel({
        textid: 'checkout_address_title',
        height: 'auto',
        width: 'auto',
        top: '10dp',
        left: '10dp',
        font: {
            fontSize: '16dp',
            fontWeight: 'bold'
        }
    });
    containerView.add(addressLabel);

    var addressView = Titanium.UI.createView({
        layout: 'vertical',
        height: 'auto',
        width: 'auto',
        visible: false
    });
    addressView.hide();

    var AddressViews = require('views/checkout/AddressViews');
    globals.httpManager.request(
        globals.httpManager.buildUrl({ fnc: 'getInvoiceAddress' }),
        function() {
            var response = JSON.parse(this.responseText);
            addressView.add(new AddressViews.BillingAddressView(response.result));
            addressView.show();
            addressView.visible = true;
        }
    );
    containerView.add(addressView);

    var deliveryAddress = globals.Database.getSetting('deliveryaddress');
    if (deliveryAddress) {
        deliveryAddress = JSON.parse(deliveryAddress);
        var deliveryAddressLabel = Titanium.UI.createLabel({
            textid: 'checkout_delivery_address',
            height: 'auto',
            width: 'auto',
            top: '10dp',
            left: '10dp',
            font: {
                fontSize: '16dp',
                fontWeight: 'bold'
            }
        });
        containerView.add(deliveryAddressLabel);
        containerView.add(new AddressViews.BillingAddressView(deliveryAddress));
    }

    var acceptTermsAndConditionCheckbox = Titanium.UI.createView({
        layout: 'horizontal',
        height: '50dp',
        width: globals.screenWidth,
        top: '10dp'
    });

    if (globals.isAndroid) {
        var acceptTermsAndConditionCheckboxSwitch = Titanium.UI.createSwitch({
            style: globals.isAndroid ? Titanium.UI.Android.SWITCH_STYLE_CHECKBOX : null
        });
        acceptTermsAndConditionCheckboxSwitch.addEventListener('change', function(e) {
            acceptTermsAndConditions = e.value
        });

        var acceptTermsAndConditionCheckboxLabel = Titanium.UI.createLabel({
            textid: 'checkout_accept_terms_and_condition',
            left: '15dp'
        });

        acceptTermsAndConditionCheckbox.add(acceptTermsAndConditionCheckboxSwitch);
        acceptTermsAndConditionCheckbox.add(acceptTermsAndConditionCheckboxLabel);
    } else {
        var acceptTermsAndConditionCheckboxLabel = Titanium.UI.createLabel({
            textid: 'checkout_accept_terms_and_condition',
            left: '10dp',
            height: 'auto',
            width: 'auto',
            font: {
                fontSize: '16dp',
                fontWeight: 'bold'
            },
            top: '5dp'
        });

        var acceptTermsAndConditionCheckboxSwitch = Titanium.UI.createSwitch({
            value: false,
            style: globals.isAndroid ? Titanium.UI.Android.SWITCH_STYLE_CHECKBOX : null,
            left: '15dp',
            width: '80dp',
            height: 'auto'
        });
        acceptTermsAndConditionCheckboxSwitch.addEventListener('change', function(e) {
            acceptTermsAndConditions = e.value
        });

        acceptTermsAndConditionCheckbox.add(acceptTermsAndConditionCheckboxLabel);
        acceptTermsAndConditionCheckbox.add(acceptTermsAndConditionCheckboxSwitch);
    }

    containerView.add(acceptTermsAndConditionCheckbox);

    if (globals.isAndroid) {
        var continueButton = Titanium.UI.createButton({
            titleid: 'checkout_button',
            height: '40dp',
            width: '120dp',
            style: Titanium.UI.iPhone.SystemButtonStyle.BORDERED,
            top: '10dp'
        });
        continueButton.addEventListener('click', continueToNextStep);
        containerView.add(continueButton);
    }

    return screen;
};
