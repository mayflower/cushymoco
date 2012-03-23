var globals = require('globals');
exports.PageItems = {
    Label: {
        color: '#000',
        font: {
            fontSize: '16dp',
            fontWeight: 'normal'
        },
        height: 'auto',
        width: 'auto'
    },
    TextField: {
        borderStyle: Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
        height: '45dp',
        width: '250dp'
    },
    Switch: {
        color: '#000',
        width: '250dp',
        style: globals.isAndroid ? Titanium.UI.Android.SWITCH_STYLE_CHECKBOX : null
    },
    Button: {
        style: globals.isAndroid ? null : Titanium.UI.iPhone.SystemButtonStyle.BORDERED,
        width: '125dp',
        height: '45dp'
    },
    IconButton: {
        title: '',
        width: globals.isAndroid ? '24dp' : '30dp',
        height: globals.isAndroid ? '24dp' : '30dp',
        style: Titanium.UI.iPhone.SystemButtonStyle.PLAIN
    },
    Login: {
        Label: {
            color: '#000',
            font: {
                fontSize: '16dp',
                fontWeight: 'normal'
            },
            height: 'auto',
            width: 'auto'
        },
        TextField: {
            borderStyle: globals.isAndroid ? Titanium.UI.INPUT_BORDERSTYLE_LINE : Titanium.UI.INPUT_BORDERSTYLE_NONE,
            height: globals.isAndroid ? '45dp' : '40dp',
            width: globals.isAndroid ? '250dp' : '140dp'
        },
        Switch: {
            color: '#000',
            width: globals.isAndroid ? '250dp' : '140dp',
            style: globals.isAndroid ? Titanium.UI.Android.SWITCH_STYLE_CHECKBOX : null
        },
        Button: {
            style: globals.isAndroid ? null : Titanium.UI.iPhone.SystemButtonStyle.BORDERED,
            width: '125dp',
            height: '45dp'
        }
    },
    Cart: {
        TopLabel: {
            font: {
                fontSize: '14dp',
                fontWeight: 'bold'
            },
            height: '16dp',
            width: 'auto',
            textAlign: 'left'
        },
        NameLabel: {
            font: {
                fontSize: '14dp',
                fontWeight: 'bold'
            },
            top: '0dp',
            left: '0dp',
            height: '16dp',
            width: 'auto',
            textAlign: 'left'
        },
        PriceLabel: {
            font: {
                fontSize: '14dp',
                fontWeight: 'bold'
            },
            top: '5dp',
            bottom: '0dp',
            left: '0dp',
            height: '16dp',
            width: 'auto',
            textAlign: 'left'
        },
        QuantityLabel: {
            font: {
                fontSize: '12dp',
                fontWeight: 'bold'
            },
            top: '0dp',
            right: '10dp',
            height: 'auto',
            width: 'auto'
        },
        QuantityTextField: {
            top: '2dp',
            right: globals.isAndroid ? '50dp' : '10dp',
            height: globals.isAndroid ? 'auto' : '20dp',
            width: '50dp',
            keyboardType: globals.isAndroid ? Titanium.UI.KEYBOARD_NUMBER_PAD : Titanium.UI.KEYBOARD_NUMBERS_PUNCTUATION,
            borderStyle: globals.isAndroid ? Titanium.UI.INPUT_BORDERSTYLE_LINE : Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
        }
    },
    Account: {
        TitleLabel: {
            color: '#000',
            font: {
                fontSize: '18dp',
                fontWeight: 'bold'
            },
            left: '20dp',
            height: 'auto',
            width: 'auto'
        },
        ValueLabel: {
            color: '#000',
            font: {
                fontSize: '16dp',
                fontWeight: 'normal'
            },
            left: '155dp',
            height: 'auto',
            width: 'auto'
        }
    }
};
