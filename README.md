# Mongo Seeding
Fill your MongoDB database with data in an easy way. Use JSON and JavaScript files to define the data!

[![Open Source Love](https://badges.frapsoft.com/os/mit/mit.svg?v=102)](https://github.com/ellerbrock/open-source-badge/)

### Install
```bash
npm install mongo-seeding --save
```

### Usage
Coming soon

Alright, how does it work? It's pretty simple - you have to provide a directory with data files in proper structure. 

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

    Take a look at samples to see elastic-mongodb-seed in action!
