var CategoryTable = function(navigation, parentCategory) {
    var globals = require('globals');
    var ProductsTable = require('views/product/ProductsTable',true).ProductsTable;

    var searchBar = Titanium.UI.createSearchBar({ showCancel: false });
    searchBar.addEventListener('blur', function() {
        searchBar.showCancel = false;
    });
    searchBar.addEventListener('focus', function() {
        searchBar.showCancel = true;
    });
    searchBar.addEventListener('cancel', function() {
        searchBar.blur();
    });
    searchBar.addEventListener('return', function() {
        searchBar.blur();
    });

    var table = Titanium.UI.createTableView({
        style: Titanium.UI.iPhone.TableViewStyle.PLAIN,
        scrollable: true,
        minRowHeight: '40dp',
        data: [],
        search: searchBar
    });
    table.addEventListener('click', function(e) {
        var category = e.rowData;
        if (category.hasChild) {
            navigation.open(new CategoryTable(navigation, category), { animated: true });
        } else {
            navigation.open(new ProductsTable(navigation, category), { animated: true });
        }
    });

    var requestParams = { fnc: 'getCategoryList' };
    if (undefined !== parentCategory && null !== parentCategory) {
        globals._.extend(requestParams, { cnid: parentCategory.id });
    }
    var loadTableData = function() {
        globals.httpManager.request(
            globals.httpManager.buildUrl(requestParams),
            function() {
                var response = JSON.parse(this.responseText);
                var tableData = [];
                globals._.each(response.result, function(row) {
                    tableData.push(row);
                });
                table.setData(tableData);
            }
        );
    };
    loadTableData();
    Titanium.App.addEventListener('changeonlinestate', function(e) {
        if (e.isOnline) {
            loadTableData();
        }
    });

    var window = null;
    if (globals.isAndroid) {
        window = Titanium.UI.createView();
    } else {
        window = Titanium.UI.createWindow({
            titleid: (undefined !== parentCategory && null !== parentCategory) ? parentCategory.title : 'category_table_title'
        });
    }

    window.add(table);

    return window;
};
exports.CategoryTable = CategoryTable;
