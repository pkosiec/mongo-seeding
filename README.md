![Mongo Seeding](https://raw.githubusercontent.com/pkosiec/mongo-seeding/master/docs/assets/logo.png)

# Mongo Seeding

[![GitHub version](https://badge.fury.io/gh/pkosiec%2Fmongo-seeding.svg)](https://badge.fury.io/gh/pkosiec%2Fmongo-seeding) [![Build Status](https://travis-ci.org/pkosiec/mongo-seeding.svg?branch=master)](https://travis-ci.org/pkosiec/mongo-seeding) [![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://lbesson.mit-license.org/)

The ultimate solution for populating your MongoDB database. :rocket: 

Define the data in JSON, JavaScript or even TypeScript. Use JS library, install CLI or run Docker image!

## What is it for?

Mongo Seeding is a flexible tool for importing data into MongoDB database.

It's great for:
- testing database queries, automatically or manually
- preparing ready-to-go development environment for your application
- setting initial state for your application
- defining import data without writing too much, using all JavaScript features
- making sure that that your input data is correctly defined with type checking
- applications which uses Docker Compose

## How it works?

1. Define the data with JavaScript, JSON or TypeScript
1. Use one of the Mongo Seeding solutions, depending on your need: 
    - [JavaScript library](./core)
    - [Command line interface (CLI)](./cli)
    - [Docker image](./docker-image)
1. ???
1. Profit!

## Prepare the data to import

Before you begin, define collections and documents for MongoDB import. Read the **[tutorial](./docs/define-import-data.md)** to learn, how to do that.

## Seed database programmatically

Use the `mongo-seeding` library with a friendly API! Define the data with JavaScript and JSON files. See the **[`core`](./core)** directory to learn more.

## Populate database with Command Line Interface (CLI)

Use the `mongo-seeding-cli` tool to import data with a single command! See the **[`cli`](./cli)** directory to learn how to use it.

## Import data with Docker image

Use the Mongo Seeding Docker image to import data effortlessly! Use JavaScript, TypeScript or JSON files to define the data! See the **[`docker-image`](./docker-image)** directory to learn, how to configure and run it.

## See samples

To see examples of data defined in JSON, JavaScript and TypeScript files, navigate to **[`samples`](./samples)** directory.

## Contribute

Before you contribute to this project, read **[`CONTRIBUTING.md`](./CONTRIBUTING.md)** file.
