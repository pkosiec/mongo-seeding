![Mongo Seeding](https://raw.githubusercontent.com/pkosiec/mongo-seeding/master/docs/assets/logo.png)

# Mongo Seeding CLI

[![npm version](https://badge.fury.io/js/mongo-seeding-cli.svg)](https://npmjs.org/package/mongo-seeding-cli) [![David](https://img.shields.io/david/pkosiec/mongo-seeding.svg?path=cli)]() [![David](https://img.shields.io/david/dev/pkosiec/mongo-seeding.svg?path=cli)]()

The ultimate CLI tool for populating your MongoDB database :rocket: 

Define MongoDB documents in JSON, JavaScript or even TypeScript file(s). Import them with command line interface.

## Installation

To install the app, run the following command:

```bash
npm install -g mongo-seeding-cli
```

## Usage

Before you begin, follow the [tutorial](https://github.com/pkosiec/mongo-seeding/tree/master/docs/import-data-definition.md) to define documents and collections to import. See [`samples`](https://github.com/pkosiec/mongo-seeding/tree/master/samples) directory for examples.

In order to seed your database with data from current directory using default configuration, run the following command:

```bash
seed
```

You can specify custom settings with command line parameters. The following example imports data from `./example/data` directory using MongoDB connection URI `mongodb://127.0.0.1:27017/mydb` with option to drop database before import:

```bash
seed -u 'mongodb://127.0.0.1:27017/mydb' --drop-database ./example/data
```

You can also use environmental variables to configure the CLI. For example:

```bash
DB_URI='mongodb://127.0.0.1:27017/mydb' DROP_DATABASE=true seed ./example/data
```

Full configuration options are described in [Configuration](#configuration) section.

## Configuration
You can configure data import with command line parameters or environmental variables.

> **Note:** Command line parameters have always a higher priority over environmental variables.

## Command line parameters
You can use the following parameters while using `seed` tool:

| Name        | Default Value  | Description         |
|-------------|----------------|---------------------|
| `{PATH}` | current directory | Path to directory containing import data |
| `--db-uri {URI}` or `-u {URI}` | *`undefined`* | If defined, the URI will be used for establishing connection to database, ignoring values defined via other `db-*` parameters (e.g. `db-name`, `db-host`, etc.)
| `--db-protocol {DB_PROTOCOL}` | `mongodb` | MongoDB database protocol |
| `--db-host {DB_HOST}` | `127.0.0.1` | MongoDB database host |
| `--db-port {DB_PORT}` | `27017` | MongoDB database port |
| `--db-name {DB_NAME}` | `database` | Name of the database |
| `--db-username {DB_USERNAME}` | *`undefined`*  | Username for connecting with database that requires authentication |
| `--db-password {DB_PASSWORD}` | *`undefined`*  | Password for connecting with database that requires authentication |
| `--drop-database` | `false` | Dropping entire database before data import |
| `--drop-collection` | `false` | Dropping every collection that is being imported |
| `--replace-id` | `false` | Replacing `id` property with `_id` for every document during data import |
| `--reconnect-timeout` | `10` (seconds) | Maximum time of waiting for successful MongoDB connection|
| `--help` or `-h` | n/a | Help

## Environmental variables
You can use the following environmental variables while using `seed` tool:

| Name        | Default Value  | Description         |
|-------------|----------------|---------------------|
| DB_URI | *`undefined`* | If defined, the URI is used for establishing connection to database, ignoring values given in `DB_*` environmental variables (e.g. `DB_HOST`, `DB_PORT`, etc.).
| DB_HOST | `127.0.0.1` | MongoDB database host |
| DB_PORT | `27017` | MongoDB database port |
| DB_NAME | `database` | Name of the database |
| DB_USERNAME | *`undefined`* | Username for connecting with database that requires authentication |
| DB_PASSWORD | *`undefined`* | Password for connecting with database that requires authentication |
| DROP_DATABASE | `false` | Dropping entire database before data import |
| DROP_COLLECTION | `false` | Dropping every collection that is being imported |
| REPLACE_ID | `false` | Replacing `id` property with `_id` for every document during import; useful for ORMs | 
| RECONNECT_TIMEOUT | `10` | Maximum time, in which app should keep trying connecting to database |
