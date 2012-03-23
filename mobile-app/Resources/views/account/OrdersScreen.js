exports.OrdersScreen = function() {
    var globals = require('globals');

    var orderDatas = [
        {
            title: 'Text Label',
            detail: 'Detailed Text Label',
            hasChild: true
        }
    ];

    var tableRows = [];
    globals._.each(orderDatas, function(data) {
        var title = Titanium.UI.createLabel({
            text: data.title,
            color: '#000',
            font: {
                fontSize: '16dp',
                fontWeight: 'bold'
            },
            left: '10dp',
            height: 'auto',
            width: '120dp',
            focusable: false
        });

        var detail = Titanium.UI.createLabel({
            text: data.detail,
            font: {
                fontSize: '14dp',
                fontWeight: 'bold'
            },
            left: '135dp',
            height: 'auto',
            width: '145dp',
            focusable: false
        });

        var tableRow = Titanium.UI.createTableViewRow();
        tableRow.add(title);
        tableRow.add(detail);
        tableRow.hasChild =  data.hasChild;

        tableRows.push(tableRow);
    });

    var table = Ti.UI.createTableView({
        style: Titanium.UI.iPhone.TableViewStyle.PLAIN,
        scrollable: true,
        minRowHeight: '40dp',
        data: tableRows
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