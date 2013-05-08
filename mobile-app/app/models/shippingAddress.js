exports.definition = {
	config: {
		columns: {
		    "firstName": "string",
		    "lastName": "string",
		    "company": "string",
		    "street": "string",
		    "streetNo": "string",
		    "additional": "string",
		    "zip": "string",
		    "city": "string",
		    "state": "string",
		    "country": "string",
		    "phone": "string",
		    "fax": "string"
		},
        adapter:{
            type:"nullSync"
        }
	}
}

