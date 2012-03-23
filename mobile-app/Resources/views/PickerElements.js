exports.PickerField = function(clickCallback, fieldSettings) {
    var globals = require('globals');
    var button =  Titanium.UI.createButton({
        style: Titanium.UI.iPhone.SystemButton.DISCLOSURE,
        transform: Titanium.UI.create2DMatrix({ rotate: 90 })
    });
    
    var fieldOptions = fieldSettings || {};
    globals._.defaults(fieldOptions, {
        height: '40dp',
        width: '300dp',
        borderStyle: Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
        rightButton: button,
        rightButtonMode: Titanium.UI.INPUT_BUTTONMODE_ALWAYS
    });
    var field = Titanium.UI.createTextField(fieldOptions);

    field.addEventListener('click', function() {
        field.blur();
    });

    field.addEventListener('focus', function() {
        field.blur();
    });

    button.addEventListener('click', function() {
        if ('function' === typeof clickCallback) {
            clickCallback(field);
        }
        field.blur();
    });
    return field;
};
exports.PickerView = function(screen, field, data, clickCallback) {
    var pickerView = Titanium.UI.createView({
        height: '251dp',
        bottom: '-251dp',
        zIndex: 120
    });

    var pickerCancel = Titanium.UI.createButton({
        title: 'Cancel',
        style: Titanium.UI.iPhone.SystemButtonStyle.BORDERED
    });

    var pickerDone = Titanium.UI.createButton({
        title: 'Done',
        style: Titanium.UI.iPhone.SystemButtonStyle.DONE
    });

    var pickerSpacer = Titanium.UI.createButton({
        systemButton: Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
    });

    var pickerToolbar = Titanium.UI.iOS.createToolbar({
        top: '0dp',
        items: [pickerCancel, pickerSpacer, pickerDone]
    });

    var picker = Titanium.UI.createPicker({
        top: '43dp'
    });
    picker.selectionIndicator = true;

    pickerView.add(pickerToolbar);
    pickerView.add(picker);

    var slideInAnimation =  Titanium.UI.createAnimation({ bottom: 0 });
    var slideOutAnimation =  Titanium.UI.createAnimation({ bottom: -251 });

    pickerCancel.addEventListener('click',function() {
        pickerView.animate(
            slideOutAnimation,
            function() { screen.remove(pickerView); }
        );
    });

    pickerDone.addEventListener('click', function() {
        field.value = picker.getSelectedRow(0).title;
        field.valueId = picker.getSelectedRow(0).id;
        field.rowIndex = picker.columns[0].rows.indexOf(picker.getSelectedRow(0));

        if ('function' === typeof clickCallback) {
            clickCallback(field);
        }

        pickerView.animate(
            slideOutAnimation,
            function() {
                screen.remove(pickerView);
                delete(pickerView);
            }
        );
    });

    picker.add(data || []);
    picker.setSelectedRow(0, field.rowIndex);

    screen.add(pickerView);
    pickerView.animate(slideInAnimation);
};