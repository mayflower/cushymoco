exports.SettingScreen = function() {
    var globals = require('globals');

    var staySignedIn = globals.parseBoolean(globals.Database.getSetting('staySignedIn'));
    var staySignedInSwitchOptions = {
        title: L('setting_stay_signed_in_title'),
        value: staySignedIn,
        color: '#FFF'
    };
    if (globals.isAndroid) {
        globals._.extend(staySignedInSwitchOptions, {
            style: Ti.UI.Android.SWITCH_STYLE_CHECKBOX,
            left: '10dp'
        });
    } else {
        globals._.extend(staySignedInSwitchOptions, {
            right: '10dp'
        });
    }
    var staySignedInSwitch = Titanium.UI.createSwitch(staySignedInSwitchOptions);
    staySignedInSwitch.addEventListener('change', function(e) {
        globals.Database.setSetting('staySignedIn', e.value);
    });

    var window = null;
    if (globals.isAndroid) {
        window = Titanium.UI.createView({
            layout: 'vertical'
        });
    } else {
        window = Titanium.UI.createWindow({
            titleid: 'setting_title',
            layout: 'vertical'
        });
    }

    window.add(staySignedInSwitch);
    return window;
};