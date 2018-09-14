# Custom Docker Image
This example shows how to build your own Docker image based on Mongo Seeding image. It allows you to prepare image that contains import data inside and is already configured for your needs.

1. To build the image, run:

    ```bash
    docker build -t custom-mongo-seeding .
    ```

1. Run MongoDB database with Docker on local machine on port 30000:

    ```bash
    docker run --rm -p 30000:27017 mongo:latest
    ```

1. Run the custom data import image with the following command:

    ```bash
    docker run --rm --network="host" custom-mongo-seeding
    ```
1. You should see that all MongoDB documents from `sample-data/data` directory have been successfully imported. The database name and port have been configured with default values of environmental variables set in custom Docker image.