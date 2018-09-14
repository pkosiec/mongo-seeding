# Import data

This example shows how to define import data in JavaScript and JSON files. It uses helper methods defined in `helpers` directory. They are imported in some files from `data` folder.

## Preparations

1.  After cloning the repository, navigate to this directory.
1.  Run MongoDB on your local machine on port 27017. The recommended way is to use Docker:

    ```bash
    docker run --rm -p 27017:27017 mongo
    ```

1.  Navigate to this directory.
1.  To install all needed dependencies, run the following command:

    ```bash
    npm install
    ```

## Import data

In order to import the sample data, use one of Mongo Seeding tools. The following instructions will result in sample data import to `testing` database.

### JavaScript library

1. Create `index.js` file in this directory
1. 


Write a custom JavaScript application and include this snippet:

```javascript
const config = {
database: {
    name: 'testing',
},
replaceIdWithUnderscoreId: true,
inputPath: path.resolve('path/to/example/data'),
dropDatabase: true,
};

seedDatabase(config).then(() => {
console.log("Success")
}).catch(err => {
console.log("Error", err)
});
```

Replace `path/to/example/data` with the path to `samples/example/data` in this cloned repository.

To see the full description of the JS library usage, read the **[Readme](../core/README.md)** file of the Mongo Seeding.


### CLI

Make sure that you have the [Mongo Seeding CLI](../cli) installed. Then, run the following command from the current directory:

```bash
seed --drop-database --replace-id --db-name testing
```

To see the full description of the CLI usage, read the **[Readme](../cli/README.md)** file of the Mongo Seeding CLI.

### Docker image

Execute the following command:

```bash
docker run --rm --network="host" -e DB_NAME=testing -v /absolute/path/to/examples/import-data/:/absolute/path/to/examples/import-data/ -w /absolute/path/to/examples/import-data/data pkosiec/mongo-seeding
```

Replace `absolute/path/to` with your absolute path to this cloned repository.

To read more how to run the Docker image with all configuration parameters, read the **[Readme](../docker-image/README.md)** file of the Mongo Seeding Docker image.
