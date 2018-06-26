![Mongo Seeding](https://raw.githubusercontent.com/pkosiec/mongo-seeding/master/assets/logo.png)

# Mongo Seeding Samples
Seeding database with Mongo Seeding? See how easy it is to define the import data!

This repository contains sample data for:
- [Mongo Seeding library](https://github.com/pkosiec/mongo-seeding)
- [Mongo Seeding CLI](https://github.com/pkosiec/mongo-seeding-cli)
- [Mongo Seeding Docker Image](https://github.com/pkosiec/mongo-seeding-docker)

## Directory Description
- **`samples`** - for `mongo-seeding` and `mongo-seeding-cli` usage
- **`samples-ts`** - for `mongo-seeding-docker` only, as it brings additional TypeScript support

## Import sample data
Assuming that your MongoDB is up and running on `mongodb://127.0.0.1:27017` and you want to import data to `testing` database:
- **CLI:**

    ```bash
    cd path/to/samples/data/
    seed --drop-database --replace-id --db-name testing
    ```

    [See full usage of CLI](https://github.com/pkosiec/mongo-seeding-cli/blob/master/README.md#usage)

- **Docker Image:**

    ```bash
    docker run --rm --network="host" -e DB_NAME=testing -e DROP_DATABASE=true -e REPLACE_ID_TO_UNDERSCORE_ID=true -v /absolute/path/to/samples-ts/data/:/app/data/ -v /absolute/path/to/samples-ts/models/:/app/models -v /absolute/path/to/samples-ts/helpers/:/app/helpers pkosiec/mongo-seeding
    ```

    [See full usage of Docker Image](https://github.com/pkosiec/mongo-seeding-docker/blob/master/README.md#usage)
