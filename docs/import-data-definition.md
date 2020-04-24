# Import data definition guide

This guide describes how to define the data for seeding your MongoDB database.

## Create proper directory structure

1. Create a new directory for your data. In this tutorial, it is named simply as `data`.
1. Navigate to the newly created directory.
1. Create subdirectories. Every directory in `data` folder represents a single MongoDB collection.

   - If you don't want to set the import order, put collection name in the directory name, e.g. `categories`, `posts`, `comments`, etc.
   - To define a custom import order, follow the directory naming convention: `{order-number}{separator}{collection-name}`, for example `1-categories`, `2_posts` `3.comments`, `4 tags`, etc. Supported separators are the following characters: `-`, `_`, `.` and space.
   - Collection is created in database if it contains at least one MongoDB Document definition.
   - If you mix two approaches: unordered and ordered import, collections with unspecified import order number are always imported last.

1. Create JSON, JavaScript or TypeScript files in every directory that represents MongoDB collection. The collection directory can contain multiple files with different extensions (`json`, `js`, 'cjs', or `ts`). In these files export single object or array of objects. Every object represents one MongoDB document.

   - In JavaScript files (`js` extension), use `module.exports = objectOrArray`.

     **Single object**

     ```javascript
     module.exports = {
       name: 'Parrot',
     };
     ```

     **Array of objects**

     ```javascript
     module.exports = [
       {
         name: 'Dog',
       },
       {
         name: 'Cat',
       },
     ];
     ```

   - In TypeScript files (`ts` extension), use `export = objectOrArray`.

     **Single object**

     ```typescript
     export = {
         name: "Parrot"
     }
     ```

     **Array of objects**

     ```typescript
     export = [
         {
             name: "Dog"
         },
         {
             name: "Cat"
         }
     ]
     ```

     > **Note:** TypeScript files are supported in Mongo Seeding CLI and Mongo Seeding Docker image. You can utilize static type checking in your custom app with Mongo Seeding library, but you have to include TypeScript runtime and then enable `ts` support in configuration.

   - In JSON files (`json` extension), define single objects or array of objects. [Extended JSON](https://docs.mongodb.com/manual/reference/mongodb-extended-json) syntax is also supported.

     **Single object**

     ```json
     {
       "name": "Penguin"
     }
     ```

     **Array of objects**

     ```json
     [
       {
         "name": "Hamster"
       },
       {
         "name": "Crocodile"
       }
     ]
     ```

1. The following example visualizes the complete file structure of import data:

   ```
   .
   ├── data // Root directory
   │    ├── 1-categories // `categories` collection
   │    │   ├── cat.js
   │    │   ├── dogs.js
   │    │   └── other-animals.json
   │    ├── 2-posts // `posts` collection
   │    │   ├── post-about-my-cat.json
   │    │   ├── dog-posts.js
   │    │   └── random-stuff.ts
   │    └── 3-media // `media` collection
   │        ├── cat-image.ts
   │        └── dog.js
   ```

## Use TypeScript or JavaScript over JSON data definition

Instead of using JSON files, the recommended way is to define the import data in JavaScript ones. In this approach you can use all the benefits of JavaScript, like external library import or your own helper functions. Remember to define helpers in other directory that the one with import data! We don't want to try importing them, right?

Even better is to use TypeScript. You gain the static validation of import data models. Remember to define models in other directory that the one with import data.

To read more about JavaScript and TypeScript benefits, see the [Motivation](../README.md#motivation) paragraph in the main Readme document.

## See examples

To see complete, ready to import sample data, navigate to [Examples](../examples) directory.
