exports.definition = {
	config: {
		columns: {
		    "currentShippingId": "string"
		},
		adapter: {
			type: "shippingPaymentSync"
		}
	},		
	extendModel: function(Model) {		
		_.extend(Model.prototype, {
            realSet:Model.prototype.set,
    	    initialize:function() {
		        this.shippings = Alloy.createCollection('simpleShipPay');
		        this.payments = Alloy.createCollection('simpleShipPay');
		    },
		    set:function(attributes, options) {
                if (attributes.shippings) {
                    this.shippings.reset(attributes.shippings);
                    delete attributes.shippings;
                }

                if (attributes.payments) {
                    this.payments.reset(attributes.payments);
                    delete attributes.payments;
                }
                
                this.realSet(attributes, options);
		    }
			// extended functions and properties go here
		});
		
		return Model;
	}
}

