# Elastic MongoDB Seed
Fill your MongoDB database with data in an easy way. Use JSON, JavaScript or even TypeScript files to define the data!

[![Build Status](https://travis-ci.org/pkosiec/elastic-mongodb-seed.svg?branch=master)](https://travis-ci.org/pkosiec/elastic-mongodb-seed) [![Open Source Love](https://badges.frapsoft.com/os/mit/mit.svg?v=102)](https://github.com/ellerbrock/open-source-badge/)

## Quick start

Alright, how does it work? It's pretty simple - you have to provide a directory with data files in proper structure. 

### Prepare your data to import

1. Create a new directory. In this example, name it simply as `data`.
1. This directory `data` will contain subdirectories in following naming convention: `$NUMBER-$COLLECTION_NAME` - i.e. `1-categories`, `2-posts`.

    `$COLLECTION_NAME` - it's just a collection name that will be created if not exist.

    `$NUMBER` - to define collections import order.  If you don't care about import order - just name the directory as `$COLLECTION_NAME`, i.e. `categories`.   

1. In every collection directory you can create multiple files in formats: `.ts`, `.js` and `.json`.

    Export object or array of objects you want to import via:
    - `module.exports = objectOrArray` (for JS files)
    - `export = objectOrArray` (for TS files)

    Every object is a representation of document in MongoDB database.

1. The whole file structure should look like this:

    ```
    data
    +-- tsconfig.json // Optional for using TypeScript (see Advanced )
    +-- 1-categories
    |   +-- cat.ts
    |   +-- dogs.js
    |   +-- other-animals.json
    +-- 2-posts
    |   +-- post-about-my-cat.json
    |   +-- dog-posts.js
    |   +-- random-stuff.ts
    +-- 3-media
    |   +-- cat-image.ts
    |   +-- dog.js
    ```

    Take a look at samples to see elastic-mongodb-seed in action!

### Install & use CLI
```bash
npm install -g elastic-mongodb-seed
seed --db-host 0.0.0.0 --db-name testing2 -d ./samples/data/ --drop-database --convert-id
```

**Command Line Parameters**

| Name          | Required | Default Value  | Description         |
| ------------- |:--------:|:-------------:| --------------------:|
| `--data $PATH` or `-d $PATH` | yes | - | Path to directory containing import data structure specified above |
| `--db-host $DB_HOST` | no | 127.0.0.1 | MongoDB database host |
| `--db-port $DB_PORT` | no | 27017 | MongoDB database port |
| `--db-name $DB_NAME` | no | database | Name of the database |
| `--drop-database` | no | false | If parameter specified, drop database before importing data |
| `--convert-id` | no | false | If parameter specified, replaces `id` field with `_id` for every object it imports. Handy especially for ORM-s in TypeScript.

### Run using Docker
Just pull & run the image!
```bash
docker pull pkosiec/elastic-mongodb-seed
docker run --rm --network="host" -e DB_NAME=$DB_NAME -e DB_PORT=$DB_PORT -e DB_HOST=$DB_HOST -v $DATA_PATH:/app/data -v $MODELS_PATH:/app/models -v $HELPERS_PATH:/app/helpers pkosiec/elastic-mongodb-seed
```

**Variables**

| Name          | Required | Default Value  | Description         |
| ------------- |:--------:|:-------------:| --------------------:|
| $DATA_PATH | yes | - | Path to directory containing import data structure specified above |
| $MODELS_PATH | no | - | Optional for TypeScript users: Path to directory with models (classes, interfaces, etc.) - see samples |
| $HELPERS_PATH | no | - | Optional helper functions path - see samples
| DB_HOST | no | 127.0.0.1 | MongoDB database host |
| DB_PORT | no | 27017 | MongoDB database port |
| DB_NAME | no | database | Name of the database |
| DROP_DATABASE | no | false | Drop database before importing data |
| CONVERT_ID_TO_UNDERSCORE_ID | no | false | Replaces `id` field with `_id` for every object it imports. Handy especially for ORM-s in TypeScript.

## Samples
[See content of `samples` directory](https://github.com/pkosiec/elastic-mongodb-seed/tree/master/samples)

Do you want to see this package in action?
Clone this repository and run:
- via NPM:
you have to remove aliases in import packages and then run:
```bash
seed --db-name testing2 -d ./samples/data/ --drop-database --convert-id
```
- via Docker:
```bash
docker run --rm --network="host" -e DB_NAME=testing -e DB_HOST=127.0.0.1 -e DROP_DATABASE=true -v /path/to/samples/data/:/app/data/ -v /path/to/samples/models/:/app/models -v /path/to/samples/helpers/:/app/helpers pkosiec/elastic-mongodb-seed:latest
```

## Advanced features

### Typechecking with TypeScript

**Docker**
- mount directory with models running Docker image - `-v /path/to/models/:/app/models`)
- in files defining documents, write in TypeScript and use `.ts` extension
- whenever you want to import a class or an interface from mounted models directory, just import it via `import { YourClass } from '@models/YourClass';` (assuming that `YourClass.ts` is located in`/path/to/models/`)
- while running Docker image, `@models` is just an alias for mounted directory `/app/models`. But, of course locally you'll want to have proper path configured. To do so, create `tsconfig.json` somewhere in `data` directory or upper level. Include path aliases definiton:

    ```json
    {
        "compilerOptions": {
            "baseUrl": "./",
            "paths": {                 
                "@models/*": ["../relative/path/to/models/*"],
                "@helpers/*": ["../relative/path/to/helpers/*"],
            },
        }
    }
    ```
    Take a look at [samples section](#samples) to see typechecking in action!


### Helper functions
**CLI**

While using CLI, just use `.ts` files with custom imports.

**Docker**
- mount directory with helpers running Docker image - `-v /path/to/helpers/:/app/helpers`)
- you can also mount directory with helper functions for mapping simple string array to more complex objects (with filling random data, etc.). Import is as easy as
`import { mapToBlogPosts } from '@helpers/mapToBlogPosts';` (assuming that `mapToBlogPosts.ts` is located in `/path/to/helpers/`)

    Take a look at [samples section](#samples) to see helpers in action!

## Building your own Docker image
Do you want to build a customized image with DB connection configured and all data imported? No problem.

1. Prepare Dockerfile:

    ```
    FROM pkosiec/elastic-mongodb-seed:latest

    #
    # Copy sample data
    #

    COPY ./data /app/data

    #
    # Copy models (optional) - if you're using TypeScript
    #

    COPY ./models /app/models

    #
    # Copy helpers (optional) - if you want additional helper functions and other resources
    #

    COPY ./helpers /app/helpers

    #
    # Set environmental variables (optional)
    #

    ENV DB_HOST 127.0.0.1
    ENV DB_NAME mydbname
    ENV DB_PORT 27017

    #
    # Set additional options
    #

    ENV DROP_DATABASE true
    ENV CONVERT_ID_TO_UNDERSCORE_ID true
    ```

1. Build the image:

    ```bash
    docker build -t custom-elastic-seed .
    ```

1. Run it!

    ```bash
    docker run --rm --network="host" custom-elastic-seed
    ```
