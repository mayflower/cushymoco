var parentModelSet;
exports.definition = {
	config: {
		columns: {
		    "totalProducts": "string",
		    "shipping": "string",
		    "total": "string",
		    "currency": "string"
		},
		adapter: {
			type: "cartSync"
		}
	},		
	extendModel: function(Model) {
		_.extend(Model.prototype, {
            realSet:Model.prototype.set,
		    initialize:function() {
		        this.products = Alloy.createCollection('cartProduct');
		    },
			set:function(attributes, options) {
			    if (attributes.products) {
			        this.products.reset(attributes.products);
			        delete attributes.products;
			    }
			    
		        this.realSet(attributes, options);
			}
		});
		
		return Model;
	}
}

