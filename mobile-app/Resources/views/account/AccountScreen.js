exports.AccountScreen = function(navigation) {
    var globals = require('globals');
    var styles = require('UIStyle');
    var isUserLoggedIn = globals.loginManager.isUserLoggedIn();

    var costumerName = globals.Database.getSetting('firstname');
    var costumerLastname = globals.Database.getSetting('lastname');
    if (null !== costumerLastname && costumerLastname.length > 0) {
        costumerName += ' ' + costumerLastname;
    }

    var costumerNameLabelOptions = {
        text: isUserLoggedIn ? costumerName : 'EMPTY',
        top: '12dp'
    };
    globals._.defaults(costumerNameLabelOptions, styles.PageItems.Account.TitleLabel);
    var costumerNameLabel = Titanium.UI.createLabel(costumerNameLabelOptions);

    var contactLabelOptions = {
        textid: 'account_contact_person',
        top: '35dp',
        bottom: '12dp'
    };
    globals._.defaults(contactLabelOptions, styles.PageItems.Account.TitleLabel);
    var contactLabel = Titanium.UI.createLabel(contactLabelOptions);
	
	var contactName = globals.Database.getSetting('employee_firstname');
	var contactLastname = globals.Database.getSetting('employee_lastname');
	if (null !== contactLastname && contactLastname.length > 0) {
		contactName += ' ' + contactLastname;
	}

    var contactPersonLabelOptions = {
        text: contactName,
        top: '35dp',
        bottom: '12dp',
    };

    globals._.defaults(contactPersonLabelOptions, styles.PageItems.Account.ValueLabel);
    var contactPersonLabel = Titanium.UI.createLabel(contactPersonLabelOptions);
    
    var phoneNumber = globals.Database.getSetting('employee_phone1');
    if (null === phoneNumber || phoneNumber.length === 0) {
    	phoneNumber = globals.Database.getSetting('employee_phone2') || '';
    }
    phoneNumber = phoneNumber.replace(/[^+0-9]/g, '');

    var callButtonOptions = {
        backgroundImage: (globals.isAndroid) ? '../../icons/icon_call.png' : 'icons/icon_call.png',
        width: '24dp',
        height: '24dp',
        top: '35dp',
        right: '6dp'
    };
    globals._.defaults(callButtonOptions, styles.PageItems.IconButton);
    var callButton = Titanium.UI.createButton(callButtonOptions);
    callButton.addEventListener('click', function() {
        Titanium.Platform.openURL('tel:' + phoneNumber);
    });

    var accountDetailView = Titanium.UI.createView({
        height: '70dp',
        top: '0dp',
        visible: isUserLoggedIn
    });
    accountDetailView.add(costumerNameLabel);
    accountDetailView.add(contactLabel);
    accountDetailView.add(contactPersonLabel);
    accountDetailView.add(callButton);

/*
    var accountTable = Titanium.UI.createTableView({
        style: Titanium.UI.iPhone.TableViewStyle.PLAIN,
        scrollable: false,
        minRowHeight: '40dp',
        headerTitle: L('account_tab_title'),
        data: [
            { title: L('account_orders'), hasChild: true, color: '#000' },
            { title: L('account_wish_list'), hasChild: true, color: '#000' },
            { title: L('account_service'), hasChild: true, color: '#000' },
            { title: L('account_price_list'), hasChild: true, color: '#000' },
            { title: L('account_packages'), hasChild: true, color: '#000' }
        ],
        top: accountDetailView.height,
        visible: isUserLoggedIn
    });
    accountTable.addEventListener('click', function(e) {
        switch(e.index) {
            case 0:
                var OrdersScreen = require('views/account/OrdersScreen').OrdersScreen;
                navigation.open(new OrdersScreen(), { animated: true });
                break;

            case 2:
                var ServiceScreen = require('views/account/ServiceScreen').ServiceScreen;
                navigation.open(new ServiceScreen(navigation), { animated: true });
                break;

            case 3:
                var PriceListScreen = require('views/account/PriceListScreen').PriceListScreen;
                navigation.open(new PriceListScreen(), { animated: true });
                break;

            case 4:
                var PackagesScreen = require('views/account/PackagesScreen').PackagesScreen;
                navigation.open(new PackagesScreen(navigation), { animated: true });
                break;
        }
    });
*/

    var window = null;
    if (globals.isAndroid) {
        window = Titanium.UI.createView();
    } else {
        window = Titanium.UI.createWindow({ titleid: 'account_tab_title' });
    }

    Titanium.App.addEventListener('updateUserState', function() {
        if (globals.loginManager.isUserLoggedIn()) {
            var costumerName = globals.Database.getSetting('firstname');
            var costumerLastname = globals.Database.getSetting('lastname');
            if (null !== costumerLastname && costumerLastname.length > 0) {
                costumerName += ' ' + costumerLastname;
            }
            costumerNameLabel.setText(costumerName);

            accountDetailView.show();
            accountDetailView.visible = true;
//            accountTable.show();
//            accountTable.visible = true;
        } else {
            costumerNameLabel.setText('EMPTY');
            accountDetailView.hide();
            accountDetailView.visible = false;
//            accountTable.hide();
//            accountTable.visible = false;
        }
    });

    window.add(accountDetailView);
//    window.add(accountTable);
    return window;
};
