exports.definition = {
    config: {
        columns: {
            productId: "string",
            title: "string",
            shortDesc: "string",
            price: "float",
            currency: "string",
            formattedPrice: "string",
            iconUrl: "string"
        },
        adapter: {
            type: "productListSync"
        }
    }
};

var Alloy = require("alloy"), _ = require("alloy/underscore")._, model, collection;

model = Alloy.M("productShort", exports.definition, []);

collection = Alloy.C("productShort", exports.definition, model);

exports.Model = model;

exports.Collection = collection;