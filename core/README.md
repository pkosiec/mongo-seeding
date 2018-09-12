![Mongo Seeding](https://raw.githubusercontent.com/pkosiec/mongo-seeding/master/docs/assets/logo.png)

# Mongo Seeding
[![npm version](https://badge.fury.io/js/mongo-seeding.svg)](https://npmjs.org/package/mongo-seeding) [![Build Status](https://travis-ci.org/pkosiec/mongo-seeding.svg?branch=master)](https://travis-ci.org/pkosiec/mongo-seeding) [![Codacy Badge](https://api.codacy.com/project/badge/Coverage/9960aeeba19d4992b0df8781cd580eec)](https://www.codacy.com/app/pkosiec/mongo-seeding?utm_source=github.com&utm_medium=referral&utm_content=pkosiec/mongo-seeding&utm_campaign=Badge_Coverage) [![Codacy Badge](https://api.codacy.com/project/badge/Grade/9960aeeba19d4992b0df8781cd580eec)](https://www.codacy.com/app/pkosiec/mongo-seeding?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=pkosiec/mongo-seeding&amp;utm_campaign=Badge_Grade) [![David](https://img.shields.io/david/pkosiec/mongo-seeding.svg?path=core)]() [![David](https://img.shields.io/david/dev/pkosiec/mongo-seeding.svg?path=core)]()

The ultimate solution for populating your MongoDB database. Define the data in JSON or JavaScript. Import collections and documents!

## Installation
To install the app, run the following command:

```bash
npm install mongo-seeding --save
```

## Usage

1. Follow the [tutorial](https://github.com/pkosiec/mongo-seeding/tree/master/docs/import-data-definition.md) to define documents and collections to import. See [`samples`](https://github.com/pkosiec/mongo-seeding/tree/master/samples) directory for examples.
1. Import the `seedDatabase` function:

    ```javascript
    const { seedDatabase } = require('mongo-seeding');
    ```

1. Define a partial configuration object. The object will be merged with the default config object (see [Configuration](#configuration) section). Therefore, you can specify only properties, which should override the default values, for example:

    ```javascript
    const path = require('path');

    const config = {
      database: {
        host: '127.0.0.1',
        port: 27017,
        name: 'mydatabase',
      },
      inputPath: path.resolve(__dirname, '../data'),
      dropDatabase: true,
    };
    ```

1. Seed your database:

  - with `async/await`, i.e.:

    ```javascript
    (async () => {
      try {
        await seedDatabase(config);
      } catch (err) {
        // Handle errors
      }
      // Do whatever you want after successful import
    })()    
    ```

  - with raw promises:
  
    ```javascript
    seedDatabase(config).then(() => {
      // Do whatever you want after successful import
    }).catch(err => {
      // Handle errors
    });
    ```

## Configuration

You can override any configuration property by passing partial config object to `seedDatabase` function. The object is merged with the default configuration object. You can pass `{}` to use all default settings.

In order to configure database connection, override needed properties of `database` object or specify `databaseConnectionUri`. The `database` object is ignored, if the `databaseConnectionUri` string is defined (e.g. `mongodb://127.0.0.1:27017/testing`).

**Default configuration object**:

```javascript
const config = {
  database: {
    protocol: 'mongodb',
    host: '127.0.0.1',
    port: 27017,
    name: 'database',
    username: undefined,
    password: undefined,
  },
  databaseConnectionUri: undefined, // if defined, it will be used for DB connection instead of `database` object
  dropCollection: false, // drops every collection that is being imported
  inputPath: resolve(__dirname, '../../data'), // input directory with import data structure
  dropDatabase: false, // drops database before import
  replaceIdWithUnderscoreId: false, // rewrites `id` property to `_id` for every document; useful for ORMs
  supportedExtensions: ['json', 'js'], // file extensions that should be read
  reconnectTimeoutInSeconds: 10, // maximum time of waiting for successful connection with MongoDB
};
```

## Debug output

In order to see debug output, set environmental variable `DEBUG` to value `mongo-seeding` before starting your Node.js app:

```bash
DEBUG=mongo-seeding node yourapp/index.js
```

You can also set it programmatically before requiring `mongo-seeding`:

```javascript
process.env.DEBUG = 'mongo-seeding';
const { seedDatabase } = require('mongo-seeding');
```
