var communication = require("communication");

exports.definition = {
    config: {
        columns: {
            "id":"string",
            "title":"string",
            "short":"string",
            "price":"string",
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
    			communication.searchProducts(searchParam, _successCallback, _errorCallback);
    		}
    	});
    	return Model;
    }
};
