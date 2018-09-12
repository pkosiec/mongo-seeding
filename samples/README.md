![Mongo Seeding](https://raw.githubusercontent.com/pkosiec/mongo-seeding/master/docs/assets/logo.png)

# Samples
This directory contains sample data for Mongo Seeding solutions.

## Directory structure
- **`example`** directory contains example data for all Mongo Seeding solutions
- **`example-ts`** directory contains TypeScript sample data, that is compatible with Mongo Seeding CLI, Mongo Seeding Docker image and custom TypeScript apps written with Mongo Seeding library.

## Import sample data
The following example assumes that the MongoDB is running on `mongodb://127.0.0.1:27017` and the selected database is named `testing`.

1. Clone this repository.
1. Run your MongoDB instance.
1. Use your selected solution to import the data:
- **JS Library**: Write a custom JavaScript application with and include this snippet:
    ```javascript
    const config = {
      database: {
        name: 'testing',
      },
      replaceIdWithUnderscoreId: false,
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

- **CLI:** Run the following command:

    ```bash
    cd ./example/data/
    seed --drop-database --replace-id --db-name testing
    ```

    To see the full description of the CLI usage, read the **[Readme](../cli/README.md)** file of the Mongo Seeding CLI.

- **Docker Image:**
    Execute the following command:

    ```bash
    docker run --rm --network=host -v /absolute/path/to/samples/:/absolute/path/to/samples/ -w /absolute/path/to/samples/example-ts/data pkosiec/mongo-seeding
    ```

    Replace `absolute/path/to` with your absolute path to this cloned repository.

    To read more how to run the Docker image with all configuration parameters, read the **[Readme](../docker-image/README.md)** file of the Mongo Seeding Docker image.
