var Alloy = require('alloy');

function getShopContent(url, callbackSuccess, callbackError){
	var client = Ti.Network.createHTTPClient({
		onload: function (e){
			var resp = JSON.parse(this.responseText);
	// Ti.API.info(resp.error);
	// Ti.API.info(resp.result);
			if (resp.error == null) {
				callbackSuccess(resp.result);
			} else {
				callbackError(resp.error);
			}
		},
		onerror: function(e){
			Ti.API.debug(e.error);
			callbackError("Internal Error");
		},
		timeout: 5000 // 5 seconds
	})
	client.open('GET', url);
	client.send();
}


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
	var url = Alloy.CFG.oxid.baseUrl + "&fnc=getStartPage";
	var answer = getShopContent(url, callback, errorCb);
}

exports.serialize = function(obj, prefix)
{
    var queryStringObj = [];
    for (var p in obj) {
        var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
        queryStringObj.push(
            typeof v == "object" ?
            exports.serialize(v, k) :
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
        url += (url.indexOf("?") == -1 ? "?" : "&") + exports.serialize(params);
	}
	return url;
}
