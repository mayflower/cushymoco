var Alloy = require('alloy');

var http = {
    request: function (requestMethod, url, data, callbackSuccess) {
        var client = Ti.Network.createHTTPClient({
            onload: function (e) {
                if (this.status >= 300) {
                    http.errorCallback(L('error.network.generic_communication'))
                } else {
                    var resp = {result:null,error:null};
                    try {
                        resp = JSON.parse(this.responseText);
                    } catch (err) {
                        resp.error = L('error.network.invalid_response');
                    }
                    if (resp.error == null) {
                        callbackSuccess(resp.result);
                    } else {
                        http.errorCallback(resp.error);
                    }
                }
            },
            onerror: function(e) {
                Ti.API.error(e.error);
                http.errorCallback(L('error.network.internal'));
            },
            autoRedirect: false,
            timeout: 5000 // 5 seconds
        });
        client.open(requestMethod, url);
        client.send(data);
    },
    get: function (url, callbackSuccess) {
        this.request('GET', url, null, callbackSuccess);
    },
    post: function (url, data, callbackSuccess) {
        this.request('POST', url, data, callbackSuccess);
    },
    errorCallback: function(message) {
        var errorDialog = Titanium.UI.createAlertDialog({
            title:L('error.dialog.generic_title'),
            message:message,
            ok:'OK'
        }).show();
    }
};

exports.configDump = function()
{
	Ti.API.info(Alloy.CFG);
}

exports.startScreen = function(callback)
{
	http.get(exports.buildUrl({fnc:"getStartPage"}), callback);
}

exports.contents = function(contentId, successCallback)
{
    http.get(
        exports.buildUrl({fnc:"getContent",cnid:contentId}),
        successCallback
    );
}

exports.category = function(categoryId, successCallback)
{
    http.get(
        exports.buildUrl({fnc:"getCategoryList",cnid:categoryId}),
        successCallback
    );
}

exports.productList = function(categoryId, successCallback)
{
    http.get(
        exports.buildUrl({fnc:"getArticleList",cnid:categoryId}),
        successCallback
    );
}

exports.product = function(productId, successCallback)
{
    http.get(
        exports.buildUrl({fnc:"getArticle",anid:productId}),
        successCallback
    );
}

exports.productPictures = function(productId, successCallback)
{
    http.get(
        exports.buildUrl({fnc:"getArticleImages",anid:productId}),
        successCallback
    );
}

exports.productVariantGroups = function(productId, successCallback)
{
    http.get(
        exports.buildUrl({fnc:"getArticleVariantGroups", anid:productId}),
        successCallback
    );
}

exports.productVariants = function(productId, selectedVariants, successCallback)
{
    http.get(
        exports.buildUrl({fnc:"getArticleVariants", anid:productId, selectedVariant:selectedVariants}),
        successCallback
    );
}

exports.productVariantId = function(productId, selectedVariants, successCallback)
{
    http.get(
        exports.buildUrl({fnc:'getVariantProductId',anid:productId,selectedVariant:selectedVariants}),
        successCallback
    );
}

exports.addToCart = function(productId, quantity, successCallback)
{
    http.get(
        exports.buildUrl({fnc:"addToBasket",anid:productId,qty:quantity}),
        successCallback
    );
}

exports.login = function(userId, password, stayLoggedIn, successCallback)
{
    var loginData = {
        fnc:"login",
        "lgn_usr":userId,
        "lgn_pwd":password
    };
    
    if (stayLoggedIn) {
        loginData.lgn_cook = 1;
    }
    
    http.get(
        exports.buildUrl(loginData),
        successCallback
    );
}

exports.user = function(successCallback)
{
    http.get(
        exports.buildUrl({fnc:"getUserData"}),
        successCallback
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
