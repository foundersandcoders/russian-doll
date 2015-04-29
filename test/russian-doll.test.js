"use strict";

var test = require("tape");
var instantiate = require("..");
var request = require("../lib/request.js");

var opts = {
  index: "index",
  type: "articles",
  host: process.env.ES_HOST,
  port: Number(process.env.ES_PORT)
};

var articles = instantiate(opts);


test("wipe db", function (t) {

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

  articles.create({
    name: "hello",
    message: "yes",
    id: 1234
  }, function (e, r) {

    t.notOk(e, "no error received");
    t.ok(r.created, "object created");

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

test("#create should with id", function (t) {

  articles.create({
    name: "hello",
    message: "yes",
  }, function (e, r) {

    t.notOk(e, "no error received");
    t.ok(r.created, "object created");
    var opts = {
      method: "GET",
      uri: "http://127.0.0.1:9200/index/articles/" + r._id
    };
    request(opts, function (e, r) {

      t.ok(r.found, "object created");
      t.end();
    });
  });
});



test("#findOne should return match from database if there is one", function (t) {

  articles.findOne({
    id: 1234
  }, function (e, r) {

    t.notOk(e, "no error returned");
    t.ok(r.found, "object found");
    t.ok(r._source.name, "hello", "correct obj returned");
    t.end();
  });
});

test("#findOne should return err if no matches", function (t) {


  articles.findOne({
    id: 4321
  }, function (e, r) {

    t.ok(e, "error returned");
    t.notOk(r, "no data passed to cb");
    t.end();
  });
});

test("#findOne should return err if no id", function (t) {


  articles.findOne({
    hid: 4321
  }, function (e, r) {

    t.ok(e, "error returned");
    t.notOk(r, "no data passed to cb");
    t.end();
  });
});



test("#update should update entry in database", function (t) {


  articles.update({
    id: 1234
  }, {
    name: "bob"
  }, function (e) {

    t.notOk(e, "error not returned");

    var opts = {
      method: "GET",
      uri: "http://127.0.0.1:9200/index/articles/1234"
    };
    request(opts, function (e, r) {

      t.ok(r.found, "object created");
      t.equals(r._source.name, "bob", "object updated");
      t.equals(r._source.message, "yes", "original object properties not destroyed");
      t.end();
    });

  });

});

test("#update should return err if no match in db", function (t) {

  articles.update({
    id: 4321
  }, {
    name: "bob"
  }, function (e) {

    t.ok(e, "error returned");
    t.end();
  });

});

test("#update should return err if no id", function (t) {

  articles.update({
    hid: 4321
  }, {
    name: "bob"
  }, function (e) {

    t.ok(e, "error returned");
    t.end();
  });

});

test("#del should delete entry from database", function (t) {

  articles.del({
    id: 1234
  }, function (e, r) {

    t.ok(r.found, "record found");
    t.notOk(e, "error not returned");

    var opts = {
      method: "GET",
      uri: "http://127.0.0.1:9200/index/articles/1234"
    };
    request(opts, function (e, r) {
      t.notOk(r.found, "object deleted");
      t.end();
    });
  });
});

test("#del should throw err if no match in db", function (t) {

  articles.del({
    id: 1234
  }, function (e) {

    t.ok(e, "error returned");
    t.end();
  });

});

test("#del should throw err if no id", function (t) {

  articles.del({
    hid: 1234
  }, function (e) {

    t.ok(e, "error returned");
    t.end();
  });

});


test("wipe db", function (t) {

  var opts = {
    method: "DELETE",
    uri: "http://127.0.0.1:9200/index/articles/"
  };
  request(opts, function () {

    t.end();
  });

});
