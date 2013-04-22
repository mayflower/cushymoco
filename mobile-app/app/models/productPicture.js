exports.definition = {
    config: {
        columns: {
            "productId":"string",
            "pictureId":"string",
            "icon":"string",
            "image":"string",
            "bigImage":"string",
        },
        adapter: {
            "type":"productPictureSync"
        }
    }
};
