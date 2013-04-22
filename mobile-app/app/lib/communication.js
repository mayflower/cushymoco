var Alloy = require('alloy');

var http = {
    request: function (requestMethod, url, data, callbackSuccess, callbackError){
        var client = Ti.Network.createHTTPClient({
            onload: function (e){
                var resp = JSON.parse(this.responseText);
                if (resp.error == null) {
                    callbackSuccess(resp.result);
                } else {
                    callbackError(resp.error);
                }
            },
            onerror: function(e){
                Ti.API.error(e);
                callbackError("Internal Error");
            },
            timeout: 5000 // 5 seconds
        });
        client.open(requestMethod, url);
        client.send(data);
    },
    get: function (url, callbackSuccess, callbackError){
        this.request('GET', url, null, callbackSuccess, callbackError);
    },
    post: function (url, data, callbackSuccess, callbackError){
        this.request('POST', url, data, callbackSuccess, callbackError);
    }
};

exports.configDump = function()
{
	Ti.API.info(Alloy.CFG);
}

exports.startScreen = function(callback)
{
	var errorCb = function(text)
	{
		callback("Error: " + text);		
	}
	http.get(exports.buildUrl({fnc:"getStartPage"}), callback, errorCb);
}

exports.category = function(categoryId, successCallback, errorCallback)
{
    if (!errorCallback) {
        var errorCallback = function(text)
        {
            callback("Error: " + text);     
        };
    }
    
    http.get(
        exports.buildUrl({fnc:"getCategoryList",cnid:categoryId}),
        successCallback,
        errorCallback
    );
}

exports.productList = function(categoryId, successCallback, errorCallback)
{
    if (!errorCallback) {
        var errorCallback = function(text)
        {
            callback("Error: " + text);     
        };
    }
    
    http.get(
        exports.buildUrl({fnc:"getArticleList",cnid:categoryId}),
        successCallback,
        errorCallback
    );
}

exports.product = function(productId, successCallback, errorCallback)
{
    if (!errorCallback) {
        var errorCallback = function(text)
        {
            callback("Error: " + text);     
        };
    }
    
    http.get(
        exports.buildUrl({fnc:"getArticle",anid:productId}),
        successCallback,
        errorCallback
    );
}

exports.productPictures = function(productId, successCallback, errorCallback)
{
    if (!errorCallback) {
        var errorCallback = function(text)
        {
            callback("Error: " + text);     
        };
    }
    
    http.get(
        exports.buildUrl({fnc:"getArticleImages",anid:productId}),
        successCallback,
        errorCallback
    );
}

var serialize = function(obj, prefix)
{
    var queryStringObj = [];
    for (var p in obj) {
        var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
        queryStringObj.push(
            typeof v == "object" ?
            serialize(v, k) :
            encodeURIComponent(k) + "=" + encodeURIComponent(v)
        );
    }
    
    return queryStringObj.join("&");
}

exports.buildUrl = function(params)
{
	var url = Alloy.CFG.oxid.baseUrl;
	// adding URL parameters, if given
	if (params) {
        url += (url.indexOf("?") == -1 ? "?" : "&") + serialize(params);
	}
	return url;
}
