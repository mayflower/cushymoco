exports.DeliveryAddressView = function(parentScreen) {
    var globals = require('globals');
    var PickerElements = require('views/PickerElements');

    var deliveryAddressView = Titanium.UI.createView({
        layout: 'vertical',
        backgroundColor: '#FFF',
        width: globals.screenWidth,
        height: 'auto',
        top: '10dp'
    });

    var topLabel = Titanium.UI.createLabel({
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
    deliveryAddressView.add(topLabel);

    var generalFormLabelConfig = {
        font: {
            fontSize: '14dp',
            fontWeight: 'normal'
        },
        top: '10dp',
        left: '35dp',
        height: 'auto',
        width: 'auto'
    };

    var generalFormFieldConfig = {
        borderStyle: Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
        top: '5dp',
        height: '40dp',
        width: '250dp'
    };

    var formConfig = [
        {
            id: 'firstname',
            textid: 'checkout_address_firstname',
            type: 'field'
        },
        {
            id: 'lastname',
            textid: 'checkout_address_lastname',
            type: 'field'
        },
        {
            id: 'company',
            textid: 'checkout_address_company',
            type: 'field'
        },
        {
            id: 'street',
            textid: 'checkout_address_street',
            type: 'field'
        },
        {
            id: 'zip',
            textid: 'checkout_address_zip',
            type: 'field'
        },
        {
            id: 'city',
            textid: 'checkout_address_city',
            type: 'field'
        },
        {
            id: 'country',
            textid: 'checkout_address_country',
            type: 'select',
            request: { fnc: 'getCountryList' }
        }
    ];

    var _that = this;
    var buildView = function() {
        var fields = [];
        globals._.each(formConfig, function(element) {
            var formLabelConfig = { id: element.id, textid: element.textid };
            globals._.defaults(formLabelConfig, generalFormLabelConfig);
            var formLabel = Titanium.UI.createLabel(formLabelConfig);

            var formElement = null;
            var formFieldConfig = { id: element.id };
            globals._.defaults(formFieldConfig, generalFormFieldConfig);

            if ('select' == element.type && element.data) {
                if (globals.isAndroid) {
                    formElement = Titanium.UI.createPicker(formFieldConfig);
    
                    var formElementData = [];
                    globals._.each(element.data, function(data) {
                        formElementData.push(Titanium.UI.createPickerRow(data));
                    });
                    formElement.add(formElementData);
                } else {
                    if (element.request) {
                        formFieldConfig.request = element.request;
                    }

                    formElement = new PickerElements.PickerField(function(field) {
                        globals._.each(_that.fields, function(field) {
                            if (field && field.blur && 'function' === typeof field.blur) {
                                field.blur();
                            }
                        });

                        if (field.request) {
                            globals.httpManager.request(
                                globals.httpManager.buildUrl(field.request),
                                function() {
                                    var response = JSON.parse(this.responseText);
                                    PickerElements.PickerView(parentScreen, field, response.result);
                                }
                            )
                        }
                    }, formFieldConfig);
                    formElement.value = element.data[0].title;
                    formElement.valueId = element.data[0].id;
                    formElement.rowIndex = 0;
                }
            } else {
                formElement = Titanium.UI.createTextField(formFieldConfig);
            }

            deliveryAddressView.add(formLabel);
            deliveryAddressView.add(formElement);
            fields.push(formElement);
        });
        _that.fields = fields;
    };

    globals._.each(formConfig, function(element) {
        if ('select' == element.type && element.request) {
            globals.httpManager.request(
                globals.httpManager.buildUrl(element.request),
                function() {
                    var response = JSON.parse(this.responseText);
                    element.data = response.result;
                    buildView();
                }
            );
        }
    });

    this.screen = deliveryAddressView;
    this.getAddress = function() {
        var formMapping = {
            firstname: 'oxuser_oxfname',
            lastname: 'oxuser_oxlname',
            company: 'oxuser_oxcompany',
            street: 'oxuser_oxstreet',
            zip: 'oxuser_oxzip',
            city: 'oxuser_oxcity',
            country: 'oxuser_oxcountry'
        };

        var address = {};
        globals._.each(this.fields, function(field) {
            if (field.id && formMapping[field.id]) {
                var key = formMapping[field.id];
                if (globals.isAndroid && field instanceof Titanium.UI.Picker) {
                    var row = field.getSelectedRow(0);
                    address[key] = row.title;
                } else {
                    address[key] = field.value;
                }
            }
        });
        return address;
    };
};
exports.BillingAddressView = function(billingAddressData) {
    var globals = require('globals');

    var generalLabelConfig = {
        height: 'auto',
        width: 'auto',
        left: '10dp',
        font: {
            fontSize: '14dp',
            fontWeight: 'normal'
        }
    };

    var addressText = [
        {
            id: 'email',
            prefixTextid: 'checkout_address_email_prefix'
        },
        {
            id: 'company',
            field: 'oxuser_oxcompany'
        },
        {
            id: 'name',
            combined: ['oxuser_oxfname', 'oxuser_oxlname']
        },
        {
            id: 'street',
            field: 'oxuser_oxstreet'
        },
        {
            id: 'city',
            combined: ['oxuser_oxzip', 'oxuser_oxcity']
        },
        {
            id: 'country',
            field: 'oxuser_oxcountry'
        },
        {
            id: 'telephone',
            prefixTextid: 'checkout_address_telephone_prefix'
        }
    ];

    var addressView = Titanium.UI.createView({
        layout: 'vertical',
        height: 'auto',
        width: 'auto'
    });

    globals._.each(addressText, function(element) {
        var text = (element.prefixTextid) ? (L(element.prefixTextid) + ' ') : '' ;
        var showElement = false;

        if (element.combined && element.combined.length > 0) {
            globals._.each(element.combined, function(partialData) {
                text += billingAddressData[partialData] + ' ';
            });
            showElement = true;
        } else if (element.field) {
            text += billingAddressData[element.field];
            showElement = true;
        }

        if (showElement) {
            var labelConfig = { text: text };
            globals._.defaults(labelConfig, generalLabelConfig);
            var label = Titanium.UI.createLabel(labelConfig);
            addressView.add(label);
        }
    });

    return addressView;
};
