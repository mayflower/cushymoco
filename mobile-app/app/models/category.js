exports.definition = {
    config: {
        columns: {
            "categoryId":"string",
            "title":"string",
            "icon":"string",
            "hasChild":"boolean"
        },
        adapter: {
            "type":"categorySync",
        }
    }
};
