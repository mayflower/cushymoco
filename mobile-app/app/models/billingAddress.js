exports.definition = {
	config: {
		columns: {
		    "street": "string",
		    "streetNo": "string",
		    "additional": "string",
		    "zip": "string",
		    "city": "string",
		    "state": "string",
		    "country": "string"
		},
        adapter:{
            type:"nullSync"
        }
	}
}

