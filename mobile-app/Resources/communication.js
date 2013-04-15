function getShopContent(url, callbackSuccess, callbackError) {
    var client = Ti.Network.createHTTPClient({
        onload: function(e) {
            var resp = JSON.parse(this.responseText);
            resp.error == null ? callbackSuccess(resp.result) : callbackError(resp.error);
        },
        onerror: function(e) {
            Ti.API.debug(e.error);
            callbackError("Internal Error");
        },
        timeout: 5000
    });
    client.open("GET", url);
    client.send();
}

var Alloy = require("alloy");

exports.configDump = function() {
    Ti.API.info(Alloy.CFG);
};

exports.startScreen = function(callback) {
    var errorCb = function(text) {
        callback("Error: " + text);
    }, url = Alloy.CFG.oxid.baseUrl + "&fnc=getStartPage", answer = getShopContent(url, callback, errorCb);
};

exports.buildUrl = function(params) {
    var url = Alloy.CFG.oxid.baseUrl;
    return url;
};