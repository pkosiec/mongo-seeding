![Mongo Seeding](https://raw.githubusercontent.com/pkosiec/mongo-seeding/master/docs/assets/logo.png)

# Mongo Seeding

[![GitHub version](https://badge.fury.io/gh/pkosiec%2Fmongo-seeding.svg)](https://badge.fury.io/gh/pkosiec%2Fmongo-seeding) [![Build Status](https://travis-ci.org/pkosiec/mongo-seeding.svg?branch=master)](https://travis-ci.org/pkosiec/mongo-seeding) [![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://lbesson.mit-license.org/)

The ultimate solution for populating your MongoDB database :rocket: 

Define MongoDB documents in JSON, JavaScript or even TypeScript file(s). Use JS library, install CLI or run Docker image to import them!

> **Note:** Currently the docs are referring to unreleased version 3.0.0, that is coming very soon. If you want to see docs for previous stable version, [click here](https://github.com/pkosiec/mongo-seeding/tree/v2.2.0). 

## Introduction

Mongo Seeding is a flexible set of tools for importing data into MongoDB database. 

It's great for:
- testing database queries, automatically or manually
- preparing ready-to-go development environment for your application
- setting initial state for your application

## How does it work?

1. Define documents for MongoDB import in JSON, JavaScript or TypeScript file(s). Read the **[tutorial](./docs/import-data-definition.md)** to learn, how to do that. To see some examples, how to do that, navigate to the **[`samples`](./samples)** directory.

1. Use one of the Mongo Seeding tools, depending on your needs:

    - [JavaScript library with friendly API](./core)
    - [Command line interface (CLI)](./cli)
    - [Docker image](./docker-image)

1. ???
1. Profit!

## Motivation

There are many tools for MongoDB data import out there, including the official one - `mongoimport`. Why should you choose Mongo Seeding?

### Problem #1: JSON used for import data definition

Every tool I found before creating Mongo Seeding support only JSON files. In my opinion, that is not the most convenient way of data definition. The biggest problems are data redundancy and lack of ability to write logic.

Imagine that you want to import 10 very similar documents into `authors` collection. Every document is identical - except the name:

```json
{
    "name": "{NAME_HERE}",
    "email": "example@example.com",
    "avatar": "https://placekitten.com/300/300"
}
```

With every tool I've ever found, you would need to create 10 separate JSON files, or one file with array of objects. Of course, the latter option is better, but anyway you end up with a file looking like this:

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

That doesn't look good - you did probably hear about [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) principle.

Imagine that now you have to change authors' email. You would probably use search and replace. But what if you would need change the data shape completely? This time you can also use IDE features like multiple cursors etc., but hey - it's a waste of time. What if you had a much more complicated data shape?

If you could use JavaScript to define the authors documents, it would be much easier and faster to write something like this:

```javascript
const names = ["John", "Joanne", "Bob", "Will", "Chris", "Mike", "Anna", "Jack", "Peter", "Paul"];

module.exports = names.map(name => ({
    name,
    email: "example@example.com",
    avatar: "https://placekitten.com/300/300",
}))
```

Obviously, in JavaScript files you can also import other files - external libraries, helper methods etc. It's easy to write some data randomization rules - which are mostly essential for creating development sample data. Consider the following example of `people` collection import:

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

The difference should be noticeable. This way of defining import data feels just right. And yes, you can do that in Mongo Seeding. But, JSON files are supported as well.

### Problem #2: No data model validation

In multiple JSON files which contains MongoDB documents definition, it's easy to make a mistake, especially in complex data structure. Sometimes a typo results in invalid data. See the example below for `people` collection definition:

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
The same problem would exist in JavaScript data definition. But, if you was able to use TypeScript...

```javascript
export interface Person {
  name: string;
  email: string;
  age: number;
}
```

```javascript
// import interface defined above
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

If you used types, you would instantly see that you made mistakes - not only during import, but much earlier, in your IDE.

The Mongo Seeding CLI and Mongo Seeding Docker Image have TypeScript runtime built-in. It means that you can take advantage of static type checking in TypeScript data definition files (`.ts` extension).
You can use Mongo Seeding library in your projects with TypeScript runtime and enable importing TS files as well.

### Problem #3: No ultimate solution

Tools like this should be as flexible as possible. Some developers need just CLI tool, and some want to import data programmatically. Before writing Mongo Seeding, I needed a ready-to-use Docker image and found none. Dockerizing an application is easy, but it takes time.

That's why Mongo Seeding consists of:
- [JavaScript library](./core) - it can be installed straight from NPM and used in any JavaScript/TypeScript project,
- [Command line interface (CLI)](./cli) - it can be installed globally and used from command line in any location,
- [Docker image](./docker-image) - it is good for containerized applications.

All tools you'll ever need for seeding your MongoDB database.

## Contribution

Before you contribute to this project, read **[`CONTRIBUTING.md`](./CONTRIBUTING.md)** file.
