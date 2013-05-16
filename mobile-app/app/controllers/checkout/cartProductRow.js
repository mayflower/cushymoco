var args = arguments[0] || {};

$.productIcon.image = args.icon;
$.productTitle.text = args.title;
// $.productShortDesc.text = args.shortDesc;
$.quantity.value = args.amount;
$.productPrice.text = args.price;

$.quantity.addEventListener('blur', function(e) {
    var newValue = e.value;
    if (newValue != args.amount) {
        $.cartProductRow.fireEvent('cart.product:update', {
            productId:args.productId,
            quantity:e.value,
            success:function(response) {
                $.productPrice.text = response.productPrice;
                args.amount = newValue;
            }
        });
    }
});

$.labelView.setWidth((Ti.Platform.displayCaps.platformWidth - 160) + 'px');

function rowEventListener(e) {
    var isDeleteEvent = (e.type == 'swipe' && e.direction && e.direction == 'right') || 
        (e.type == 'click' && e.source.id == 'deleteButton');

    if (isDeleteEvent) {
        $.cartProductRow.fireEvent('cart.product:delete', {
            productId:args.productId,
            rowIndex:e.index,
            rowData:e.rowData
        });
    } else if (e.type == "click" && e.source.id != 'deleteButton') {
        $.cartProductRow.fireEvent('cart.product:details', {
            productId:args.productId
        });
    }
};
