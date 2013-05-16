var communication = require('communication');
exports.definition = {
	config: {
		columns: {
		    "productId": "string",
		    "title": "string",
		    "shortDesc": "string",
		    "price": "string",
		    "currency": "string",
		    "formattedPrice": "string",
		    "icon": "string",
		    "longDesc": "string",
		    "link": "string",
		    "hasVariants": "string",
		    "variantGroupCount": "string",
		    "cartItemId": "string",
		    "amount": "string"
		},
		adapter: {
			type: "nullSync"
		}
	},
	extendCollection:function (Collection) {
	    _.extend(Collection.prototype, {
	        initialize:function() {
	            this.on('remove', function(model, collection, options) {
	                communication.deleteFromCart(model.get('productId'), options.success);
	            });
	            this.on('change:amount', function(model, value, options) {
	                communication.updateCartItem(model.get('productId'), value, options.success);
	            });
	        },
	        deleteProduct: function(productId) {
	            var cartProduct;
	            _.each(this.models, function(model) {
                    if (model.get && (model.get('productId') == productId)) {
                        cartProduct = model;
                    }
                });
	            
	            return cartProduct;
	        }
	    });
	}
}

