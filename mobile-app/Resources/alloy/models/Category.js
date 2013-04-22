exports.definition = {
    config: {
        columns: {
            categoryId: "string",
            title: "string",
            icon: "string",
            hasChild: "boolean"
        },
        adapter: {
            type: "categorySync"
        }
    }
};

var Alloy = require("alloy"), _ = require("alloy/underscore")._, model, collection;

model = Alloy.M("category", exports.definition, []);

collection = Alloy.C("category", exports.definition, model);

exports.Model = model;

exports.Collection = collection;