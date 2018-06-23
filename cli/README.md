![Mongo Seeding](https://raw.githubusercontent.com/pkosiec/mongo-seeding/master/assets/logo.png)

# Mongo Seeding CLI
[![npm version](https://badge.fury.io/js/mongo-seeding-cli.svg)](https://npmjs.org/package/mongo-seeding-cli) [![David](https://img.shields.io/david/pkosiec/mongo-seeding-cli.svg)]() [![David](https://img.shields.io/david/dev/pkosiec/mongo-seeding-cli.svg)]() [![Codacy Badge](https://api.codacy.com/project/badge/Grade/6a3945df88604e9b912e967116ba9bd8)](https://www.codacy.com/app/pkosiec/mongo-seeding-cli?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=pkosiec/mongo-seeding-cli&amp;utm_campaign=Badge_Grade)

Fill your MongoDB database with data in easy way with command line interface (CLI). Use JavaScript and JSON files to define the data!

## Looking for different type of database seed solution?
- JavaScript/TypeScript library: [Mongo Seeding](https://github.com/pkosiec/mongo-seeding)
- Docker image (TypeScript support included): [Mongo Seeding Docker Image](https://github.com/pkosiec/mongo-seeding-docker)

## Installation
```bash
npm install -g mongo-seeding-cli
```

## Usage
Seed database with data from current directory using default DB connection values:

```bash
seed
```

You can specify your custom settings like this:


```bash
seed -u 'mongodb://127.0.0.1:27017/mydb' -d ./samples/data
```

or, like this:

```bash
seed --db-host 127.0.0.1 --db-name testing2 -d ./samples/data/ --drop-database --replace-id
```

## Command line parameters
Here are all command line parameters you can use:

| Name          | Required | Default Value  | Description         |
| ------------- |:--------:|:-------------:| --------------------:|
| `--data $PATH` or `-d $PATH` | no | (directory, where `seed` command is executed) | Path to directory containing import data |
| `--db-uri $URI` or `-u $URI` | no | *undefined* | If defined, the URI will be used for establishing connection to database, ignoring values defined via other `db-*` parameters, i.e. `db-name`, `db-host`, etc.
| `--db-protocol $DB_PROTOCOL` | no | `mongodb` | MongoDB database protocol |
| `--db-host $DB_HOST` | no | 127.0.0.1 | MongoDB database host |
| `--db-port $DB_PORT` | no | 27017 | MongoDB database port |
| `--db-name $DB_NAME` | no | database | Name of the database |
| `--db-username $DB_USERNAME` | no | database | Username for connecting with database that requires authentication |
| `--db-password $DB_PASSWORD` | no | database | Password for connecting with database that requires authentication |
| `--drop-database` | no | false | If parameter specified, drops database before importing data |
| `--replace-id` | no | false | If parameter specified, replaces `id` property with `_id` for every object it imports |
| `--reconnect-timeout` | no | 10 (seconds) | Maximum time of waiting for successful MongoDB connection|
| `--help` or `-h` | n/a | n/a | Shows help

## Preparing data to import
1. Create a new base directory. In this example, it'll be named `data`.
1. Define a few collections via creating subdirectories in `data` directory. New collection will be created if it doesn't exist in database.

    **Naming convention**
    - If you don't care about import order - just name directories simply with collection names - i.e. `categories`, `posts`, `comments`, etc.   
    - To keep your own import order, construct directory name with a number, separator and actual collection name - i.e. `1-categories`, `2_posts`, `3.comments`, `4 tags`, etc. Supported separators between import number and collection name: `-`, `_`, `.` or space.

1. We have collections - now it's time to define documents. It can be done via creating files in collections directories.

    **A few things to know**: 
    - Collection directory can contain multiple files
    - Every file can contain single objects or array of objects
    - One object represents one MongoDB document
    - Supported extensions: `js`, `json`
    - In `js` files export object or array of objects via `module.exports =   objectOrArray`.

    **Some examples**:

    `object.js` ( will result in creating single MongoDB document):
    ```js
    module.exports = {
      name: "Parrot"
    }
    ```

    `array.js` (it will create 2 documents):
    ```js
    module.exports = [
      {
        name: "Dog"
      },
      {
        name: "Cat"
      }
    ]
    ```

    `object.json` (represent 1 MongoDB document):
    ```json
    {
      "name": "Penguin",
    }
    ```

    `array.json` (creates two different documents):
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

1. The complete file structure should look like this:

    ```
    data
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

1. To sum everything up: Subdirectories of base directory represent database collections. Files in collection directories represent documents. Simple as that.

## Samples
Take a look at [samples repository](https://github.com/pkosiec/mongo-seeding-samples) to see more examples how to define data structure properly!
