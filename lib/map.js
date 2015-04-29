"use strict";

module.exports = map;

function map (query) {

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