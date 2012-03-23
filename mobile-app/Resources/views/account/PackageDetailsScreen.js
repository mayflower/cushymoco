exports.PackageDetailsScreen = function() {
    var globals = require('globals');

    var orderDatas = [
        {
            title: 'Text Label',
            detail: 'Detailed Text Label'
        }
    ];

    var tableRows = [];
    globals._.each(orderDatas, function(data) {
        var title = Titanium.UI.createLabel({
            text: data.title,
            font: {
                fontSize: '12dp',
                fontWeight: 'bold'
            },
            left: '10dp',
            height: 'auto',
            width: '100dp',
            focusable: false
        });

        var detail = Titanium.UI.createLabel({
            text: data.detail,
            color: '#000',
            font: {
                fontSize: '14dp',
                fontWeight: 'bold'
            },
            left: '105dp',
            height: 'auto',
            width: '180dp'
        });

        var tableRow = Titanium.UI.createTableViewRow();
        tableRow.add(title);
        tableRow.add(detail);

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