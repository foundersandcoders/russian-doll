"use strict";

var test = require("tape");
var instantiate = require("..");
var request = require("../lib/request.js");
var is = require("torf");

var opts = {
	index: "index",
	type: "articles",
	host: process.env.ES_HOST,
	port: Number(process.env.ES_PORT)
};

var articles = instantiate(opts);

test("if not config", function (t){

	var wrongConfig = {};

	try {
		instantiate(wrongConfig);
		t.fail("test should not be executed");
	}catch(e){
		t.ok(e, "should throw error");
		t.end();
	}
});

test("NOT A TEST wipe db", function (t) {

	var opts = {
		method: "DELETE",
		uri: "http://127.0.0.1:9200/index/articles/"
	};
	request(opts, function () {

		t.end();
	});
});

test("instantiate should return an object", function (t) {

	t.equals(typeof articles, "object", "instantiate returns object");
	t.end();
});

test("object should have a create, findOne, update, delete and query methods", function (t) {

	["create", "findOne", "update", "del"].forEach(function(q) {

		t.ok(articles.hasOwnProperty(q), "object has " + q + " property");
	});

	t.end();
});

test("#create should create new entry in database", function (t) {

	var obj = {
		message: "yes",
		id: "1234"
	};

	articles.create(obj, function (e, r) {


		t.notOk(e, "no error received");
		t.deepEqual(r, obj, "object created");

		var opts = {
			method: "GET",
			uri: "http://127.0.0.1:9200/index/articles/1234"
		};
		request(opts, function (e, r) {

			t.ok(r.found, "object created");
			t.end();
		});
	});
});

test("#create should without id", function (t) {

	var obj = {
		name: "hello",
		message: "yes"
	};

	articles.create(obj, function (e, r) {

		t.notOk(e, "no error received");
		t.ok(r.id, "should have an id");
		t.end();
	});
});

test("#findOne should return match from database if there is one", function (t) {

	var obj = {id: "1234"};

	articles.findOne(obj, function (e, r) {

		console.log(r);

		t.notOk(e, "no error returned");
		t.equal(r.id, obj.id, "object found");
		t.end();
	});
});

test("#findOne should return empty object if no matches", function (t) {

	var obj = {id:8264};

	articles.findOne(obj, function (e, r) {

		t.notOk(e, "error not returned");
		t.ok(is.type(r, "object"), "object returned");
		t.notOk(is.ok(r), "empty object returned");
		t.end();
	});
});

test("#findOne should return err if no id", function (t) {

	var obj = {hid: 4321};

	articles.findOne(obj, function (e, r) {

		t.ok(e, "error returned");
		t.notOk(r, "no data passed to cb");
		t.end();
	});
});

test("#update should return err if no match in db", function (t) {

	var obj = {id: 4321};

	var changes = {name: "bob"};

	articles.update(obj, changes, function (e, r) {

		t.notOk(e, "error returned");
		t.ok(is.type(r, "object"), "object returned");
		t.notOk(is.ok(r), "empty object returned");
		t.end();
	});
});

test("#update should update entry in database", function (t) {

	var obj = {id: 1234};

	var changes = {name: "bob"};

	articles.update(obj, changes, function (e, r) {

		t.notOk(e, "error not returned");
		t.equals(r.message, "yes", "original properties still present");
		t.equals(r.name, changes.name, "name updated");
		t.end();
	});
});

test("#update should return err if no id", function (t) {

	var obj = {hid: 4321};

	var changes = {name:"bob"};

	articles.update(obj, changes, function (e, r) {

		t.notOk(r, "r is null");
		t.ok(e, "error returned");
		t.end();
	});
});

test("#del should not throw err if no match in db", function (t) {

	var obj = {id:4321};


	articles.del(obj, function (e, r) {

		t.notOk(e, "error not returned");
		t.ok(is.type(r, "object"), "object returned");
		t.notOk(is.ok(r), "empty object returned");
		t.end();
	});

});

test("#del should delete entry from database", function (t) {

	var obj = {id:"1234"};

	articles.del(obj, function (e, r) {

		t.notOk(e, "no error");
		t.ok(r, "record found");
		t.equals(r.id, obj.id, "record returned");
		t.end();
	});
});

test("#del should throw err if no id", function (t) {

	var obj = {hid: "23780459"};

	articles.del(obj, function (e, r){

		t.ok(e, "error returned");
		t.notOk(r, "no record returned");
		t.end();
	});
});

test("NOT A TEST wipe db", function (t) {

	var opts = {
		method: "DELETE",
		uri: "http://127.0.0.1:9200/index/articles/"
	};
	request(opts, function () {

		t.end();
	});
});


test("Error database connection", function (t){

	var opts = {
		index: "index",
		type: "articles",
		// no transport protocol
		host: "127.0.0.1",
		port: Number(process.env.ES_PORT)
	};

	var failArticles = instantiate(opts);

	t.test("should trigger error in CREATE record", function (st){

		var obj = {
			message: "yes",
			id: "1234"
		};

		failArticles.create(obj, function (e) {

			st.ok(e, "error received");
			st.end();
		});
	});

	t.test("should trigger error in UPDATE record", function (st){

		var obj = {
			message: "yes",
			id: "1234"
		};

		var changes = {};

		failArticles.update(obj, changes, function (e) {

			st.ok(e, "error received");
			st.end();
		});
	});

	t.test("should trigger error in UPDATE record", function (st){

		var obj = {
			message: "yes",
			id: "1234"
		};

		try{
			failArticles.update(obj, function () {

				st.fail("should not have been called");
			});
		}catch(e){
			st.ok(e, "should throw err");
			st.end();
		}
	});

	t.test("should trigger error in FINDONE record", function (st){

		var obj = {
			message: "yes",
			id: "1234"
		};

		failArticles.findOne(obj, function (e) {

			st.ok(e, "error received");
			st.end();
		});
	});

	t.test("should trigger error in DEL record", function (st){

		var obj = {
			id: "1234"
		};

		failArticles.del(obj, function (e) {

			st.ok(e, "error received");
			st.end();
		});
	});
});
































