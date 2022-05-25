![Mongo Seeding](https://raw.githubusercontent.com/pkosiec/mongo-seeding/main/docs/assets/logo.png)

# Mongo Seeding Docker Image

[![Docker image version](https://images.microbadger.com/badges/version/pkosiec/mongo-seeding.svg)](https://microbadger.com/images/pkosiec/mongo-seeding)
[![Docker image size](https://images.microbadger.com/badges/image/pkosiec/mongo-seeding.svg)](https://microbadger.com/images/pkosiec/mongo-seeding)
[![Build Status](https://github.com/pkosiec/mongo-seeding/actions/workflows/branch.yaml/badge.svg)](https://github.com/pkosiec/mongo-seeding/actions)

The ultimate Docker image for populating your MongoDB database :rocket: 

Define MongoDB documents in JSON, JavaScript or even TypeScript file(s). Import them with an easy-to-use Docker image.

[![Docker image](http://dockeri.co/image/pkosiec/mongo-seeding)](https://hub.docker.com/r/pkosiec/mongo-seeding/)

## Usage

1. Follow the [tutorial](../docs/import-data-definition.md) to define documents and collections to import.
1. Pull the latest stable version of Mongo Seeding image.

    ```bash
    docker pull pkosiec/mongo-seeding:{versionNumber}
    ```

    Check the version number in GitHub releases.

1. Run the image. Mount your directory with input data with `-v {source}:{destination}` parameter. Specify workspace which is a directory containing data import structure. Usually it will be the same directory:

    ```bash
    docker run --rm --network=host -v /absolute/path/to/data/:/absolute/path/to/data/ -w /absolute/path/to/data pkosiec/mongo-seeding
    ```

    Sometimes, in import data files you would like to `import` or `require` other dependencies, like helper functions defined somewhere else or external libraries. In order to resolve them properly in Docker container, you have to to mount the root directory of your project. As a  working directory, define exact path for a directory that contains just the import data.

     ```bash
    docker run --rm --network=host -v /absolute/path/to/project/:/absolute/path/to/project -w /absolute/path/to/project/import-data/ pkosiec/mongo-seeding
    ```

1. Configure seeding with environmental variables. See the following example:

    ```bash
     docker run --rm --network=host -v /absolute/path/to/examples/:/absolute/path/to/data/ -w /absolute/path/to/data/ -e DB_URI='mongodb://127.0.0.1:27017/mydbname' -e DROP_DATABASE=true pkosiec/mongo-seeding
     ```

    See [Configuration](#configuration) section for details.

## Configuration

The Docker image is basically a containerized CLI tool. Therefore, to configure the project, use environmental variables described in [Environmental Variables](../cli/README.md#environmental-variables) section of the CLI tool. Specify them with `-e {key}={value}` parameters.

## Override image entrypoint and command

As with every Docker container, you can override the [entrypoint](https://docs.docker.com/engine/reference/run/#entrypoint-default-command-to-execute-at-runtime) and the [command](https://docs.docker.com/engine/reference/run/#cmd-default-command-or-options).

For example, to prevent Mongo Seeding Docker container from exiting after seeding, use the following command:

```bash
docker run --rm --entrypoint="sh" pkosiec/mongo-seeding -c 'seed; sleep infinity'
```

## Docker image customization

You can prepare a customized Docker image for data import. It allows you to prepare image that contains import data inside and is already configured for your needs.

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
    ENV REPLACE_ID true
    ENV SET_TIMESTAMPS true

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

See [**examples**](../examples) directory for an example of custom Docker image. 