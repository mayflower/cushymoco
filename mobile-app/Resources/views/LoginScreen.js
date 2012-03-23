exports.LoginScreen = function(navigation) {
    var globals = require('globals');
    var styles = require('UIStyle');

    var customerNumberLabelOptions = {
        textid: 'login_customer_number',
        left: globals.isAndroid ? '35dp' : '10dp'
    };
    globals._.defaults(customerNumberLabelOptions, styles.PageItems.Login.Label);
    if (globals.isAndroid) {
        globals._.extend(customerNumberLabelOptions, { top: '10dp' })
    }

    var customerNumberTextOptions = {};
    if (globals.isAndroid) {
        globals._.extend(customerNumberTextOptions, { top: '5dp' })
    } else {
        globals._.extend(
            customerNumberTextOptions,
            {
                hintText: '123456',
                right: '10dp'
            }
        );
    }
    globals._.defaults(customerNumberTextOptions, styles.PageItems.Login.TextField);
    var customerNumberText = Titanium.UI.createTextField(customerNumberTextOptions);

    var passwordLabelOptions = {
        textid: 'login_password',
        left: globals.isAndroid ? '35dp' : '10dp'
    };
    if (globals.isAndroid) {
        globals._.extend(passwordLabelOptions, { top: '10dp' })
    }
    globals._.defaults(passwordLabelOptions, styles.PageItems.Login.Label);

    var passwordTextOptions = { passwordMask: true };
    if (globals.isAndroid) {
        globals._.extend(passwordTextOptions, { top: '5dp' });
    } else {
        globals._.extend(
            passwordTextOptions,
            {
                hintText: '123456',
                right: '10dp'
            }
        );
    }
    globals._.defaults(passwordTextOptions, styles.PageItems.Login.TextField);
    var passwordText = Titanium.UI.createTextField(passwordTextOptions);

    var staySignedIn = globals.parseBoolean(globals.Database.getSetting('staySignedIn'));
    var staySignedInSwitchOptions = {
        title: L('setting_stay_signed_in_title'),
        value: staySignedIn
    };
    if (!globals.isAndroid) {
        globals._.extend(staySignedInSwitchOptions, { right: '10dp' })
    }
    globals._.defaults(staySignedInSwitchOptions, styles.PageItems.Login.Switch);
    var staySignedInSwitch = Titanium.UI.createSwitch(staySignedInSwitchOptions);

    var loginButtonOptions = {
        titleid: 'login_button',
        top: '10dp'
    };
    globals._.defaults(loginButtonOptions, styles.PageItems.Login.Button);
    var loginButton = Titanium.UI.createButton(loginButtonOptions);
    loginButton.addEventListener('click', function() {
    	loginButton.setEnabled(false);
    	loginButton.enabled = false;
        customerNumberText.blur();
        passwordText.blur();

        var loadUserData = function() {
            globals.httpManager.request(
                globals.httpManager.buildUrl({ fnc: 'getUserData' }),
                function() {
                    var response = JSON.parse(this.responseText);
                    if (null !== response.result) {
                        globals.Database.setSetting('username', response.result.username);
                        globals.Database.setSetting('firstname', response.result.firstname);
                        globals.Database.setSetting('lastname', response.result.lastname);

                        customerNumberText.value = '';
                        passwordText.value = '';
                        loginButton.setEnabled(true);
   	                    loginButton.enabled = true;

                        Titanium.App.fireEvent('updateUserState', { source: loginButton, type: 'updateUserState'});
                        if (undefined === navigation || null === navigation) {
                            globals.windowManager.leaveCurrentWindow();
                        }

                        Titanium.UI.createAlertDialog({
                            title: '',
                            message: L('login_success'),
                            ok: L('ok_button')
                        }).show();
                    } else {
	                    alert(response.error);
	                    loginButton.setEnabled(true);
	                    loginButton.enabled = true;
	                }
                }
            );
        };

        globals.httpManager.request(
            globals.httpManager.buildUrl({ fnc: 'login', lgn_usr: customerNumberText.value, lgn_pwd: passwordText.value }),
            function() {
                var response = JSON.parse(this.responseText);
                if (null !== response.result) {
                    globals.Database.setSetting('loginname', response.result.username);
                    globals.Database.setSetting('session', response.result.sessionId);
                    globals.Database.setSetting('staySignedIn', staySignedInSwitch.value);

                    loadUserData();
                } else {
                    passwordText.value = '';
                    loginButton.setEnabled(true);
                    loginButton.enabled = true;
                    alert(response.error);
                }
            }
        )
    });

    var loginView = Titanium.UI.createView({
        layout: 'vertical',
        backgroundColor: '#FFF'
    });

    if (globals.isAndroid) {
        loginView.add(Titanium.UI.createLabel(customerNumberLabelOptions));
        loginView.add(customerNumberText);
        loginView.add(Titanium.UI.createLabel(passwordLabelOptions));
        loginView.add(passwordText);
        loginView.add(staySignedInSwitch);
        loginView.add(loginButton)
    } else {
        var customerNumberRow = Titanium.UI.createTableViewRow({
            height: '55dp',
            selectionStyle: Titanium.UI.iPhone.TableViewCellSelectionStyle.NONE
        });
        customerNumberRow.add(Titanium.UI.createLabel(customerNumberLabelOptions));
        customerNumberRow.add(customerNumberText);

        var passwordRow = Titanium.UI.createTableViewRow({
            height: '55dp',
            selectionStyle: Titanium.UI.iPhone.TableViewCellSelectionStyle.NONE
        });
        passwordRow.add(Titanium.UI.createLabel(passwordLabelOptions));
        passwordRow.add(passwordText);

        var staySignedInRow = Titanium.UI.createTableViewRow({
            height: '55dp',
            selectionStyle: Titanium.UI.iPhone.TableViewCellSelectionStyle.NONE
        });
        var staySignedInLabelOptions = {
            textid: 'setting_stay_signed_in_title',
            left: '10dp'
        };
        globals._.defaults(staySignedInLabelOptions, styles.PageItems.Login.Label);
        var staySignedInLabel = Titanium.UI.createLabel(staySignedInLabelOptions);
        staySignedInRow.add(staySignedInLabel);
        staySignedInRow.add(staySignedInSwitch);

        var loginTableView = Titanium.UI.createTableView({
            data: [customerNumberRow, passwordRow, staySignedInRow],
            style: Titanium.UI.iPhone.TableViewStyle.GROUPED,
            backgroundColor: '#FFF',
            height: '200dp',
            width: '320dp',
            scrollable: false
        });

        loginView.add(loginTableView);
    }

    loginView.add(loginButton);

    var loginWindow = Titanium.UI.createWindow({
        titleid: 'login_window_title',
        backgroundColor: '#FFF',
        navBarHidden: false,
        modal: true
    });
    loginWindow.add(loginView);

    if (!globals.isAndroid && (undefined === navigation || null === navigation)) {
        var backButton = Titanium.UI.createButton({
            titleid: 'close_button'
        });

        backButton.addEventListener('click', function() {
            globals.windowManager.leaveCurrentWindow();
        });

        loginWindow.setLeftNavButton(backButton)
    }

    if (!globals.isAndroid) {
        return loginWindow;
    }
    return (undefined === navigation || null === navigation) ? loginWindow : loginView;
};
