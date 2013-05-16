var communication = require("communication");
module.exports.sync = function(method, model, options) {
    // Simple callback function for http requests.
    function callback(success, response) {
        if (success) {
            options.success(response, JSON.stringify(response), options);
        } else {
            Ti.API.error(response);
            options.error(model, response, options);
            model.trigger("error");
        }
    }
    
    function successCallback(response) {
        callback(true, response);
    }
    
    function errorCallback(response) {
        callback(false, response);
    }

    var productId = options.data.productId || '';
    communication.product(productId, successCallback, errorCallback);
}
