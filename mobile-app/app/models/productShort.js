exports.definition = {
    config: {
        columns: {
            "productId":"string",
            "title":"string",
            "shortDesc":"string",
            "price":"float",
            "currency":"string",
            "formattedPrice":"string",
            "iconUrl":"string"
        },
        adapter: {
            "type":"productListSync"
        }
    }
};
