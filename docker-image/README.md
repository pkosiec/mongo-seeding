![Mongo Seeding](https://raw.githubusercontent.com/pkosiec/mongo-seeding/master/docs/assets/logo.png)

# Mongo Seeding Docker Image

[![Build Status](https://travis-ci.org/pkosiec/mongo-seeding.svg?branch=master)](https://travis-ci.org/pkosiec/mongo-seeding) [![David](https://img.shields.io/david/pkosiec/mongo-seeding.svg?path=docker-image)]() [![David](https://img.shields.io/david/dev/pkosiec/mongo-seeding.svg?path=docker-image)]()

The ultimate Docker image for populating your MongoDB database :rocket: 

Define MongoDB documents in JSON, JavaScript or even TypeScript file(s). Import them with an easy-to-use Docker image.

[![Docker image](http://dockeri.co/image/pkosiec/mongo-seeding)](https://hub.docker.com/r/pkosiec/mongo-seeding/)

## Usage

1. Follow the [tutorial](https://github.com/pkosiec/mongo-seeding/tree/master/docs/import-data-definition.md) to define documents and collections to import. See [`samples`](https://github.com/pkosiec/mongo-seeding/tree/master/samples) directory for examples.
1. Pull the latest stable version of Mongo Seeding image. Check the version number in GitHub releases.

    ```bash
    docker pull pkosiec/mongo-seeding:{versionNumber}
    ```

1. Run the image. Mount your directory with input data with `-v {source}:{destination}` parameter. Specify workspace which is a directory containing data import structure. Usually it will be the same directory:

    ```bash
    docker run --rm --network=host -v /absolute/path/to/data/:/absolute/path/to/data/ -w    /absolute/path/to/data pkosiec/mongo-seeding
    ```

    Sometimes, in import data files you would like to `import` or `require` other dependencies, like helper functions defined somewhere else or external libraries. In order to resolve them properly in Docker container, you have to to mount the root directory of your project. As a  working directory, define exact path for a directory that contains just the import data.

     ```bash
    docker run --rm --network=host -v /absolute/path/to/project/:/absolute/path/to/project -w   /absolute/path/to/project/import-data/ pkosiec/mongo-seeding
    ```

1. Configure seeding with environmental variables. See the following example:

    ```bash
     docker run --rm --network=host -v /absolute/path/to/samples/:/absolute/path/to/data/ -w    /absolute/path/to/data/ -e DB_URI='mongodb://127.0.0.1:27017/mydbname' -e   DROP_DATABASE=true pkosiec/mongo-seeding
     ```

    See [Configuration](#configuration) section for details.

## Configuration
The Docker image is basically a containerized CLI tool. Therefore, oo configure the project, use environmental variables described in [Environmental Variables](../cli/README.md#environmental-variables) section of the CLI tool. Specify them with `-e {key}={value}` parameters.

## Docker image customization

You can prepare customized Docker image with configuration and copied import data.

1. Prepare Dockerfile:

    ```
    FROM pkosiec/mongo-seeding:latest

    #
    # Copy sample data
    #

    COPY ./data /import-data

    #
    # Set environmental variables (optional)
    #

    ENV DB_HOST 127.0.0.1
    ENV DB_NAME mydbname
    ENV DB_PORT 27017
    ENV DROP_DATABASE true
    ENV REPLACE_ID_TO_UNDERSCORE_ID true

    #
    # Set default workspace to not specify it every time the image is ran
    #

    WORKDIR /import-data
    ```

    If in any import data file there is an external dependency, copy not only data import files, but also `package.json` with `package-lock.json` and run `npm install` during image build.

1. Build the image:

    ```bash
    docker build -t custom-mongo-seeding .
    ```

1. Run the image

    ```bash
    docker run --rm --network="host" custom-mongo-seeding
    ```
