![Mongo Seeding](https://raw.githubusercontent.com/pkosiec/mongo-seeding/master/docs/assets/logo.png)

# Mongo Seeding Docker Image

[![Build Status](https://travis-ci.org/pkosiec/mongo-seeding-docker.svg?branch=master)](https://travis-ci.org/pkosiec/mongo-seeding-docker) [![David](https://img.shields.io/david/pkosiec/mongo-seeding.svg)]() [![David](https://img.shields.io/david/dev/pkosiec/mongo-seeding.svg)]() [![Codacy Badge](https://api.codacy.com/project/badge/Grade/6a3945df88604e9b912e967116ba9bd8)](https://www.codacy.com/app/pkosiec/mongo-seeding-cli?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=pkosiec/mongo-seeding-cli&amp;utm_campaign=Badge_Grade)

The ultimate solution for populating your MongoDB database. Define the data in JSON, JavaScript or TypeScript. Import collections and documents!

[![Docker image](http://dockeri.co/image/pkosiec/mongo-seeding)](https://hub.docker.com/r/pkosiec/mongo-seeding/)

## Usage

1. Follow the [tutorial](https://github.com/pkosiec/mongo-seeding/tree/master/docs/define-import-data.md) to define documents and collections to import. See [`samples`](https://github.com/pkosiec/mongo-seeding/tree/master/samples) directory 
1. Pull the latest version of Mongo Seeding image

  ```bash
  docker pull pkosiec/mongo-seeding:latest
  ```

1. Run the image. Mount your input directories and specify environment variables for your custom settings:

  ```bash
  docker run --rm --network="host" -e DB_NAME=testdb -e DB_PORT=27017 -e DB_HOST=127.0.0.1 -v /my-data/:/app/data/ pkosiec/mongo-seeding
  ```

  See [Configuration](#configuration) section for details.

## Configuration

### Mounting volumes

Mount your directories with `-v {source}:{destination}` parameter.

| Source | Destination | Required | Description |
|--------|-------------|----------|-------------|
| Absolute path to data | `/app/data/`| yes | Path to directory with import data |
| Absolute path to helpers | `/app/helpers` | no | Path for directory with helper functions (`js` or `ts` files)
| Absolute path to models | `/app/models` | no | Optional for TypeScript users: Path to directory with models (classes, interfaces, etc.) - see samples |

**Example:**

```bash
docker run --rm --network="host" -v /my/data/:/app/data/ -v /my/models/:/app/models/ -v /my/helpers:/app/helpers/ pkosiec/mongo-seeding
```

### Environmental variables

Specify environmental variables with `-e {key}={value}` parameter.

| Name        | Default Value  | Description         |
|-------------|----------------|---------------------|
| DB_CONNECTION_URI | *`undefined`* | If defined, the URI is used for establishing connection to database, ignoring values given in `DB_*` environmental variables (e.g. `DB_HOST`, `DB_PORT`, etc.).
| DB_HOST | `127.0.0.1` | MongoDB database host |
| DB_PORT | `27017` | MongoDB database port |
| DB_NAME | `database` | Name of the database |
| DB_USERNAME | *`undefined`* | Username for connecting with database that requires authentication |
| DB_PASSWORD | *`undefined`* | Password for connecting with database that requires authentication |
| DROP_DATABASE | `false` | Dropping database before data import |
| REPLACE_ID_TO_UNDERSCORE_ID | `false` | Replacing `id` property with `_id` for every document during import; useful for ORMs | 
| RECONNECT_TIMEOUT_IN_SECONDS | `10` | Maximum time, in which app should keep trying connecting to database |

**Examples:**

```bash
docker run --rm --network="host" -e DB_NAME=mydbname -e RECONNECT_TIMEOUT_IN_SECONDS=5 -e DROP_DATABASE=true -v /my/data/:/app/data/ pkosiec/mongo-seeding
```

Alternative:

```bash
docker run --rm --network="host" -e DB_CONNECTION_URI='mongodb://127.0.0.1:27017/mydbname' -e RECONNECT_TIMEOUT_IN_SECONDS=5 -e DROP_DATABASE=true -v /my/data/:/app/data/ pkosiec/mongo-seeding
```

## Advanced features

### Type checking

You can easily use type checking, writing code in TypeScript. However, because paths in Docker container are different than on your host machine, you have to use aliases.
To mount a directory with models, add Docker run parameter `-v /path/to/models/:/app/models`.
While running Docker image, `@models` is an alias for mounted directory `/app/models`.

Whenever you need to import a class or an interface from mounted models directory, assuming that `YourClass.ts` is located in`/path/to/models/` on your host machine, use:

```javascript
import { YourClass } from '@models/YourClass';`
```

In order to get the IDE features on your host machine, map the alias to your models path. Create `tsconfig.json` in `data` directory or in an upper level directory. Include path aliases definition:

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

To see this feature in action, see the [samples]((https://github.com/pkosiec/mongo-seeding/tree/master/samples) directory.

### Helper functions

To mount a directory with helper functions, add Docker run parameter `-v /path/to/helpers/:/app/helpers`. In files that describes MongoDB documents, you can import helper functions in the following way. This example assumes that a `mapToBlogPosts.ts` file is located in `/path/to/helpers/` path on your host machine.

```javascript
import { mapToBlogPosts } from '@helpers/mapToBlogPosts';`
```

To see helpers in action, see the [samples]((https://github.com/pkosiec/mongo-seeding/tree/master/samples) directory.

## Building your own Docker image

You can prepare customized Docker image with configuration and copied import data.

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

1. Run the image

    ```bash
    docker run --rm --network="host" custom-mongo-seeding
    ```
