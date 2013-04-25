var Alloy = require("alloy");

var http = {
    request: function(requestMethod, url, data, callbackSuccess) {
        var client = Ti.Network.createHTTPClient({
            onload: function() {
                if (this.status >= 300) http.errorCallback("Network communication error!"); else {
                    var resp = JSON.parse(this.responseText);
                    null == resp.error ? callbackSuccess(resp.result) : http.errorCallback(resp.error);
                }
            },
            onerror: function(e) {
                Ti.API.error(e.error);
                http.errorCallback("Internal network error!");
            },
            autoRedirect: false,
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
    },
    errorCallback: function(message) {
        Titanium.UI.createAlertDialog({
            title: "Error occurred",
            message: message,
            ok: "OK"
        }).show();
    }
};

exports.configDump = function() {
    Ti.API.info(Alloy.CFG);
};

exports.startScreen = function(callback) {
    http.get(exports.buildUrl({
        fnc: "getStartPage"
    }), callback);
};

exports.contents = function(contentId, successCallback) {
    http.get(exports.buildUrl({
        fnc: "getContent",
        cnid: contentId
    }), successCallback);
};

exports.category = function(categoryId, successCallback) {
    http.get(exports.buildUrl({
        fnc: "getCategoryList",
        cnid: categoryId
    }), successCallback);
};

exports.productList = function(categoryId, successCallback) {
    http.get(exports.buildUrl({
        fnc: "getArticleList",
        cnid: categoryId
    }), successCallback);
};

exports.product = function(productId, successCallback) {
    http.get(exports.buildUrl({
        fnc: "getArticle",
        anid: productId
    }), successCallback);
};

exports.productPictures = function(productId, successCallback) {
    http.get(exports.buildUrl({
        fnc: "getArticleImages",
        anid: productId
    }), successCallback);
};

exports.productVariantGroups = function(productId, successCallback) {
    http.get(exports.buildUrl({
        fnc: "getArticleVariantGroups",
        anid: productId
    }), successCallback);
};

exports.productVariants = function(productId, selectedVariants, successCallback) {
    http.get(exports.buildUrl({
        fnc: "getArticleVariants",
        anid: productId,
        selectedVariant: selectedVariants
    }), successCallback);
};

exports.productVariantId = function(productId, selectedVariants, successCallback) {
    http.get(exports.buildUrl({
        fnc: "getVariantProductId",
        anid: productId,
        selectedVariant: selectedVariants
    }), successCallback);
};

exports.addToCart = function(productId, quantity, successCallback) {
    http.get(exports.buildUrl({
        fnc: "addToBasket",
        anid: productId,
        qty: quantity
    }), successCallback);
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