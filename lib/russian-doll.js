"use strict";

module.exports = instantiate;

var request = require("./request.js");
var is = require("torf");

function instantiate (config) {

	if(!is.ok(config.host) || !is.ok(config.port) || !is.ok(config.index) || !is.ok(config.type)){
		throw new Error("Missing config object");
	}

	var baseUrl = config.host + ":" + config.port + "/" + config.index + "/" + config.type;

	return {
		/**
		 *	Creates an entry in the db
		 *	@param {Object} obj to create
		 *	@param {Function} callback with the first
		 *	argument and error (if present) and the second 
		 *	the new object created.
		 */
		create: function (obj, cb) {

			var url = baseUrl;

			if (obj.id) {
				url += "/" + obj.id;
			}

			var optsCreate = {
				uri: url,
				method: "POST",
				body: obj
			};


			request(optsCreate, function (e, r) {

				if(e){ 
					return cb(e, null);
				}else{

					var optsRetrieve = {
						uri: baseUrl + "/" + r._id,
						method: "GET"
					};

					request(optsRetrieve, function (ie, ir){

						ir._source.id = ir._id;

						return cb(null, ir._source);
					});
				}
			});
		},
		findOne: function (criteria, cb) {

			if (!criteria.id) {
				return cb("findOne requires id", null);
			}

			var url = baseUrl + "/" + criteria.id;

			var opts = {
				uri: url,
				method: "GET"
			};

			request(opts, function (e, r) {

				if(e){
					return cb(e, null);
				}else if(!r.found){
					return cb(null, {});
				}else{
					r._source.id = r._id;
					return cb(null, r._source);
				}
			});
		},
		update: function (criteria, obj, cb) {

			if(!is.type(criteria, "object") || !is.type(obj, "object") || !is.type(cb, "function")){
				throw new TypeError("Usage: (obj, obj, function)");
			}

			if (!criteria.id) {
				return cb("update requires id");
			}

			var url = baseUrl + "/" + criteria.id + "/_update";

			var optsUpdate = {
				uri: url,
				method: "POST",
				body: {
					doc: obj
				}
			};

			request(optsUpdate, function (e, r) {

				if(e){
					return cb(e, null);
				}else if(r.error){
					return cb(null, {});
				}else{

					var optsRetrieve = {
						uri: baseUrl + "/" + r._id,
						method: "GET"
					};

					request(optsRetrieve, function (ie, ir) {

						ir._source.id = ir._id;

						return cb(null, ir._source);
					});
				}
			});
		},
		del: function (criteria, cb) {

			if (!criteria.id) {
				return cb("update requires id");
			}
			var url = baseUrl + "/" + criteria.id;

			var optsRetrieve = {
				uri: url,
				method: "GET"
			};

			request(optsRetrieve, function (e, r) {

				if(e) {
					return cb(e, null);
				} else if (!r.found){
					return cb(null, {});
				} else {
					
					var optsDelete = {
						uri: url,
						method: "DELETE"
					};
					
					request(optsDelete, function (ie) {

						if (ie) {
							return cb(ie, null);
						} else {
							r._source.id = r._id;
							return cb(null, r._source);
						}
					});

				}

			});
		}
	};
}
