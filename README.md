# Mongo Seeding
Fill your MongoDB database with data in easy way. Use JavaScript and JSON files to define the data!

[![npm](https://img.shields.io/npm/v/mongo-seeding.svg)](https://www.npmjs.com/package/mongo-seeding) [![Open Source Love](https://badges.frapsoft.com/os/mit/mit.svg?v=102)](https://github.com/ellerbrock/open-source-badge/)

**If this is not what are you looking for...**
- Searching for a command line tool? Use [Mongo Seeding CLI](https://github.com/pkosiec/mongo-seeding-cli)!
- Looking for Docker image? Try [Mongo Seeding Docker Image](https://github.com/pkosiec/mongo-seeding-image)! It brings also additional TypeScript support!


### Install
```bash
npm install mongo-seeding --save
```

### Usage
```javascript
const { seedDatabase } = require('mongo-seeding');
const path = require('path');

// Define configuration object
const config = {
  database: {
    host: '127.0.0.1',
    port: 27017,
    name: 'mydatabase',
  },
  dataPath: path.resolve(__dirname, '../data'),
  dropDatabase: true,
};

// Use it!
seedDatabase(config);
```

**You don't have to provide all parameters**.The configuration you'll provide as a parameter of `seedDatabase` method will be merged with default configuration object.

Default configuration object:

```javascript
const config = {
  database: {
    protocol: 'mongodb',
    host: '127.0.0.1',
    port: 27017,
    name: 'database',
  },
  dataPath: path.resolve(__dirname, '../data'),
  dropDatabase: false,
  replaceIdWithUnderscoreId: false,
  supportedExtensions: ['json', 'js'],
  reconnectTimeout: 2000,
};
```

You can overwrite any field you want.

### Debug output
To see debug output just set environmental variable `DEBUG` to `mongo-seeding` before starting your Node.js app:

```bash
DEBUG=mongo-seeding node yourapp/index.js
```

or programmatically before requiring `mongo-seeding`:

```javascript
process.env.DEBUG = 'mongo-seeding';
const { seedDatabase } = require('mongo-seeding');
```

### Prepare your data to import

1. Create a new directory. In this example, name it simply as `data`.
1. This directory `data` will contain subdirectories in following naming convention: `$NUMBER-$COLLECTION_NAME` - i.e. `1-categories`, `2-posts`.

    `$COLLECTION_NAME` - it's just a collection name that will be created if not exist.

    `$NUMBER` - to define collections import order.  If you don't care about import order - just name the directory as `$COLLECTION_NAME`, i.e. `categories`.   

1. In every collection directory you can create multiple files in formats: `.js` and `.json`. You can define object or array of objects.

    For JS files: Export object or array of objects you want to import via `module.exports = objectOrArray`

    Every object is a representation of document in MongoDB database.

1. The whole file structure should look like this:

    ```
    data
    +-- tsconfig.json // Optional for using TypeScript (see Advanced )
    +-- 1-categories
    |   +-- cat.js
    |   +-- dogs.js
    |   +-- other-animals.json
    +-- 2-posts
    |   +-- post-about-my-cat.json
    |   +-- dog-posts.js
    |   +-- random-stuff.js
    +-- 3-media
    |   +-- cat-image.js
    |   +-- dog.js
    ```

 ### Samples
 Take a look at [samples repository](https://github.com/pkosiec/mongo-seeding-samples) to see Mongo Seeding in action! 
