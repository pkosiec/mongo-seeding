# Custom Docker image
This example presents how to build your own Docker image based on [Mongo Seeding Docker image](../docker-image). It allows you to prepare image that contains import data inside and is already configured for your needs.

## Prerequisites

In order to run this example, you have to install the following tools:
- [Docker](http://docker.com)

## Usage

1. After cloning the repository, navigate to this directory.
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