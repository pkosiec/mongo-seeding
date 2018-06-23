![Mongo Seeding](https://raw.githubusercontent.com/pkosiec/mongo-seeding/master/assets/logo.png)

# Mongo Seeding Docker Image
[![Build Status](https://travis-ci.org/pkosiec/mongo-seeding-docker.svg?branch=master)](https://travis-ci.org/pkosiec/mongo-seeding-docker) [![David](https://img.shields.io/david/pkosiec/mongo-seeding.svg)]() [![David](https://img.shields.io/david/dev/pkosiec/mongo-seeding.svg)]() [![Codacy Badge](https://api.codacy.com/project/badge/Grade/6a3945df88604e9b912e967116ba9bd8)](https://www.codacy.com/app/pkosiec/mongo-seeding-cli?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=pkosiec/mongo-seeding-cli&amp;utm_campaign=Badge_Grade)

Fill your MongoDB database with data in easy way using Docker image! Additional TypeScript support included!

[![Docker image](http://dockeri.co/image/pkosiec/mongo-seeding)](https://hub.docker.com/r/pkosiec/mongo-seeding/)


## Looking for different type of database seed solution?
- JavaScript/TypeScript library: [Mongo Seeding](https://github.com/pkosiec/mongo-seeding)
- Command line tool: [Mongo Seeding CLI](https://github.com/pkosiec/mongo-seeding-cli)

## Usage
Just pull & run the image! Mount your input directories and specify environment variables for your custom settings. See [Configuration](#configuration) section for details.

```bash
docker pull pkosiec/mongo-seeding
docker run --rm --network="host" -e DB_NAME=testdb -e DB_PORT=27017 -e DB_HOST=127.0.0.1 -v /my-data/:/app/data/ pkosiec/mongo-seeding
```

## Configuration
### Volumes
Mount your directories with `-v source:destination` option.

| Source | Destination | Required | Description |
|:------:|:-----------:|:--------:|:-----------:|
| Absolute path to data | `/app/data/`| yes | Path to directory containing import data structure specified above |
| Absolute path to helpers | `/app/helpers` | no | Optional path for directory containing `js` or `ts` files with helper functions
| Absolute path to models | `/app/models` | no | Optional for TypeScript users: Path to directory with models (classes, interfaces, etc.) - see samples |

**Example:**

```bash
docker run --rm --network="host" -v /my/data/:/app/data/ -v /my/models/:/app/models/ -v /my/helpers:/app/helpers/ pkosiec/mongo-seeding
```

### Environmental variables
Specify environmental variables with `-e key=value` option.

| Name          | Required | Default Value  | Description         |
| ------------- |:--------:|:-------------:| --------------------:|
| DB_CONNECTION_URI | no | *undefined* | If defined, the URI will be used for establishing connection to database, ignoring values given in `DB_*` environmental variables (i.e. `DB_HOST`, `DB_PORT`, etc.).
| DB_HOST | no | 127.0.0.1 | MongoDB database host |
| DB_PORT | no | 27017 | MongoDB database port |
| DB_NAME | no | database | Name of the database |
| DB_USERNAME | no | *undefined* | Username for connecting with database that requires authentication |
| DB_PASSWORD | no | *undefined* | Password for connecting with database that requires authentication |
| DROP_DATABASE | no | false | Drop database before importing data |
| REPLACE_ID_TO_UNDERSCORE_ID | no | false | Replaces `id` property with `_id` for every document it imports. Handy especially for ORM-s in TypeScript. | 
| RECONNECT_TIMEOUT_IN_SECONDS | no | 10 | Maximum time, in which app should keep trying connecting to database |

**Example:**

```bash
docker run --rm --network="host" -e DB_NAME=mydbname -e RECONNECT_TIMEOUT_IN_SECONDS=5 -e DROP_DATABASE=true -v /my/data/:/app/data/ pkosiec/mongo-seeding
```

or, as an alternative:

```bash
docker run --rm --network="host" -e DB_CONNECTION_URI='mongodb://127.0.0.1:27017/mydbname' -e RECONNECT_TIMEOUT_IN_SECONDS=5 -e DROP_DATABASE=true -v /my/data/:/app/data/ pkosiec/mongo-seeding
```

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
    - Supported extensions: `.ts`, `js`, `json`
    - In `ts` files export object or array of objects via `export = objectOrArray`
    - In `js` files export object or array of objects via `module.exports =   objectOrArray`.

    **Some examples**:
    `object.ts` ( will result in creating single MongoDB document):

    ```js
    export = {
      name: "Parrot"
    }
    ```

    `array.ts` (it will create 2 documents):

    ```js
    export = [
      {
        name: "Dog"
      },
      {
        name: "Cat"
      }
    ]
    ```

    `object.js` (creates single MongoDB document):

    ```js
    module.exports = {
      name: "Parrot"
    }
    ```

    `array.js` (imports 2 documents):

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
    +-- tsconfig.json // Optional for using TypeScript (see **Advanced features** section)
    +-- 1-categories
    |   +-- cat.js
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

1. To sum everything up: Subdirectories of base directory represent database collections. Files in collection directories represent documents. Simple as that.

## Samples
Take a look at [samples repository](https://github.com/pkosiec/mongo-seeding-samples) to see Mongo Seeding TS in action! 

## Advanced features

### Typechecking with TypeScript
- mount directory with models running Docker image - `-v /path/to/models/:/app/models`)
- in files defining documents, write in TypeScript and use `.ts` extension
- whenever you want to import a class or an interface from mounted models directory, just import it via `import { YourClass } from '@models/YourClass';` (assuming that `YourClass.ts` is located in`/path/to/models/`)
- while running Docker image, `@models` is just an alias for mounted directory `/app/models`. But, of course locally you'll want to have proper path configured. To do so, create `tsconfig.json` somewhere in `data` directory or upper level. Include path aliases definition:

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
    Go to [samples section](#samples) to see type check in action!


### Helper functions
- mount directory with helpers running Docker image - `-v /path/to/helpers/:/app/helpers`)
- you can also mount directory with helper functions for mapping simple string array to more complex objects (with filling random data, etc.). Import is as easy as
`import { mapToBlogPosts } from '@helpers/mapToBlogPosts';` (assuming that `mapToBlogPosts.ts` is located in `/path/to/helpers/`)

    Take a look at [samples section](#samples) to see helpers in action!

## Building your own Docker image
Do you want to build a customized image with DB connection configured and all data imported? No problem.

1. Prepare Dockerfile:

    ```
    FROM pkosiec/mongo-seeding:latest

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
    # Set new default environmental variables (optional)
    #

    ENV DB_HOST 127.0.0.1
    ENV DB_NAME mydbname
    ENV DB_PORT 27017
    ENV DROP_DATABASE true
    ENV REPLACE_ID_TO_UNDERSCORE_ID true
    ```

1. Build the image:

    ```bash
    docker build -t custom-mongo-seeding .
    ```

1. Run it!

    ```bash
    docker run --rm --network="host" custom-mongo-seeding
    ```
