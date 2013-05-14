var cartModel = Alloy.createModel('cart');
var tableData = [];

function onProductDelete(e)
{
    cartModel.products.at(e.rowIndex).destroy({
        success:function(response) {
            if (response.success) {
                $.cartProducts.deleteRow(e.rowIndex, {animated: true});
                $.totalProducts.text = response.totalProducts + ' ' + response.currency;
                $.shippingCosts.text = response.shipping + ' ' + response.currency;
                $.totalCosts.text = response.total + ' ' + response.currency;
            } else {
                cartModel.fetch();
            }
        }
    });
}

function onProductUpdate(e)
{
    var cartProduct = cartModel.products.where({productId:e.productId})[0];
    cartProduct.set({amount:e.quantity}, {
        success:function(response) {
            Ti.API.warn(response);
            if (e.success) {
                e.success(response);
            }
            
            $.totalProducts.text = response.totalProducts + ' ' + response.currency;
            $.shippingCosts.text = response.shipping + ' ' + response.currency;
            $.totalCosts.text = response.total + ' ' + response.currency;
        }
    });
}

function onProductDetails(e)
{
    var navWin = Alloy.createController("product/details", {"productId":e.productId}).getView();
    $.cartNavigation.open(navWin);
    navWin.addEventListener('close', function(e) {
        Ti.API.warn(e);
    });
}

cartModel.on('change', function() {
    cartModel.products.map(function(cartProduct) {
        var row = Alloy.createController('checkout/cartProductRow', {
            'productId': cartProduct.get('productId'),
            'icon': cartProduct.get('icon'),
            'price': cartProduct.get('total') + ' ' + cartProduct.get('currency'),
            'title': cartProduct.get('title'),
            'amount': cartProduct.get('amount'),
            'shortDesc': cartProduct.get('shortDesc')
        }).getView();
        tableData.push(row);
    });
    $.cartProducts.setData(tableData);
    
    var currency = cartModel.get('currency');
    $.totalProducts.text = cartModel.get('totalProducts') + ' ' + currency;
    $.shippingCosts.text = cartModel.get('shipping') + ' ' + currency;
    $.totalCosts.text = cartModel.get('total') + ' ' + currency;
});

cartModel.fetch();

$.cartProducts.addEventListener('cart.product:delete', onProductDelete);
$.cartProducts.addEventListener('cart.product:update', onProductUpdate);
$.cartProducts.addEventListener('cart.product:details', onProductDetails);

