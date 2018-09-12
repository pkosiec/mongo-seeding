# Import data definition
This tutorial will guide you how to define the data for seeding your MongoDB database.

## Creating directory structure

1. Create a new directory. In this example, it is named `data`. This is the root of data import.
1. Navigate to the newly created directory.
1. Create subdirectories. Every directory in `data` folder will represent single MongoDB collection. Follow the naming convention:
    - If you don't want to set the import order, name directories simply with collection name    for example `categories`, `posts`, `comments`, etc.
    - To keep custom import order, specify a number, one of supported separators (`-`, `_`    `.` or space) and actual collection name, for example `1-categories`, `2_posts`   `3.comments`, `4 tags`, etc.

    Every collection will be created in database only if it doesn't exist yet.
1. In a collection directory, create JSON, JavaScript or TypeScript file(s). The collection directory may contain multiple files with different extensions (`json`, `js` or `ts`). In every file, you can define single or multiple MongoDB documents. Single object represents one MongoDB document.

    In JavaScript and TypeScript files, you have to export an object or an array of objects in the following way:
    - In JavaScript files (`js` extension), use `module.exports = objectOrArray`.
    - In TypeScript files (`ts` extension), use `export = objectOrArray`.

    See examples in [Import Data Examples](#import-data-examples) section of this document.

> **Note:** TypeScript files are supported in Mongo Seeding CLI and Mongo Seeding Docker image. You can utilize static type checking in your custom app with Mongo Seeding library, but you have to include TypeScript runtime and then enable `ts` support in configuration.

## Import Data Examples

The following snippets are very basic examples of files with MongoDB document(s) definition.

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

The following example visualizes the possible file structure of import data:

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

You can use different file extensions, as long as they are supported.

## JavaScript benefits
Instead of using JSON files, the recommended way is to define the import data in JavaScript ones. You can use there all the benefits of JavaScript.

### Saving time
For example, let's define 10 entities in JSON file for `person` collection. The result looks like this:

```json
[
    {
        "name": "John",
        "email": "example@example.com",
        "avatar": "https://placekitten.com/300/300"
    },
    {
        "name": "Joanne",
        "email": "example@example.com",
        "avatar": "https://placekitten.com/300/300"
    },
    {
        "name": "Bob",
        "email": "example@example.com",
        "avatar": "https://placekitten.com/300/300"
    },
    {
        "name": "Will",
        "email": "example@example.com",
        "avatar": "https://placekitten.com/300/300"
    },
    {
        "name": "Chris",
        "email": "example@example.com",
        "avatar": "https://placekitten.com/300/300"
    },
    {
        "name": "Mike",
        "email": "example@example.com",
        "avatar": "https://placekitten.com/300/300"
    },
    {
        "name": "Anna",
        "email": "example@example.com",
        "avatar": "https://placekitten.com/300/300"
    },
    {
        "name": "Jack",
        "email": "example@example.com",
        "avatar": "https://placekitten.com/300/300"
    },
    {
        "name": "Peter",
        "email": "example@example.com",
        "avatar": "https://placekitten.com/300/300"
    },
    {
        "name": "Paul",
        "email": "example@example.com",
        "avatar": "https://placekitten.com/300/300"
    }
]
```

That doesn't look good - you did probably hear about [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) principle. Also, it makes further modifications much harder - especially the ones that results in data shape change. Using JavaScript to define the authors documents means that you saves your time. You can easily shorten the example above to this snippet:

```javascript
const names = ["John", "Joanne", "Bob", "Will", "Chris", "Mike", "Anna", "Jack", "Peter", "Paul"];

module.exports = names.map(name => ({
    name,
    email: "example@example.com",
    avatar: "https://placekitten.com/300/300",
}))
```

### Using imports
Obviously, in JavaScript files you can also import other files - external libraries, helper methods etc. It's also easy to write some data randomization rules - which are mostly essential for creating development sample data. Consider the following example of `people` collection import:

```javascript
const { getObjectId } = require("../../helpers/index");

const names = ["John", "Joanne", "Bob", "Will", "Chris", "Mike", "Anna", "Jack", "Peter", "Paul"];

const min = 18;
const max = 100;

module.exports = names.map(name => ({
    firstName: name,
    age: Math.floor(Math.random() * (max - min + 1)) + min,
    _id: getObjectId(name),
}))
```

Yes, it works! Remember to define helpers in other directory that the one with import data! We don't want to try importing them, right?

## TypeScript benefit: Static type checking

In multiple JSON and JavaScript files which contains MongoDB documents definition, it's easy to make a mistake, especially in complex data structure. Sometimes a typo results in invalid data. See the example below for `people` collection definition:

```json
[
    {
        "name": "John",
        "email": "john@mail.de",
        "age": 18,
    },
    {
        "name": "Bob",
        "emial": "bob@example.com",
        "age": "none",
    },
]
```

Because of a typo, Bob has `email` field empty. Also, there is a non-number value for `age` key.
With TypeScript, the situation changes completely. See the example below:

```javascript
export interface Person {
  name: string;
  email: string;
  age: number;
}
```

```javascript
// Import interface defined above
import { Person } from '../../models/index';

const people: Person[] = [
    {
        name: "John",
        email: "john@mail.de",
        age: 18,
    },
    {
        name: "Bob",
        emial: "bob@example.com", // <-- error underlined in IDE
        age: "none", //  <-- error underlined in IDE
    },
];

export = people;
```

With using TypeScript, you instantly see in your IDE that you made mistakes.

The Mongo Seeding CLI and Mongo Seeding Docker Image have TypeScript runtime built-in. It means that you can take advantage of static type checking in TypeScript data definition files (`.ts` extension). You can also use Mongo Seeding library in your projects along with TypeScript runtime and enable importing TS files as well.

Remember to define models in other directory that the one with import data! We don't want to try importing them, right?
