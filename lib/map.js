"use strict";


var is = require("torf");


module.exports = map;

function map (query) {

	if(!is.ok(query)){
		return "";
	}
	var qs = "?q=";
	var storeString = [];

	var field;
	for (field in query) {
		if(query.hasOwnProperty(field)){
			storeString.push(field + ":" + query[field]);
		}
	}

	return qs + storeString.join(" AND ");
}