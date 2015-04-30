"use strict";

var map = require("../lib/map.js");
var test = require("tape");

test("Map function", function (t){

	t.test("should return query string", function (st){

		var obj = {
			name: "Will"
		};

		var string = map(obj);

		st.equals(string, "?q=name:Will", "right string");
		st.end();
	});
	t.test("should return a query string given large obj", function (st){

		var obj = {
			name: "Will",
			age: 22,
			county: "London",
			job: "pizza chef"
		};

		var string = map(obj);

		st.equals(string, "?q=name:Will AND age:22 AND county:London AND job:pizza chef");
		st.end();
	});

  t.test("should return a query string given large obj", function (st){

    var prot = {dog:true};

    var obj = Object.create(prot);
    obj.name = "Will";
    obj.age = 22;
    obj.county = "London";
    obj.job = "pizza chef";

		var string = map(obj);

		st.equals(string, "?q=name:Will AND age:22 AND county:London AND job:pizza chef");
		st.end();
	});
});
