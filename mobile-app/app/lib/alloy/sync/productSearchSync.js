var communication = require("communication");
module.exports.sync = function(method, model, options) {
    // Simple callback function for http requests.
    function callback(success, response) {
    	var articles = _.map(response.articles, function(article) {return article;});
        if (success) {
            options.success(articles, JSON.stringify(articles), options);
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

    var searchParam = options.data.searchParam || '';
    communication.searchProducts(searchParam, successCallback, errorCallback);
}
