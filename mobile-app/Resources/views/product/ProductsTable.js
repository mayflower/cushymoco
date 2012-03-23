exports.ProductsTable = function(navigation, category, searchResult) {
    var globals = require('globals');

    var table = Titanium.UI.createTableView({
        style: Titanium.UI.iPhone.TableViewStyle.PLAIN,
        scrollable: true,
        minRowHeight: '40dp',
        data: []
    });

    if (undefined === searchResult || null === searchResult) {
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
        table.search = searchBar;
    }

    var pagination = 0;
    var itemsPerPage = parseInt(globals.Database.getSetting('itemsPerPage'), 10);
    var loadMoreView = Titanium.UI.createView({
        width: globals.screenWidth,
        height: '50dp',
        visible: false,
        center: { x: globals.screenWidth / 2, y: 0 }
    });
    var loadMoreButton = Titanium.UI.createButton({
        width: globals.screenWidth,
        height: '50dp',
        titleid: (undefined === searchResult || null === searchResult) ? 'table_load_more_title' : 'table_load_more_results_title'
    });
    loadMoreView.add(loadMoreButton);
    loadMoreButton.addEventListener('click', function() {
        table.fireEvent('loadmore', { source: loadMoreButton, type: 'loadmore', page: ++pagination });
    });
    table.setFooterView(loadMoreView);

    var tableData = [];
    var parseServerResponse = function(response) {
        loadMoreView.hide();
        loadMoreView.visible = false;

        globals._.each(response.result.articles, function(row) {
            var rowData = row;
            if (rowData.icon) {
                rowData.leftImage = rowData.icon;
            }
            tableData.push(rowData);
        });
        table.setData(tableData);

        if (((pagination + 1) * itemsPerPage) < parseInt(response.result.count, 10)) {
            loadMoreView.show();
            loadMoreView.visible = true;
        } else {
            loadMoreView.hide();
            loadMoreView.visible = false;
        }
    };

    if (undefined !== category && null !== category) {
        var loadProductTableData = function() {
            globals.httpManager.request(
                globals.httpManager.buildUrl({
                    fnc: 'getArticleList',
                    cnid: category.id,
                    pgNr: pagination,
                    _artperpage: itemsPerPage
                }),
                function() {
                    parseServerResponse(JSON.parse(this.responseText));
                }
            );
        };

        table.addEventListener('loadmore', loadProductTableData);
        loadProductTableData();
    } else if (undefined !== searchResult && null !== searchResult) {
        var searchText = searchResult.searchText;
        var loadMoreSearchResults = function() {
            globals.httpManager.request(
                globals.httpManager.buildUrl({
                    fnc: 'searchProducts',
                    searchparam: searchText,
                    pgNr: pagination,
                    _artperpage: itemsPerPage
                }),
                function() {
                    parseServerResponse(JSON.parse(this.responseText));
                }
            );
        };

        table.addEventListener('loadmore', loadMoreSearchResults);
        parseServerResponse(searchResult);
    }

    var ProductScreen = require('views/product/ProductScreen').ProductScreen;
    table.addEventListener('click', function(e) {
        var product = e.rowData;
        globals.httpManager.request(
            globals.httpManager.buildUrl({ fnc: 'getArticle', anid: product.id }),
            function() {
                var response = JSON.parse(this.responseText);
                navigation.open(new ProductScreen(navigation, response.result), { animated: true });
            }
        );
    });

    var window = null;
    if (globals.isAndroid) {
        window = Titanium.UI.createView();
    } else {
        window = Titanium.UI.createWindow({
            titleid: (undefined !== searchResult && null !== searchResult) ? 'search_result_table_title' : 'product_table_title'
        });
    }

    window.add(table);

    return window;
};
