var Alloy = require("alloy");

var http = {
    request: function(requestMethod, url, data, callbackSuccess, callbackError) {
        var client = Ti.Network.createHTTPClient({
            onload: function() {
                var resp = JSON.parse(this.responseText);
                null == resp.error ? callbackSuccess(resp.result) : callbackError(resp.error);
            },
            onerror: function(e) {
                Ti.API.error(e);
                callbackError("Internal Error");
            },
            timeout: 5e3
        });
        client.open(requestMethod, url);
        client.send(data);
    },
    get: function(url, callbackSuccess, callbackError) {
        this.request("GET", url, null, callbackSuccess, callbackError);
    },
    post: function(url, data, callbackSuccess, callbackError) {
        this.request("POST", url, data, callbackSuccess, callbackError);
    }
};

exports.configDump = function() {
    Ti.API.info(Alloy.CFG);
};

exports.startScreen = function(callback) {
    var errorCb = function(text) {
        callback("Error: " + text);
    };
    http.get(exports.buildUrl({
        fnc: "getStartPage"
    }), callback, errorCb);
};

exports.contents = function(contentId, successCallback, errorCallback) {
    if (!errorCallback) var errorCallback = function(text) {
        successCallback("Error: " + text);
    };
    http.get(exports.buildUrl({
        fnc: "getContent",
        cnid: contentId
    }), successCallback, errorCallback);
};

exports.category = function(categoryId, successCallback, errorCallback) {
    if (!errorCallback) var errorCallback = function(text) {
        successCallback("Error: " + text);
    };
    http.get(exports.buildUrl({
        fnc: "getCategoryList",
        cnid: categoryId
    }), successCallback, errorCallback);
};

exports.productList = function(categoryId, successCallback, errorCallback) {
    if (!errorCallback) var errorCallback = function(text) {
        callback("Error: " + text);
    };
    http.get(exports.buildUrl({
        fnc: "getArticleList",
        cnid: categoryId
    }), successCallback, errorCallback);
};

exports.product = function(productId, successCallback, errorCallback) {
    if (!errorCallback) var errorCallback = function(text) {
        callback("Error: " + text);
    };
    http.get(exports.buildUrl({
        fnc: "getArticle",
        anid: productId
    }), successCallback, errorCallback);
};

exports.productPictures = function(productId, successCallback, errorCallback) {
    if (!errorCallback) var errorCallback = function(text) {
        callback("Error: " + text);
    };
    http.get(exports.buildUrl({
        fnc: "getArticleImages",
        anid: productId
    }), successCallback, errorCallback);
};

exports.productVariantGroups = function(productId, successCallback, errorCallback) {
    if (!errorCallback) var errorCallback = function(text) {
        callback("Error: " + text);
    };
    http.get(exports.buildUrl({
        fnc: "getArticleVariantGroups",
        anid: productId
    }), successCallback, errorCallback);
};

exports.productVariants = function(productId, selectedVariants, successCallback, errorCallback) {
    if (!errorCallback) var errorCallback = function(text) {
        callback("Error: " + text);
    };
    http.get(exports.buildUrl({
        fnc: "getArticleVariants",
        anid: productId,
        selectedVariant: selectedVariants
    }), successCallback, errorCallback);
};

exports.productVariantId = function(productId, selectedVariants, successCallback, errorCallback) {
    if (!errorCallback) var errorCallback = function(text) {
        successCallback("Error: " + text);
    };
    http.get(exports.buildUrl({
        fnc: "getVariantProductId",
        anid: productId,
        selectedVariant: selectedVariants
    }), successCallback, errorCallback);
};

exports.addToCart = function(productId, quantity, successCallback, errorCallback) {
    if (!errorCallback) var errorCallback = function() {
        successCallback("Error: " + test);
    };
    http.get(exports.buildUrl({
        fnc: "addToBasket",
        anid: productId,
        qty: quantity
    }), successCallback, errorCallback);
};

var serialize = function(obj, prefix) {
    var queryStringObj = [];
    for (var p in obj) {
        var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
        queryStringObj.push("object" == typeof v ? serialize(v, k) : encodeURIComponent(k) + "=" + encodeURIComponent(v));
    }
    return queryStringObj.join("&");
};

exports.buildUrl = function(params) {
    var url = Alloy.CFG.oxid.baseUrl;
    params && (url += (-1 == url.indexOf("?") ? "?" : "&") + serialize(params));
    return url;
};