# russian-doll
database adapter prototype for CRUD operations


**use**
```js

var config = {
  index: "blog",   // elasticsearch index
  type: "articles" // elasticsearch type
};

// instantiate interface with index and type
var db = require("russian-doll")("index", "type");

db
  .create({
    name: "Sirloin",
    age: 49,
    birthday: 12/02/1992
  }, function (err, res) {

    //... do stuff

  });


db
  .findOne({ id: 1234 }, function (err, res) {

    //... do stuff

  });


db
  .update({ id: 1234 }, { age: 50 }, function (err, res) {

    //... do stuff

  });

db
  .delete({
    id: 1234
  }, function (err, res) {

    //... do stuff

  });

db
  .query("raw query", function (err, res) {

    //... do stuff

  });

```




## api

russian-doll exposes a single function that returns a DB adapter object:

### instantiate(config)

**_params_**

```config```: a config object with the following properties:

```
{
  index: "index", // the elasticsearch index for the db adapter to us
  type: "type"    // the elasticsearch type for the db adapter to use
}
```

**_returns_**

a db adapter object with the methods ```.create```, ```.findOne```, ```.update```, ```.delete```, and ```.query```.


### db.create(document, cb)

**_params_**

```document```: an object to be inserted to the db

```cb(err, res)```: a function to be executed when the db responds. ```err``` will contain information about any error (or null otherwise). ```res``` will contain an object with the status of the transaction.


### db.findOne(criteria, cb)

**_params_**

```criteria```: an object of criteria to search for matches in db

```cb(err, res)```: a function to be executed when the db responds. ```err``` will contain information about any error (or null otherwise). ```res``` will contain an object with the status of the transaction.


### db.update(criteria, changes, cb)

**_params_**

```criteria```: an object of criteria to search for matches in db

```changes```: an object of changes to update the matched document with

```cb(err, res)```: a function to be executed when the db responds. ```err``` will contain information about any error (or null otherwise). ```res``` will contain an object with the status of the transaction.


### db.delete(criteria, cb)

**_params_**

```criteria```: an object of criteria to search for matches in db

```cb(err, res)```: a function to be executed when the db responds. ```err``` will contain information about any error (or null otherwise). ```res``` will contain an object with the status of the transaction.


### db.query(rawQuery, cb)

**_params_**

```rawQuery```: a string containing the raw query to send to the db

```cb(err, res)```: a function to be executed when the db responds. ```err``` will contain information about any error (or null otherwise). ```res``` will contain an object with the status of the transaction.

## license

MIT
