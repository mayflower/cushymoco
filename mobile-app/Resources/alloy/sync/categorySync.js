var communication = require("communication");

module.exports.sync = function(method, model, options) {
    function callback(status, response) {
        if (status) options.success(response, JSON.stringify(response), options); else {
            Ti.API.error(response);
            options.error(model, response, options);
            model.trigger("error");
        }
    }
    function successCallback(response) {
        callback(!0, response);
    }
    function errorCallback(response) {
        callback(!1, response);
    }
    options.data.catId || (options.data.catId = "");
    communication.category(options.data.catId, successCallback, errorCallback);
};

module.exports.beforeModelCreate = function(config, name) {
    return config;
};

module.exports.afterModelCreate = function(Model, name) {
    return Model;
};