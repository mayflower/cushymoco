exports.definition = {
    config: {
        columns:{},
        adapter:{
            type:"userSync"
        }
    },
	extendModel: function(Model) {		
		_.extend(Model.prototype, {
			initialize:function(){
			    this.account = Alloy.createModel("account");
			    this.billingAddress = Alloy.createModel("billingAddress");
			    this.shippingAddresses = Alloy.createCollection("shippingAddress");
			},
			set:function(a) {
			    if (a.user) {
			        this.account.set(a.user);
			    }
			    if (a.billing) {
			        this.billingAddress.set(a.billing);
			    }
			    if (a.shipping) {
			        this.shippingAddresses.reset(a.shipping);
			    }
			    
			    this.trigger("change")
			}
		});
		
		return Model;
	}
}

