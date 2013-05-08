exports.definition = {
    config : {
        columns : {
            "username" : "string",
            "firstname" : "string",
            "lastname" : "string",
            "customerNo" : "string",
            "company": "string",
            "phone" : "string",
            "fax" : "string",
            "privatePhone" : "string",
            "mobile" : "string"
        },
        adapter:{
            type:"nullSync"
        }
    }
}
