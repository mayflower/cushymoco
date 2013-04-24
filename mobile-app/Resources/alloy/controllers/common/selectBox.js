function Controller() {
    function setRows(options) {
        rows = [];
        options.map(function(option) {
            rows.push(Titanium.UI.createPickerRow({
                title: option.title
            }));
        });
        $._picker.picker.add(rows);
    }
    function showPicker() {
        $._picker.view.animate(animations.show);
    }
    function pickerCancel() {
        $._picker.view.animate(animations.hide);
    }
    function pickerDone(e) {
        pickerCancel(e);
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    var $ = this;
    var exports = {};
    $.__views.selectBoxView = Ti.UI.createView({
        id: "selectBoxView",
        height: Ti.UI.SIZE,
        width: Ti.UI.SIZE
    });
    $.__views.selectBoxView && $.addTopLevelView($.__views.selectBoxView);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var defaults = {
        hintText: "",
        rows: [],
        value: null,
        activeWindow: null
    };
    var args = arguments[0] || {};
    $._selectBox = {};
    $._picker = {};
    $._params = _.defaults(args, defaults);
    var animations = {
        show: Titanium.UI.createAnimation({
            bottom: 0
        }),
        hide: Titanium.UI.createAnimation({
            bottom: -251
        })
    };
    var rows = [];
    $._selectBox.button = Titanium.UI.createButton({
        style: Ti.UI.iPhone.SystemButton.DISCLOSURE,
        transform: Titanium.UI.create2DMatrix({
            rotate: 90
        })
    });
    $._selectBox.textField = Titanium.UI.createTextField({
        hintText: $._params.hintText,
        value: $._params.value,
        height: 40,
        width: 300,
        top: 20,
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
        rightButton: $._selectBox.button,
        rightButtonMode: Ti.UI.INPUT_BUTTONMODE_ALWAYS
    });
    $._selectBox.button.addEventListener("click", showPicker);
    $._picker.view = Titanium.UI.createView({
        height: 251,
        bottom: -251
    });
    $._picker.cancel = Titanium.UI.createButton({
        title: "Cancel",
        style: Ti.UI.iPhone.SystemButtonStyle.BORDERED
    });
    $._picker.done = Titanium.UI.createButton({
        title: "Done",
        style: Ti.UI.iPhone.SystemButtonStyle.DONE
    });
    $._picker.spacer = Titanium.UI.createButton({
        systemButton: Ti.UI.iPhone.SystemButton.FLEXIBLE_SPACE
    });
    $._picker.toolbar = Titanium.UI.iOS.createToolbar({
        top: 0,
        items: [ $._picker.cancel, $._picker.spacer, $._picker.done ]
    });
    $._picker.picker = Titanium.UI.createPicker({
        top: 43
    });
    $._picker.picker.selectionIndicator = true;
    setRows($._params.rows);
    $._picker.view.add($._picker.toolbar);
    $._picker.view.add($._picker.picker);
    $._params.activeWindow && $._params.activeWindow.add($._picker.view);
    $._picker.done.addEventListener("click", pickerDone);
    $._picker.cancel.addEventListener("click", pickerCancel);
    Ti.API.warn($._selectBox.textField);
    $.selectBoxView.add($._selectBox.textField);
    Ti.API.warn($._selectBox.textField);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;