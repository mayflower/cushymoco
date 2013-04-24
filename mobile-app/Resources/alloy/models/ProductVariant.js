exports.definition = {
    config: {
        columns: {
            groupId: "integer",
            variantId: "string",
            title: "string"
        },
        adapter: {
            type: "productVariantSync"
        }
    }
};

var Alloy = require("alloy"), _ = require("alloy/underscore")._, model, collection;

model = Alloy.M("productVariant", exports.definition, []);

collection = Alloy.C("productVariant", exports.definition, model);

exports.Model = model;

exports.Collection = collection;