exports.definition = {
    config: {
        columns: {
            productId: "string",
            title: "string",
            shortDesc: "string",
            price: "float",
            currency: "string",
            formattedPrice: "string",
            iconUrl: "string",
            longDesc: "string",
            link: "string",
            hasVariants: "boolean"
        },
        adapter: {
            type: "productSync"
        }
    }
};

var Alloy = require("alloy"), _ = require("alloy/underscore")._, model, collection;

model = Alloy.M("product", exports.definition, []);

collection = Alloy.C("product", exports.definition, model);

exports.Model = model;

exports.Collection = collection;