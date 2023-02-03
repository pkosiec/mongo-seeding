![Mongo Seeding](https://raw.githubusercontent.com/pkosiec/mongo-seeding/main/docs/assets/logo.png)

# Mongo Seeding

[![npm version](https://badge.fury.io/js/mongo-seeding.svg)](https://npmjs.org/package/mongo-seeding) [![Build Status](https://github.com/pkosiec/mongo-seeding/actions/workflows/branch.yaml/badge.svg)](https://github.com/pkosiec/mongo-seeding/actions) [![codecov](https://codecov.io/gh/pkosiec/mongo-seeding/branch/main/graph/badge.svg?flag=core)](https://codecov.io/gh/pkosiec/mongo-seeding) [![David](https://img.shields.io/david/pkosiec/mongo-seeding.svg?path=core)]() [![David](https://img.shields.io/david/dev/pkosiec/mongo-seeding.svg?path=core)]() [![install size](https://packagephobia.now.sh/badge?p=mongo-seeding)](https://packagephobia.now.sh/result?p=mongo-seeding)

The ultimate solution for populating your MongoDB database. Define the data in JavaScript or JSON files. Import collections and documents!

## Table of contents

<!-- toc -->

- [Installation](#installation)
- [Usage](#usage)
- [API description](#api-description)
  - [`constructor(partialConfig?)`](#constructorpartialconfig)
  - [`readCollectionsFromPath(path, partialOptions?)`](#readcollectionsfrompathpath-partialoptions)
  - [`import(collections, partialConfig?)`](#importcollections-partialconfig)
- [Debug output](#debug-output)

<!-- tocstop -->

## Installation

To install the app, run the following command:

```bash
npm install mongo-seeding --save
```

## Usage

1.  Import the `Seeder` class:

    ```javascript
    const { Seeder } = require('mongo-seeding');
    ```

1.  Define a partial configuration object. The object will be merged with the default config object (see [Configuration](#configuration) section). Therefore, you can specify only properties, which should override the default values, for example:

    ```javascript
    const config = {
      database: {
        host: '127.0.0.1',
        port: 27017,
        name: 'mydatabase',
      },
      dropDatabase: true,
    };
    ```

    Instead of database configuration object, you can also provide database connection URI to the `database` property:

    ```javascript
    const config = {
      database: 'mongodb://127.0.0.1:27017/mydatabase',
      dropDatabase: true,
    };
    ```

1.  Instantiate `Seeder` class:

    ```javascript
    const seeder = new Seeder(config);
    ```

1.  **(OPTIONAL)** To read MongoDB collections from disk, firstly follow the [tutorial](https://github.com/pkosiec/mongo-seeding/blob/main/docs/import-data-definition.md) in order to define documents and collections to import. Next, read them using `readCollectionsFromPath` method:

    ```javascript
    const path = require('path');
    const collections = seeder.readCollectionsFromPath(
      path.resolve('./your/path'),
    );
    ```

1.  Seed your database:

    - with `async/await`, for example:

      ```javascript
      try {
        await seeder.import(collections);
      } catch (err) {
        // Handle errors
      }
      // Do whatever you want after successful import
      ```

    - with raw promises:

      ```javascript
      seeder
        .import(collections)
        .then(() => {
          // Do whatever you want after successful import
        })
        .catch((err) => {
          // Handle errors
        });
      ```

See an [**import data example**](https://github.com/pkosiec/mongo-seeding/blob/main/examples/import-data) for a sample Node.js application utilizing the library.

## API description

The `Seeder` class contains the following methods.

### `constructor(partialConfig?)`

Constructs a new `Seeder` instance and loads configuration for data import.

**Configuration**

You can override any default configuration property by passing partial config object to the `Seeder` constructor. The object is merged with the default configuration object. To use all default settings, simply omit the constructor argument (`new Seeder()`).

The following snippet represents the type definition of `Seeder` config with all available properties:

```typescript
/**
 * Defines configuration for database seeding.
 */
export interface SeederConfig {
  /**
   * Database connection URI or configuration object.
   */
  database: SeederDatabaseConfig;
  /**
   * Maximum time of waiting for successful MongoDB connection in milliseconds. Ignored when `mongoClientOptions` are passed.
   */
  databaseReconnectTimeout: number;
  /**
   * Drops entire database before import.
   */
  dropDatabase: boolean;
  /**
   * Drops collection before importing it.
   */
  dropCollections: boolean;
  /**
   * Deletes all documents from every collection that is being imported.
   */
  removeAllDocuments: boolean;
  /**
   * Optional MongoDB client options.
   */
  mongoClientOptions?: MongoClientOptions;
  /**
   * Optional MongoDB collection write options.
   */
  bulkWriteOptions?: BulkWriteOptions;
}

export interface SeederDatabaseConfigObject {
  protocol: string;
  host: string;
  port: number;
  name: string;
  username?: string;
  password?: string;
  options?: SeederDatabaseConfigObjectOptions; // see all options for Database Connection URI: https://docs.mongodb.com/manual/reference/connection-string
}

export type SeederDatabaseConfigObjectOptions = {
  [key: string]: string;
};
```

In order to configure database connection, specify connection URI for `database` property or assign a partial `SeederDatabaseConfigObject` object, overriding necessary properties.

**Default configuration**:

The default configuration object is as follows:

```javascript
const defaultConfig = {
  database: {
    protocol: 'mongodb',
    host: '127.0.0.1',
    port: 27017,
    name: 'database',
    username: undefined,
    password: undefined,
  },
  databaseReconnectTimeout: 10000,
  dropDatabase: false,
  dropCollections: false,
  mongoClientOptions: undefined,
  bulkWriteOptions: undefined,
};
```

### `readCollectionsFromPath(path, partialOptions?)`

Populates collections and their documents from given path. The path has to contain import data structure described [here](https://github.com/pkosiec/mongo-seeding/blob/main/docs/import-data-definition.md).

**Options**

You can specify an optional partial options object for this method, which will be merged with default configuration object. See the interface of the options, which describes all possible options:

```typescript
/**
 * Defines collection reading configuration.
 */
export interface SeederCollectionReadingOptions {
  /**
   * Files extensions that should be imported
   */
  extensions: string[];

  /**
   * Options for parsing EJSON files with `.json` extension
   */
  ejsonParseOptions?: EJSONOptions;

  /**
   * Optional transformer functions that can be used to modify collection data before import.
   */
  transformers: ((collection: SeederCollection) => SeederCollection)[];
}
```

For example, you may provide the following options object:

```typescript
const collectionReadingOptions = {
  extensions: ['ts', 'js', 'cjs', 'json'],
  ejsonParseOptions: {
    relaxed: false,
  },
  transformers: [Seeder.Transformers.replaceDocumentIdWithUnderscoreId],
};

const collections = seeder.readCollectionsFromPath(
  path.resolve('./your/path'),
  collectionReadingOptions,
);
```

Transform function is a simple function in a form of `(collection: SeederCollection) => SeederCollection`. It means that you can manipulate collections after reading them from disk. `SeederCollection` is defined as follows:

```typescript
interface SeederCollection {
  name: string;
  documents: object[];
}
```

There is two built-in transform functions:

- **`Seeder.Transformers.replaceDocumentIdWithUnderscoreId`**, which replaces `id` field with `_id` property for every document in collection.

- **`Seeder.Transformers.setTimestamps`**, which sets `createdAt` and `updatedAt` timestamps for every document in collection.

**Default options**

The default options object is as follows:

```typescript
const defaultCollectionReadingConfig: SeederCollectionReadingConfig = {
  extensions: ['json', 'js', 'cjs'],
  ejsonParseOptions: {
    relaxed: true,
  },
  transformers: [],
};
```

### `import(collections, partialConfig?)`

This method connects to a database and imports all provided collections. `collections` argument type is an array of `SeederCollection` type, which is defined as follows:

```typescript
interface SeederCollection {
  name: string;
  documents: object[];
}
```

**Configuration**

You can provide additional `partialConfig` argument in a form of `Seeder` partial configuration object - the same used in the constructor. It is an easy way to change the configuration for one single data import. The configuration object will be merged with provided configuration from constructor and default config.

## Debug output

In order to see debug output, set environmental variable `DEBUG` to value `mongo-seeding` before starting your Node.js app:

```bash
DEBUG=mongo-seeding node yourapp/index.js
```

You can also set it programmatically before requiring `mongo-seeding`:

```javascript
process.env.DEBUG = 'mongo-seeding';
const { Seeder } = require('mongo-seeding');
```
