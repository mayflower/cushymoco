exports.DeliveryBillingScreen = function(navigation, windowStack) {
    var globals = require('globals');
    var PickerElements = require('views/PickerElements');

    var screen = null;
    var continueToNextStep = function() {
        screen.fireEvent('beforecontinue', {});
        windowStack.push(screen);

        var SummaryScreen = require('views/checkout/SummaryScreen').SummaryScreen;
        navigation.open(new SummaryScreen(navigation, windowStack), { animated: true });
    };

    if (globals.isAndroid) {
        screen = Titanium.UI.createView({
            backgroundColor: '#FFF',
            layout: 'vertical'
        });
    } else {
        screen = Titanium.UI.createWindow({
            titleid: 'checkout_delivery_billing_title',
            backgroundColor: '#FFF'
        });

        var nextButton = Titanium.UI.createButton({ titleid: 'checkout_next_button'});
        nextButton.addEventListener('click', continueToNextStep);
        screen.setRightNavButton(nextButton);
    }

    var deliveryLabel = Titanium.UI.createLabel({
        textid: 'checkout_delivery_title',
        height: 'auto',
        width: 'auto',
        top: '10dp',
        left: '10dp',
        font: {
            fontSize: '16dp',
            fontWeight: 'bold'
        }
    });
    screen.add(deliveryLabel);

    var deliveryPicker = null;
    if (globals.isAndroid) {
        deliveryPicker = Titanium.UI.createPicker({
            width: globals.screenWidth
        });
        screen.add(deliveryPicker);
    } else {
        var deliveryField = new PickerElements.PickerField(function() {
            buildBillingPickerView('delivery', screen);
        }, { top: '40dp' });
        screen.add(deliveryField);
    }

    var billingLabel = Titanium.UI.createLabel({
        textid: 'checkout_billing_title',
        height: 'auto',
        width: 'auto',
        top: globals.isAndroid ? '10dp' : '90dp',
        left: '10dp',
        font: {
            fontSize: '16dp',
            fontWeight: 'bold'
        }
    });
    screen.add(billingLabel);

    var billingPicker = null;
    if (globals.isAndroid) {
        billingPicker = Titanium.UI.createPicker({
            width: globals.screenWidth
        });
        screen.add(billingPicker);
    } else {
        var billingField = new PickerElements.PickerField(function() {
            buildBillingPickerView('billing', screen);
        }, { top: '120dp' });
        screen.add(billingField);
    }

    if (globals.isAndroid) {
        deliveryPicker.addEventListener('change', function(e) {
            globals.httpManager.request(
                globals.httpManager.buildUrl({ fnc: 'getShippingPayment', sShipSet: e.row.id }),
                function() {
                    var response = JSON.parse(this.responseText);

                    var billingPickerData = [];
                    globals._.each(response.result.payments, function(payment) {
                        billingPickerData.push(Titanium.UI.createPickerRow(payment));
                    });

                    globals._.each(billingPicker.columns[0].rows, function(row) {
                        billingPicker.columns[0].removeRow(row);
                    });
                    billingPicker.add(billingPickerData);
                }
            );
        });
    }

    var buildBillingPickerView = function(type, screen) {
        if (type !== 'delivery' && type !== 'billing') {
            return;
        }

        var functionArguments = { fnc: 'getShippingPayment' };
        if (type === 'billing') {
            globals._.extend(functionArguments, { sShipSet: deliveryField.valueId });
        }

        globals.httpManager.request(
            globals.httpManager.buildUrl(functionArguments),
            function() {
                var response = JSON.parse(this.responseText);

                var clickCallback = function(field) {
                    if (type === 'delivery') {
                        globals.httpManager.request(
                            globals.httpManager.buildUrl({ fnc: 'getShippingPayment', sShipSet: field.valueId }),
                            function() {
                                var response = JSON.parse(this.responseText);

                                billingField.value = response.result.payments[0].title;
                                billingField.valueId = response.result.payments[0].id;
                                billingField.rowIndex = 0;
                            }
                        );
                    }
                };

                var pickerData = [];
                if (type === 'delivery') {
                    globals._.each(response.result.deliveries, function(delivery) {
                        pickerData.push(Titanium.UI.createPickerRow(delivery));
                    });
                    PickerElements.PickerView(screen, deliveryField, pickerData, clickCallback);
                } else if (type === 'billing') {
                    globals._.each(response.result.payments, function(payment) {
                        pickerData.push(Titanium.UI.createPickerRow(payment));
                    });
                    PickerElements.PickerView(screen, billingField, pickerData, clickCallback);
                }
            }
        );
    };

    globals.httpManager.request(
        globals.httpManager.buildUrl({ fnc: 'getShippingPayment' }),
        function() {
            var response = JSON.parse(this.responseText);

            if (globals.isAndroid) {
                var deliveryPickerData = [];
                globals._.each(response.result.deliveries, function(delivery) {
                    deliveryPickerData.push(Titanium.UI.createPickerRow(delivery));
                });
                deliveryPicker.add(deliveryPickerData);

                var billingPickerData = [];
                globals._.each(response.result.payments, function(payment) {
                    billingPickerData.push(Titanium.UI.createPickerRow(payment));
                });
                billingPicker.add(billingPickerData);
            } else {
                deliveryField.value = response.result.deliveries[0].title;
                deliveryField.valueId = response.result.deliveries[0].id;
                deliveryField.rowIndex = 0;

                billingField.value = response.result.payments[0].title;
                billingField.valueId = response.result.payments[0].id;
                billingField.rowIndex = 0;
            }
        }
    );

    screen.addEventListener('beforecontinue', function() {
        var deliveryRow = globals.isAndroid ? deliveryPicker.getSelectedRow(0).id : deliveryField.valueId;
        var billingRow = globals.isAndroid ? billingPicker.getSelectedRow(0).id : billingField.valueId;

        globals.Database.setSetting('deliveryId', deliveryRow);
        globals.Database.setSetting('billingId', billingRow);
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
        screen.add(continueButton);
    }

    return screen;
};
