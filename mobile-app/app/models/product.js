exports.definition = {
    config: {
        columns: {
            "productId":"string",
            "title":"string",
            "shortDesc":"string",
            "price":"float",
            "currency":"string",
            "formattedPrice":"string",
            "iconUrl":"string",
            "longDesc":"string",
            "link":"string",
            "hasVariants":"boolean",
            "variantGroupCount":"integer"
        },
        adapter: {
            "type":"productSync"
        }
    }
};
