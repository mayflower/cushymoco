exports.definition = {
    config: {
        columns: {
            productId: "string",
            pictureId: "string",
            icon: "string",
            image: "string",
            bigImage: "string"
        },
        adapter: {
            type: "productPictureSync"
        }
    }
};

var Alloy = require("alloy"), _ = require("alloy/underscore")._, model, collection;

model = Alloy.M("productPicture", exports.definition, []);

collection = Alloy.C("productPicture", exports.definition, model);

exports.Model = model;

exports.Collection = collection;