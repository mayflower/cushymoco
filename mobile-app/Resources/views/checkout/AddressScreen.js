exports.AddressScreen = function(navigation) {
    var globals = require('globals');
    var AddressViews = require('views/checkout/AddressViews');

    var screen = null;
    var continueToNextStep = function() {
        screen.fireEvent('beforecontinue', {});
        var DeliveryBillingScreen = require('views/checkout/DeliveryBillingScreen').DeliveryBillingScreen;
        navigation.open(new DeliveryBillingScreen(navigation, [screen]), { animated: true });
    };

    if (globals.isAndroid) {
        screen = Titanium.UI.createView({});
    } else {
        screen = Titanium.UI.createWindow({ titleid: 'checkout_billing_address_title' });

        var nextButton = Titanium.UI.createButton({ titleid: 'checkout_next_button'});
        nextButton.addEventListener('click', continueToNextStep);

        screen.setRightNavButton(nextButton);
    }

    var scrollView = Titanium.UI.createScrollView({
        backgroundColor: '#FFF',
        contentHeight: 'auto',
        top: '0dp',
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

    var topLabel = Titanium.UI.createLabel({
        textid: 'checkout_billing_address_label',
        height: 'auto',
        width: 'auto',
        top: '10dp',
        left: '10dp',
        font: {
            fontSize: '16dp',
            fontWeight: 'bold'
        }
    });
    containerView.add(topLabel);

    var addressView = Titanium.UI.createView({
        layout: 'vertical',
        visible: false,
        width: 'auto',
        height: 'auto',
        left: '10dp'
    });
    addressView.hide();

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

    var deliveryLikeBillingAddressCheckboxSwitch = null;
    if (globals.isAndroid) {
        var deliveryLikeBillingAddressCheckbox = Titanium.UI.createView({ layout: 'horizontal' });
        deliveryLikeBillingAddressCheckboxSwitch = Titanium.UI.createSwitch({
            value: false,
            style: globals.isAndroid ? Titanium.UI.Android.SWITCH_STYLE_CHECKBOX : null
        });

        var deliveryLikeBillingAddressCheckboxLabel = Titanium.UI.createLabel({
            textid: 'checkout_delivery_address',
            left: '15dp'
        });
        deliveryLikeBillingAddressCheckbox.add(deliveryLikeBillingAddressCheckboxSwitch);
        deliveryLikeBillingAddressCheckbox.add(deliveryLikeBillingAddressCheckboxLabel);
        containerView.add(deliveryLikeBillingAddressCheckbox);
    } else {
        var deliveryLikeBillingAddressRow = Titanium.UI.createTableViewRow({
            height: '45dp',
            selectionStyle: Titanium.UI.iPhone.TableViewCellSelectionStyle.NONE
        });
        var deliveryLikeBillingAddressLabelOptions = {
            color: '#000',
            font: {
                fontSize: '16dp',
                fontWeight: 'normal'
            },
            height: 'auto',
            width: 'auto',
            textid: 'checkout_delivery_address',
            left: '10dp'
        };
        var deliveryLikeBillingAddressLabel = Titanium.UI.createLabel(deliveryLikeBillingAddressLabelOptions);

        var deliveryLikeBillingAddressSwitchOptions = {
            width: '140dp',
            value: false,
            right: '10dp'
        };
        deliveryLikeBillingAddressCheckboxSwitch = Titanium.UI.createSwitch(deliveryLikeBillingAddressSwitchOptions);
        deliveryLikeBillingAddressRow.add(deliveryLikeBillingAddressLabel);
        deliveryLikeBillingAddressRow.add(deliveryLikeBillingAddressCheckboxSwitch);

        var deliveryLikeBillingAddressTableView = Titanium.UI.createTableView({
            data: [deliveryLikeBillingAddressRow],
            style: Titanium.UI.iPhone.TableViewStyle.GROUPED,
            backgroundColor: '#FFF',
            height: '80dp',
            width: '320dp',
            scrollable: false
        });

        containerView.add(deliveryLikeBillingAddressTableView);
    }

    var deliveryAddressContainerView = Titanium.UI.createView({
        height: 'auto',
        width: 'auto',
        left: '10dp'
    });
    containerView.add(deliveryAddressContainerView);

    var deliveryAddressViewInstance = new AddressViews.DeliveryAddressView(screen);
    deliveryLikeBillingAddressCheckboxSwitch.addEventListener('change', function(e) {
        if (e.value) {
            deliveryAddressContainerView.add(deliveryAddressViewInstance.screen);
        } else {
            deliveryAddressContainerView.remove(deliveryAddressViewInstance.screen);
        }
    });

    screen.addEventListener('beforecontinue', function() {
        var deliveryAddress = null;
        if (deliveryLikeBillingAddressCheckboxSwitch.value) {
            deliveryAddress = deliveryAddressViewInstance.getAddress();
        }

        if (deliveryAddress) {
            deliveryAddress = JSON.stringify(deliveryAddress);
        }
        globals.Database.setSetting('deliveryaddress', deliveryAddress);
    });

    if (globals.isAndroid) {
        var continueButton = Titanium.UI.createButton({
            titleid: 'checkout_next_step_button',
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
