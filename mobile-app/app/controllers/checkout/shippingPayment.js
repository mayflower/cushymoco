var args = arguments[0] || {};
var shippingPaymentModel = Alloy.createModel('shippingPayment');
var labels = [];

shippingPaymentModel.fetch();
shippingPaymentModel.on('change', function() {
    shippingPaymentModel.shippings.map(function(shipping) {
        var view = Ti.UI.createView({
            layout:'horizontal',
            height:Ti.UI.SIZE
        });
        view.add(
            Ti.UI.createLabel({
                text:shipping.get('id'),
                width:"50%"
            })
        );
        view.add(
            Ti.UI.createLabel({
                text:shipping.get('title'),
                width:"50%"
            })
        );
        $.shippingView.add(view);
    });

    shippingPaymentModel.payments.map(function(payment) {
        var view = Ti.UI.createView({
            layout:'horizontal',
            height:Ti.UI.SIZE
        });
        view.add(
            Ti.UI.createLabel({
                text:payment.get('id'),
                width:"50%"
            })
        );
        view.add(
            Ti.UI.createLabel({
                text:payment.get('title'),
                width:"50%"
            })
        );
        $.paymentView.add(view);
    });
});
