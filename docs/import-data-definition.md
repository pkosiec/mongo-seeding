# Import data definition guide

This guide describes how to define the data for seeding your MongoDB database.

## Create proper directory structure

1. Create a new directory. In this tutorial, it is named `data`. This is the root of data import.
1. Navigate to the newly created directory.
1. Create subdirectories. Every directory in `data` folder will represent single MongoDB collection. Follow the naming convention:
    - If you don't want to set the import order, name directories simply with collection name    for example `categories`, `posts`, `comments`, etc.
    - To keep custom import order, specify a number, one of supported separators (`-`, `_`    `.` or space) and actual collection name, for example `1-categories`, `2_posts`   `3.comments`, `4 tags`, etc.

    Every collection will be created in database only if it doesn't exist yet.
1. In a collection directory, create JSON, JavaScript or TypeScript file(s). The collection directory may contain multiple files with different extensions (`json`, `js` or `ts`). In every file, you can define single or multiple MongoDB documents. Single object represents one MongoDB document.

    - In JavaScript files (`js` extension), use `module.exports = objectOrArray`.

        **Single object**

        ```javascript
        module.exports = {
            name: "Parrot"
        }
        ```

        **Array of objects**

        ```javascript
        module.exports = [
            {
                name: "Dog"
            },
            {
                name: "Cat"
            }
        ]
        ```

    - In TypeScript files (`ts` extension), use `export = objectOrArray`.

        **Single object**

        ```javascript
        export = {
            name: "Parrot"
        }
        ```
        **Array of objects**

        ```javascript
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
            "name": "Penguin",
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

Instead of using JSON files, the recommended way is to define the import data in JavaScript ones. You can use there all the benefits of JavaScript, like external library import or your own helper functions. Remember to define helpers in other directory that the one with import data! We don't want to try importing them, right?

Even better is to use TypeScript. You have the ability to validate import data models for free. But, remember to define models in other directory that the one with import data.

To read more about JavaScript and TypeScript benefits, see the [Motivation](../README.md#motivation) paragraph in the main Readme document.

## See examples

To see complete, ready to import sample data, navigate to [Examples](../examples) directory.