![Mongo Seeding](https://raw.githubusercontent.com/pkosiec/mongo-seeding/main/docs/assets/logo.png)

# Mongo Seeding CLI

[![npm version](https://badge.fury.io/js/mongo-seeding-cli.svg)](https://npmjs.org/package/mongo-seeding-cli) [![Build Status](https://github.com/pkosiec/mongo-seeding/actions/workflows/branch.yaml/badge.svg)](https://github.com/pkosiec/mongo-seeding/actions) [![codecov](https://codecov.io/gh/pkosiec/mongo-seeding/branch/main/graph/badge.svg?flag=cli)](https://codecov.io/gh/pkosiec/mongo-seeding) [![David](https://img.shields.io/david/pkosiec/mongo-seeding.svg?path=cli)]() [![David](https://img.shields.io/david/dev/pkosiec/mongo-seeding.svg?path=cli)]() [![install size](https://packagephobia.now.sh/badge?p=mongo-seeding-cli)](https://packagephobia.now.sh/result?p=mongo-seeding-cli)

The ultimate CLI tool for populating your MongoDB database :rocket: 

Define MongoDB documents in JSON, JavaScript or even TypeScript file(s). Import them with command line interface.

## Installation

To install the app, run the following command:

```bash
npm install -g mongo-seeding-cli
```

## Usage

1. Follow the [tutorial](https://github.com/pkosiec/mongo-seeding/blob/main/docs/import-data-definition.md) to define documents and collections to import.
1. In order to seed your database with data from current directory using default configuration, run the following command:

    ```bash
    seed
    ```

1. You can specify custom settings with command line parameters. The following example imports data from `./example/data` directory using MongoDB connection URI `mongodb://127.0.0.1:27017/mydb` with option to drop database before import:

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
| `--db-options` | *`undefined`* | [MongoDB connection options](https://docs.mongodb.com/manual/reference/connection-string/) in a form of multiple `{key}={value}` values, separated by semicolon. For example: `ssl=true;maxPoolSize=50` |
| `--drop-database` | `false` | Drops entire database before data import |
| `--drop-collections` | `false` | Drops every collection which is being imported |
| `--remove-all-documents` | `false` | Delete all documents from every collection that is being imported |
| `--replace-id` | `false` | Replaces `id` property with `_id` for every document during data import |
| `--set-timestamps` | `false` | Sets `createdAt` and `updatedAt` timestamps for every document during data import |
| `--reconnect-timeout` | `10000` | Maximum time in milliseconds of waiting for successful MongoDB connection |
| `--ejson-parse-canonical-mode` | `false` | Enables [EJSON Canonical Mode](https://docs.mongodb.com/manual/reference/mongodb-extended-json/) for all parsed `.json` files. By default the EJSON Relaxed mode is enabled. |
| `--transpile-only` | `false` | Disables type checking on TypeScript files import. This option vastly improves performance of TypeScript data import |
| `--silent` or `-s` | `false` | Disables printing logging of Mongo Seeding status to standard output |
| `--help` or `-h` | n/a | Help

## Environmental variables

You can use the following environmental variables while using `seed` tool:

| Name        | Default Value  | Description         |
|-------------|----------------|---------------------|
| `DB_URI` | *`undefined`* | If defined, the URI is used for establishing connection to database, ignoring values given in `DB_*` environmental variables (e.g. `DB_HOST`, `DB_PORT`, etc.).
| `DB_HOST` | `127.0.0.1` | MongoDB database host |
| `DB_PORT` | `27017` | MongoDB database port |
| `DB_NAME` | `database` | Name of the database |
| `DB_USERNAME` | *`undefined`* | Username for connecting with database that requires authentication |
| `DB_PASSWORD` | *`undefined`* | Password for connecting with database that requires authentication |
| `DB_OPTIONS` | *`undefined`* | [MongoDB connection options](https://docs.mongodb.com/manual/reference/connection-string/) in a form of multiple `{key}={value}` values, separated by semicolon. For example: `ssl=true;maxPoolSize=50`. |
| `DROP_DATABASE` | `false` | Drops entire database before data import |
| `DROP_COLLECTIONS` | `false` | Drops every collection which is being imported |
| `REMOVE_ALL_DOCUMENTS` | `false` | Delete all documents from every collection that is being imported |
| `REPLACE_ID` | `false` | Replaces `id` property with `_id` for every document during import; useful for ORMs | 
| `SET_TIMESTAMPS` | `false` | Sets `createdAt` and `updatedAt` timestamps for every document during data import |
| `RECONNECT_TIMEOUT` | `10000` | Maximum time in milliseconds of waiting for successful MongoDB connection |
| `EJSON_PARSE_CANONICAL_MODE` | `false` | Enables [EJSON Canonical Mode](https://docs.mongodb.com/manual/reference/mongodb-extended-json/) for all parsed `.json` files. By default the EJSON Relaxed mode is enabled. |
| `TRANSPILE_ONLY` | `false` | Disables type checking on TypeScript files import. This option vastly improves performance of TypeScript data import |
| `SILENT` | `false` | Disables printing logging of Mongo Seeding status to standard output |