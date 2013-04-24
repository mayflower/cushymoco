exports.definition = {
    config: {
        columns: {
            groupId: "integer",
            title: "string"
        },
        adapter: {
            type: "productVariantGroupSync"
        }
    }
};

var Alloy = require("alloy"), _ = require("alloy/underscore")._, model, collection;

model = Alloy.M("productVariantGroup", exports.definition, []);

collection = Alloy.C("productVariantGroup", exports.definition, model);

exports.Model = model;

exports.Collection = collection;