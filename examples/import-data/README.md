# Example of import data

This example shows how to define import data in JavaScript and JSON files. There are two collections defined: `categories` and `posts`.
Data import files are prepared to show multiple possibilities of data definition. In some data import files there are used helper methods defined in `helpers` directory.

## Prerequisites

In order to run this example, it's recommended to install the following tools:

- [Docker](https://docker.com) (optional) - to run MongoDB and Mongo Seeding Docker Image
- [NodeJS with NPM](https://nodejs.org) (optional) - to run JavaScript example

## Preparations

1.  After cloning the repository, navigate to this directory.
1.  Run MongoDB on your local machine on port 27017. The recommended way is to use Docker:

    ```bash
    docker run --rm -p 27017:27017 mongo
    ```

1.  Navigate to the `./example` directory.
1.  To install all needed dependencies of import data, run the following command:

    ```bash
    npm install
    ```

## Import data

In order to import the sample data, use one of Mongo Seeding tools. The following instructions will result in sample data import to `testing` database. The database will be dropped before import.

### JavaScript library

1.  Initialize a new Node.js project in this directory (folder, which contains this Readme file) with the command:

    ```
    npm init -y
    ```

1.  Create a new `index.js` file in the same directory with the following content:

    ```javascript
    const path = require('path');
    const { Seeder } = require('mongo-seeding');

    const config = {
      database: {
        name: 'testing',
      },
      dropDatabase: true,
    };
    const seeder = new Seeder(config);
    const collections = seeder.readCollectionsFromPath(
      path.resolve('./example/data'),
      {
        transformers: [Seeder.Transformers.replaceDocumentIdWithUnderscoreId],
      },
    );

    seeder
      .import(collections)
      .then(() => {
        console.log('Success');
      })
      .catch((err) => {
        console.log('Error', err);
      });
    ```

1.  To install all dependencies used in your `index.js` application, run the command:

    ```bash
    npm install mongo-seeding --save
    ```

1.  Turn on the debug output from `mongo-seeding` library and run the newly created app to import data:

    ```bash
    DEBUG=mongo-seeding node index.js
    ```

To see the full description of the JS library usage, read the **[Readme](../../core/README.md)** file of the Mongo Seeding.

### CLI

Make sure that you have the [Mongo Seeding CLI](../../cli) installed. Then, run the following command from this directory (folder, which contains this Readme file):

```bash
seed --drop-database --replace-id --set-timestamps --db-name testing ./example/data
```

To see the full description of the CLI usage, read the **[Readme](../../cli/README.md)** file of the Mongo Seeding CLI.

### Docker image

Execute the following command:

```bash
docker run --rm --network="host" -e DB_NAME=testing -e REPLACE_ID=true SET_TIMESTAMPS=true -e DROP_DATABASE=true -v /absolute/path/to/examples/import-data/example/:/absolute/path/to/examples/import-data/example/ -w /absolute/path/to/examples/import-data/example/data pkosiec/mongo-seeding
```

Replace `/absolute/path/to/` with your absolute path to this cloned repository.

To read more how to run the Docker image with all configuration parameters, read the **[Readme](../../docker-image/README.md)** file of the Mongo Seeding Docker image.
