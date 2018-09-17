FROM pkosiec/mongo-seeding:3.0.0

WORKDIR /data-import/

# Copy your project (import data and all dependencies have to be there)
COPY ./sample-data /data-import/

# Install external dependencies
RUN npm install

# Set environmental variables

ENV DB_NAME dockerexample
ENV DB_PORT 30000
ENV DROP_DATABASE true
ENV REPLACE_ID_TO_UNDERSCORE_ID true

# Set default workdir to simplify running the image
WORKDIR /data-import//data