exports.CartTab = function() {
    var globals = require('globals');
    var styles = require('UIStyle');

    /**
     * Create "cart" tab and window
     */
    var outerWindow = Titanium.UI.createWindow({
        navBarHidden: true
    });

    /**
     * Cart content
     */
    var cartTable = Titanium.UI.createTableView({
        style: Titanium.UI.iPhone.TableViewStyle.PLAIN,
        scrollable: true,
        minRowHeight: '40dp',
        data: []
    });

    var onQuantityEdit = function(e) {
        e.source.blur();
        globals.httpManager.request(
            globals.httpManager.buildUrl({ fnc: 'updateBasket', anid: e.source.id, qty: e.source.value }),
            function() {
                var response = JSON.parse(this.responseText);
                if (response.result) {
                    loadCartData();
                } else {
                    alert(response.error);
                }
            }
        );
    };

    var onDeleteCartItem = function(id) {
        globals.httpManager.request(
            globals.httpManager.buildUrl({ fnc: 'deleteFromBasket', anid: id }),
            function() {
                var response = JSON.parse(this.responseText);
                if (response.result) {
                    Titanium.App.fireEvent('delteitemfromcart', { source: cartTable, type: 'delteitemfromcart', id: id });
                } else {
                    alert(response.error);
                }
            }
        );
    };

    var ProductScreen = require('views/product/ProductScreen').ProductScreen;
    var onCartTableRowClicked = function(e) {
        // Workaround for iOS where e.source is "undefined"
        if (!globals.isAndroid || !(e.source instanceof Titanium.UI.Button)) {
            globals.httpManager.request(
                globals.httpManager.buildUrl({ fnc: 'getArticle', anid: e.row.id }),
                function() {
                    var response = JSON.parse(this.responseText);
                    cartNavigation.open(new ProductScreen(cartNavigation, response.result), { animated: true });
                }
            );
        }
    };

    var createCartTableRows = function(articles) {
        var cartTableRows = [];
        globals._.each(articles, function(row) {
            var cartRow = Titanium.UI.createTableViewRow({ id: row.id, height: 'auto' });
            if (row.icon) {
                cartRow.leftImage = row.icon;
            }
            cartRow.addEventListener('click', onCartTableRowClicked);

            var detailsView = Titanium.UI.createView({
                layout: 'vertical',
                height: 'auto',
                width: '210dp',
                left: '10dp'
            });

            var nameLabelOptions = { text: row.title };
            globals._.defaults(nameLabelOptions, styles.PageItems.Cart.NameLabel);
            var nameLabel = Titanium.UI.createLabel(nameLabelOptions);
            detailsView.add(nameLabel);

            var priceLabelOptions = { text: row.price ? row.price + row.currency : L('price_on_request') };
            globals._.defaults(priceLabelOptions, styles.PageItems.Cart.PriceLabel);
            var totalPriceLabel = Titanium.UI.createLabel(priceLabelOptions);
            detailsView.add(totalPriceLabel);

            cartRow.add(detailsView);

            if (globals.isAndroid) {
                var quantityTextFieldOptions = {
                    id: row.id,
                    value: parseInt(row.amount, 10).toString()
                };
                globals._.defaults(quantityTextFieldOptions, styles.PageItems.Cart.QuantityTextField);
                var quantityTextField = Titanium.UI.createTextField(quantityTextFieldOptions);
                quantityTextField.addEventListener('return', onQuantityEdit);
                cartRow.add(quantityTextField);

                var deleteButtonOptions = {
                    id: row.id,
                    backgroundImage: '../../icons/icon_paper_trash.png',
                    top: '14dp',
                    right: '14dp'
                };
                globals._.defaults(deleteButtonOptions, styles.PageItems.IconButton);
                var deleteButton = Titanium.UI.createButton(deleteButtonOptions);
                deleteButton.addEventListener('click', function(e) {
                    onDeleteCartItem(e.source.id);
                });
                cartRow.add(deleteButton);
            } else {
                var quantityLabelOptions = {
                    id: row.id,
                    text: parseInt(row.amount, 10).toString(),
                    visible: true,
                    element: 'label'
                };
                globals._.defaults(quantityLabelOptions, styles.PageItems.Cart.QuantityLabel);
                var quantityLabel = Titanium.UI.createLabel(quantityLabelOptions);
                cartRow.add(quantityLabel);

                var quantityTextFieldOptions = {
                    id: row.id,
                    value: parseInt(row.amount, 10).toString(),
                    visible: false,
                    element: 'text'
                };
                globals._.defaults(quantityTextFieldOptions, styles.PageItems.Cart.QuantityTextField);
                var quantityTextField = Titanium.UI.createTextField(quantityTextFieldOptions);
                cartRow.add(quantityTextField);
            }

            cartTableRows.push(cartRow);
        });
        cartTable.setData(cartTableRows);
        Titanium.App.fireEvent('cartdataloaded', { source: cartTable, type: 'cartdataloaded' });
        return cartTableRows.length;
    };

    var loadCartData = function() {
        globals.httpManager.request(
            globals.httpManager.buildUrl({ fnc: 'getBasket' }),
            function() {
                var response = JSON.parse(this.responseText);
                Titanium.App.fireEvent(
                    'updatedcartitemcount',
                    { value: createCartTableRows(response.result.articles) }
                );
                Titanium.App.fireEvent(
                    'updatedcarttotal',
                    { value: (globals.loginManager.isUserLoggedIn() ? response.result.total : response.result.totalBrutto) + response.result.currency }
                );
            },
            function() {
                Titanium.App.fireEvent(
                    'updatedcartitemcount',
                    { value: createCartTableRows([]) }
                );
                Titanium.App.fireEvent(
                    'updatedcarttotal',
                    { value: String.formatDecimal(0, '0.00') }
                );
            }
        );
    };

    /**
     * Initial load of cart for creation
     */
    loadCartData();

    /**
     * Cart header
     */
    var articleLabelOptions = {
        left: '10dp',
        textid: 'cart_article_title'
    };
    globals._.defaults(articleLabelOptions, styles.PageItems.Cart.TopLabel);
    var quantityLabelOptions = {
        right: '10dp',
        textid: 'cart_quantity_title'
    };
    globals._.defaults(quantityLabelOptions, styles.PageItems.Cart.TopLabel);

    var headerLineView = Titanium.UI.createView({
        height: 'auto',
        width: globals.isAndroid ? 'auto' : globals.screenWidth
    });
    headerLineView.add(Titanium.UI.createLabel(articleLabelOptions));
    headerLineView.add(Titanium.UI.createLabel(quantityLabelOptions));

    var headerView = Titanium.UI.createView({
        height: globals.isAndroid ? '40dp' : 'auto',
        layout: 'vertical'
    });
    headerView.add(headerLineView);
    cartTable.setHeaderView(headerView);

    /**
     * Cart footer
     */
    var footerView = Titanium.UI.createView({
        height: '40dp'
    });
    var totalLabelOptions = {
        textid: 'cart_total',
        top: '10dp',
        left: '10dp'
    };
    globals._.defaults(totalLabelOptions, styles.PageItems.Cart.TopLabel);
    var totalLabel = Titanium.UI.createLabel(totalLabelOptions);

    var totalValueOptions = {
        text: '-',
        top: '10dp',
        right: '10dp'
    };
    globals._.defaults(totalValueOptions, styles.PageItems.Cart.TopLabel);
    var totalValue = Titanium.UI.createLabel(totalValueOptions);

    footerView.add(totalLabel);
    footerView.add(totalValue);
    cartTable.setFooterView(footerView);

    /**
     * Create 'Checkout' button
     */
    var checkoutButton = Titanium.UI.createButton({ titleid: 'checkout_button' });

    /**
     * Setup navigation from cart to checkout
     */
    var cartNavigation = null;

    if (globals.isAndroid) {
        cartNavigation = new globals.tabWindowManager(outerWindow, cartTable);

        checkoutButton.addEventListener('click', function() {
            if (!globals.loginManager.isUserLoggedIn()) {
                var loginRequiredDialog = Titanium.UI.createAlertDialog({ title: '', message: L('login_required'), ok: L('ok_button') });
                loginRequiredDialog.show();
                return;
            }

            var AddressScreen = require('views/checkout/AddressScreen').AddressScreen;
            var addressScreen = new AddressScreen(cartNavigation);
            cartNavigation.open(addressScreen, { animated: true });
        });

        headerView.setHeight('auto');
        headerView.add(checkoutButton);
        outerWindow.add(cartTable);
    } else {
        var cartWindow = Titanium.UI.createWindow({
            titleid: 'cart_tab_title'
        });
        cartWindow.add(cartTable);

        cartNavigation = Titanium.UI.iPhone.createNavigationGroup({
           window: cartWindow
        });

        outerWindow.add(cartNavigation);

        var doneButton = Titanium.UI.createButton({
            titleid: 'done_button',
            style: Titanium.UI.iPhone.SystemButtonStyle.DONE
        });
        doneButton.addEventListener('click', function() {
            cartWindow.setLeftNavButton(editButton);

            globals._.each(cartTable.data, function(structureElement) {
                globals._.each(structureElement.rows, function(row, rowIndex) {
                    var quantityTextField = null;
                    var quantityLabel = null;

                    globals._.each(row.getChildren(), function(view, index) {
                        if (undefined !== view.id && (undefined !== view.element && view.element == 'text')) {
                            quantityTextField = row.getChildren()[index];
                        } else if (undefined !== view.id && (undefined !== view.element && view.element == 'label')) {
                            quantityLabel = row.getChildren()[index];
                        }
                    });

                    if (quantityTextField && quantityLabel) {
                        quantityTextField.hide();
                        quantityTextField.visible = false;

                        quantityLabel.text = parseInt(quantityTextField.value, 10).toString()
                        quantityLabel.show();
                        quantityLabel.visible = true;
                    }
                });
            });

            cartTable.editing = false;
        });
        cartTable.addEventListener('delete', function(e) {
            doneButton.fireEvent('click', { source: doneButton, type: 'click' });
            onDeleteCartItem(e.row.id);
        });

        var addEventsToQuantityTextFields = function() {
            var doneEditingQuantity = function(e) {
                doneButton.fireEvent('click', { source: doneButton, type: 'click' });
                onQuantityEdit(e);
            };
            var changeQuantity = function(e) {
                if (isNaN(e.value)) {
                    // @todo validate input
                    Ti.API.warn('Value is NaN');
                }
            };

            globals._.each(cartTable.data, function(structureElement) {
                globals._.each(structureElement.rows, function(row, rowIndex) {
                    var quantityTextField = null;

                    globals._.each(row.getChildren(), function(view, index) {
                        if (undefined !== view.id && (undefined !== view.element && view.element == 'text')) {
                            quantityTextField = row.getChildren()[index];
                        }
                    });

                    if (quantityTextField) {
                        quantityTextField.addEventListener('return', doneEditingQuantity);
                        quantityTextField.addEventListener('blur', doneEditingQuantity);
                        quantityTextField.addEventListener('change', changeQuantity);
                    }
                });
            });   
        };
        Titanium.App.addEventListener('cartdataloaded', addEventsToQuantityTextFields);

        var editButton = Titanium.UI.createButton({
            titleid: 'edit_button'
        });
        editButton.addEventListener('click', function() {
            cartWindow.setLeftNavButton(doneButton);

            globals._.each(cartTable.data, function(structureElement) {
                globals._.each(structureElement.rows, function(row, rowIndex) {
                    var quantityTextField = null;
                    var quantityLabel = null;

                    globals._.each(row.getChildren(), function(view, index) {
                        if (undefined !== view.id && (undefined !== view.element && view.element == 'text')) {
                            quantityTextField = row.getChildren()[index];
                        } else if (undefined !== view.id && (undefined !== view.element && view.element == 'label')) {
                            quantityLabel = row.getChildren()[index];
                        }
                    });

                    if (quantityLabel && quantityTextField) {
                        quantityLabel.hide();
                        quantityLabel.visible = false;
                        
                        quantityTextField.value = parseInt(quantityLabel.text, 10).toString();
                        quantityTextField.show();
                        quantityTextField.visible = true;
                    }
                });
            });

            cartTable.editing = true;
        });

        checkoutButton.addEventListener('click', function() {
            if (!globals.loginManager.isUserLoggedIn()) {
                var loginRequiredDialog = Titanium.UI.createAlertDialog({ title: '', message: L('login_required') });
                loginRequiredDialog.show();
                return;
            }
            var AddressScreen = require('views/checkout/AddressScreen').AddressScreen;
            cartNavigation.open(new AddressScreen(cartNavigation), { animated: true });
        });

        cartWindow.setLeftNavButton(editButton);
        cartWindow.setRightNavButton(checkoutButton);
    }

    var tab = Titanium.UI.createTab({
        icon: globals.getTabIconForDevice('icons/cart.png', 'icons/cart_small.png'),
        titleid: 'cart_tab_title',
        window: outerWindow,
        disabled: !globals.httpManager.isOnline()
    });

    Titanium.App.addEventListener('updatedcartitemcount', function(e) {
        if (globals.isAndroid) {
            if (e.value > 0) {
                checkoutButton.show();
            } else {
                checkoutButton.hide();
            }
        } else {
            if (e.value > 0) {
                cartWindow.setLeftNavButton(editButton);
                cartWindow.setRightNavButton(checkoutButton);
                tab.setBadge(e.value);
            } else {
                cartWindow.setLeftNavButton(null);
                cartWindow.setRightNavButton(null);
                tab.setBadge(null);
            }
        }
    });

    Titanium.App.addEventListener('updatedcarttotal', function(e) {
        totalValue.setText(e.value);
    });
    Titanium.App.addEventListener('updatecart', function() {
        loadCartData();
    });
    Titanium.App.addEventListener('updateUserState', function() {
        loadCartData();
    });

    Titanium.App.addEventListener('additemtocart', function() {
        loadCartData();
    });

    Titanium.App.addEventListener('delteitemfromcart', function() {
        loadCartData();
    });

    Titanium.App.addEventListener('changeonlinestate', function(e) {
        tab.disabled = !e.isOnline;
        if (e.isOnline) {
            loadCartData();
        }
    });

    return tab;
};
