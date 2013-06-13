var communication = require("communication");

exports.definition = {
    config: {
        columns: {
            "id":"string",
            "title":"string",
            "short":"string",
            "price":"string",
            "fPrice":"string",
            "icon": "string"
        },
        adapter: {
        	"type": "productSearchSync"
        }
    },
    extendCollection: function(Model) {
    	_.extend(Model.prototype, {
    		
    		fetch: function(options) {
    			var that = this;
    		    var _callback = function(success, response) {
    		    	that.reset(undefined, {silent:true});
	    			_.each(response.articles, function(article) {
	    				that.push(article);
	    			});
	    			that.totalAmount = response.count;
	    			that.trigger('reset');
	    		};
	    		var _successCallback = function(response) {
	    			_callback(true, response);
	    		};
    			var _errorCallback = function(response) {
    				_callback(false, response);
    			};
    			
    			
    		    var searchParam = options.data.searchParam || '';
    		    var itemsPerPage = options.data.itemsPerPage || 10;
    		    var page = options.data.page || 0;
    			communication.searchProducts(searchParam, itemsPerPage, page, _successCallback, _errorCallback);
    		}
    	});
    	return Model;
    }
};
