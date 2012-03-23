exports.PriceListScreen = function() {
    var globals = require('globals');

    var pricelistData = [
        {
            name: 'Excel',
            url: 'http://www.google.com/'
        },
        {
            name: 'PDF',
            url: 'http://www.google.com/'
        }
    ];

    var tableRows = [];
    globals._.each(pricelistData, function(data) {
        var row = {
            title: data.name,
            color: '#000',
            hasChild: true
        };
        tableRows.push(row);
    });

    var table = Titanium.UI.createTableView({
        style: Titanium.UI.iPhone.TableViewStyle.PLAIN,
        scrollable: true,
        minRowHeight: '40dp',
        data: tableRows
    });
    table.addEventListener('click', function(e) {
        Titanium.Platform.openURL(pricelistData[e.index].url);
    });

    var window = null;
    if (globals.isAndroid) {
        window = Titanium.UI.createView();
    } else {
        window = Titanium.UI.createWindow();
    }

    window.add(table);
    return window;
};
