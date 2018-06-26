# Define import data

> **Note:** TypeScript files are only supported in Mongo Seeding Docker image and custom apps written in TypeScript, that uses Mongo Seeding library. For custom apps, include `ts` extension in supported files configuration.

## Creating directory structure

1. Create a new directory. In this example, it is named `data`. This is the root of data import.
1. Navigate to newly created directory.
1. To define MongoDB collections, create subdirectories. Follow the naming convention:
    - If you don't want to set the import order, name directories simply with collection names, for example `categories`, `posts`, `comments`, etc.
    - To keep custom import order, specify a number, one of supported separators (`-`, `_`, `.` or space) and actual collection name, for example `1-categories`, `2_posts`, `3.comments`, `4 tags`, etc.

    The collections will be created in database only if they don't exist.
1. In the collection directories, create JavaScript, JSON or, if supported, TypeScript files. The collection directory can contain multiple files. In every file, there can be single or multiple JavaScript objects. Single object represents single MongoDB document. Export an object or an array of objects in the following way:
    - For JavaScript files (`js` extension), use `module.exports = objectOrArray`.
    - For TypeScript files (`ts` extension), use `export = objectOrArray`.

    See examples in [Import Data Examples](#import-data-examples) section of this document.

## Import Data Examples
The following snippets represents different files in collection directories.

**TypeScript Examples**

    Importing the following file, `object.ts`, results in creating single MongoDB document:

    ```javascript
    export = {
      name: "Parrot"
    }
    ```

    The following file, `array.ts`, defines two MongoDB documents:

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

    **JavaScript Examples**

    Importing the following file, `object.js`, results in creating single MongoDB document:

    ```javascript
    module.exports = {
      name: "Parrot"
    }
    ```

    The following file, `array.js`, defines 2 documents to import:

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

    **JSON Examples**

    Importing the following file, `object.json`, results in creating single MongoDB document:

    ```json
    {
      "name": "Penguin",
    }
    ```

    The following file, `array.json`, defines 2 documents to import:

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

## Directory structure

The following example visualizes the file structure of import data:

    ```
    .
    ├── data
    │    ├── tsconfig.json // Optional for using TypeScript (see **Advanced features** section)
    │    ├── 1-categories
    │    │   ├── cat.js
    │    │   ├── dogs.js
    │    │   └── other-animals.json
    │    ├── 2-posts
    │    │   ├── post-about-my-cat.json
    │    │   ├── dog-posts.js
    │    │   └── random-stuff.ts
    │    └── 3-media
    │        ├── cat-image.ts
    │        └── dog.js
    ├── helpers // Optional for helper functions used in data import files
    └── models // Optional for type checking with TypeScript
    ```

## Helper functions

Helper functions are useful to avoid code duplication. For example, you can define import data as simple string array and use helper function to map them to a complex object (MongoDB document) with fixed or random properties. Consider the following file for importing categories (MongoDB documents):

```javascript
const { mapToEntities } = require("../../helpers/index")

const categories = ["Uncategorized", "Cats", "Dogs"];

module.exports = mapToEntities(categories);
```

With a simple string array, you can end up with complete entities for data import, using a helper function `mapToEntities`. This function should be defined in a different directory to avoid trying to import it. 
