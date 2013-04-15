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

exports.buildUrl = function(params)
{
	var url = Alloy.CFG.oxid.baseUrl;
	// magic happens
	return url;
}
