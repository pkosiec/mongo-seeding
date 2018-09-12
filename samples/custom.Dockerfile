FROM pkosiec/mongo-seeding

WORKDIR /input-data/

# Copy your project (import data and all dependencies have to be there)
COPY package.json package-lock.json /input-data/

# Install external dependencies
RUN npm install

# Copy complete example
COPY ./example /inwput-data/example

# Set default workdir to simplify running the image
WORKDIR /input-data/example/data