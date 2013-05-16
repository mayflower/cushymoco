var communication = require("communication");
module.exports.sync = function(method, model, options) {
    // Simple callback function for http requests.
    function callback(status, response) {
        if (status) {
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

Ti.API.warn(options.data);
	var contentId = options.data.contentId || '';
    communication.contents(contentId, successCallback, errorCallback);
};

// Perform some actions before creating the Model class
module.exports.beforeModelCreate = function(config, name) {
    return config;
};

// Perform some actions after creating the Model class 
module.exports.afterModelCreate = function(Model, name) {
    return Model;
};