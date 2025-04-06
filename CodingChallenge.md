Code Challenge (node):

# Refactor

**For this coding challenge, use any library / module as you like. Treat it as a real-life dev scenario. We would like to see how do you solve a real-life problem).**

## Original requirement

Suppose we need a program for an access door that:

- check if a person is allowed to enter.
- if not allowed, throw an appropriate error.
- if allowed, add a log record in database.

The current access rule is:

- if the request has an id, and: \* if a person has name "Joe", the person is allowed to enter. This name may change frequently.

## Refactoring

Given the [current version of code]() commited **in the codebase** and [database schema]() that defines an express.js endpoint, and coding style defined in [file1](https://gist.github.com/Jarvie8176/dc9007aebc7de883cc06c3d99fc3b186), [file2](https://gist.github.com/Jarvie8176/9fb09bbd1f71363a92f315b6455c6a81), [file3](https://gist.github.com/Jarvie8176/9f0d19aeeea36b42f318b00c443d0b87):
[If you have trouble accessing these files, zips are attached]

1. refactor it so that it is:
   _ readable
   _ testable
   _ formatted with the coding style as defined
   _ written in ES6 or above
   _ uses async / await, if appropriate
   _ has error checking and logging, if appropriate \* has no hard-coded logic or variables
2. write test cases using a test framework. We use Jest but you may choose any framework you like. We want to see how you test the code (e.g. what would you test against, how do you tell the code is well-tested)

## New Requirement

Suppose the access rule is change to:

- if the request has an id, and:
  _ if a person has name "Joe" (which may change frequently), the person is allowed; or:
  _ if a person has an valid access code stored in database, the person is allowed

Refactor the code and database schema to support this new rule.

## Existing Code

### accessDoor.js

```javascript
var db = require("pg");

var testDatabase = {
    user: "user",
    password: "password",
    host: "localhost",
    database: "staging",
    port: 5432,
};

let stagingDatabase = {
    user: "user",
    password: "password",
    host: "localhost",
    database: "staging",
    port: 5432,
};

var productionDatabase = {
    user: "user",
    password: "password",
    host: "localhost",
    database: "staging",
    port: 5432,
};

PROCEED = undefined;

function accessDoor(req, res) {
    var validation = true;
    const allowedName = "Joe"; // this can be changed when
    function validate() {
        if (req.params.id == true) {
            // must have id in request
            validation = true;
        } else {
            validation = false;
        }

        if (req.params.name != allowedName) validation = false;

        PROCEED = validation;
    }

    validate();

    if (PROCEED == true) {
        var a;
        if (process.env.NODE_ENV == "local") {
            a = new db.Client(testDatabase);
        }

        if (process.env.NODE_ENV == "staging") {
            a = new db.Client(stagingDatabase);
        }
        if (process.env.NODE_ENV == "production") {
            a = new db.Client(productionDatabase);
        }

        a.query("insert into entry_history values(" + req.params.id + "," + new Date() + ")");

        res.send();
    } else {
        throw new Error();
    }
}

module.exports = accessDoor;
```

### db.sql

```sql
create table entry_history (
        id integer,
        entered_at timestamp with timezone
);
```

## Criteria

The solution should:

- fix code formatting.
- fix the use of global variable `PROCEED`.
- fix unnecessarily complicated validation logic.
- throw meaningful error (no `throw new Error()` with no error message).
- replace `var` with `let` or `const` appropriately.
- replace `!=` with `!==` appropriately.
- fix the problem that each request creates a db connection (e.g. use connection pool).
- fix the bug that `res.send()` is called before query resolves.

The solution may:

- export a json object instead of a function.
- load configurations from an external file or environment variables (i.e. not saved in the code).
- make `allowedName` configurable.
-
