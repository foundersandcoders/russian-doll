"use strict";

module.exports = instantiate;

var port = Number(process.env.ES_PORT);
var host = process.env.ES_HOST;
var request = require("./request.js");

function instantiate (index, type) {

  var baseUrl = host + ":" + port + "/" + index + "/" + type;

  return {
    create: function create (obj, cb) {

      var url = baseUrl;

      if (obj.id) {
        url += "/" + obj.id;
      }

      var opts = {
        uri: url,
        method: "POST",
        body: obj
      };

      request(opts, function (e, r) {

        if (r.error) {
          return cb(r);
        }
        return cb(e, r);
      });
    },
    findOne: function findOne (criteria, cb) {

      if (!criteria.id) {
        return cb("findOne requires id");
      }

      var url = baseUrl + "/" + criteria.id;

      var opts = {
        uri: url,
        method: "GET"
      };

      request(opts, function (e, r) {

       if (!r.found) {
          return cb("record not found");
        }
        return cb(e, r);
      });
    },
    update: function update (criteria, obj, cb) {

      if (!criteria.id) {
        return cb("update requires id");
      }

      var url = baseUrl + "/" + criteria.id + "/_update";

      var opts = {
        uri: url,
        method: "POST",
        body: {
          doc: obj
        }
      };

      request(opts, function (e, r) {

        if (r.error) {
          return cb(r);
        }
        return cb(e, r);
      });
    },
    del: function del (criteria, cb) {

      if (!criteria.id) {
        return cb("update requires id");
      }
      var url = baseUrl + "/" + criteria.id;

      var opts = {
        uri: url,
        method: "DELETE"
      };

      request(opts, function (e, r) {

        if (!r.found) {
          return cb("record not found");
        } else {
          return cb(e, r);
        }
      });
    }
  };
}
