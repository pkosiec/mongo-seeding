# How to use Mongo Seeding with Mongoose and Express

This example shows you how to import data from mongoose model to Mongodb database.
There are three models defined, `customers`, `menus`, and `orders`.

## Prerequisites
In order to run this example, it's recommended to install the following tools:
- [NodeJS with NPM](https://nodejs.org)
- [Mongoose](https://mongoosejs.com/)
- [Express](https://expressjs.com/)

## Prepare data model
Consider the following mongoose models:

**Customer model**
```js
const mongoose = require("mongoose");

const CustomerShema = mongoose.Schema({
    name: String,
    lastname: String,
    email: {
        type: String,
        unique: true
    },
    password: String,
});

module.exports = mongoose.model("Customer", CustomerShema);
```

**Menu model**
```js
const mongoose = require("mongoose");

const MenuSchema = mongoose.Schema({
    name: String,
    price: Number,
    category: {
        type: String,
        enum: ["firstCourse", "mainCourse"],
        default: "mainCourse",
    },
});

module.exports = mongoose.model("Menu", MenuSchema);
```

**Order model**
```js
const mongoose = require("mongoose");
const Menu = require("./menu");
const Customer = require("./customer");

const Schema = mongoose.Schema;

const OrderSchema = Schema({
    order_detail: [{ type: Schema.Types.ObjectId, ref: Menu }],
    customer: { type: Schema.Types.ObjectId, ref: Customer },
    date: Date,
});

module.exports = mongoose.model("Order", OrderSchema);
```

## Define proper directory structure
To learn how to structure import data, see the [Import data definition guide](../../docs/import-data-definition.md). In this example the following directory structure is used:

> **NOTE:** One of MongoDB convention says tha collections names should be plural. 

```js
   .
   ├── data // Root directory
   │    ├── 1-customers // `customers`collection
   │    │   └── customer.json
   │    ├── 2-menus // `menus` collection
   │    │   └── menu.json
   │    └── 3-orders // `orders` collection
   │        └── order.json
```

## Define information files
The collection directory can contain multiple files with different extensions (JSON, JS or TS). In this example JSON files are used.

Create the following files:

**customer.json**
```json
[
    {
        "_id": { "$oid": "5e8508ea69a10e42d07414be" },
        "name": "Emma",
        "lastname": "Watson",
        "email": "emma@watson.com",
        "password": "$2a$10$hhn8vSvl6rpv42undbkQ.O5XIdIJkujyqQWqKIxRJgLQYCGlM/6rW"
    },
    {
        "_id": { "$oid": "5e850bd669a10e42d07414c0" },
        "name": "Pablo",
        "lastname": "Picasso",
        "email": "pablo@picasso.com",
        "password": "$2a$10$hhn8vSvl6rpv42undbkQ.O5XIdIJkujyqQWqKIxRJgLQYCGlM/6rW"
    }
]
```

**menu.json**
```json
[
    {
        "_id": { "$oid": "5e6066bea0403411bc4a3333" },
        "name": "Ceviche",
        "price": 18.0,
        "category": "firstCourse"
    },
    {
        "_id": { "$oid": "5e6066e9a0403411bc4a3334" },
        "name": "Tacos",
        "price": 18.0,
        "category": "firstCourse"
    },
    {
        "_id": { "$oid": "5e606408dc8aec3040688a86" },
        "name": "Lomo saltado",
        "price": 20.0,
        "category": "mainCourse"
    },
    {
        "_id": { "$oid": "5e60650ea0403411bc4a332f" },
        "name": "Stew",
        "price": 20.0,
        "category": "mainCourse"
    }
]
```

**order.json**

```json
[
    {
        "_id": { "$oid": "5e8186aa5d750a38e4260fcc" },
        "order_detail": [
            { "$oid": "5e606408dc8aec3040688a86" },
            { "$oid": "5e6066bea0403411bc4a3333" }
        ],
        "customer": { "$oid": "5e8508ea69a10e42d07414be" },
        "date": { "$date": { "$numberLong": "1583902800000" } }
    },
    {
        "_id": { "$oid": "5e8187d53eda1f3a20d887e1" },
        "order_detail": [
            { "$oid": "5e60650ea0403411bc4a332f" },
            { "$oid": "5e6066e9a0403411bc4a3334" }
        ],
        "customer": { "$oid": "5e850bd669a10e42d07414c0" },
        "date": { "$date": { "$numberLong": "1583902800000" } }
    }
]
```

## Use Mongo Seeding CLI
To install Mongo Seeding CLI globally, run the following command:

```bash
npm install -g mongo-seeding-cli
```

You can specify custom settings with command line parameters. The following example imports data from `./mongoose-express/data` directory using MongoDB connection URI mongodb://127.0.0.1:27017/mydb with option to drop database before import:

> **NOTE:** You can use the [following parameters](../../cli/README.md#command-line-parameters) while using `seed` tool

```bash
seed -u mongodb://127.0.0.1:27017/dbname --drop-database ./data
```

Once the database seed finishes, the database is populated with collections from `./data` directory.

## Fetch data from DB with Mongoose
To bring the defined relation of customers, menus, and orders, use the [populate](https://mongoosejs.com/docs/populate.html) function of Mongoose.

Create or [copy](./example/index.js) the following file:

**index.js**
```js
const Order = require("./models/order");

api.get("/orders", (req, res) => {
    Order.find()
        .populate("order_detail customer")
        .exec(function (err, order) {
            if (err) return handleError(err);

            res.status(200).send(order);
        });
});
```

Run the following command to test if the application works correctly:
```bash
node dev
```

To test the API, you can run the following curl:
```bash
curl 'http://localhost:3978/orders'
```

The expected response is:
```json
[
    {
        "order_detail": [
            {
                "category": "mainCourse",
                "_id": "5e606408dc8aec3040688a86",
                "name": "Lomo saltado",
                "price": 20
            },
            {
                "category": "firstCourse",
                "_id": "5e6066bea0403411bc4a3333",
                "name": "Ceviche",
                "price": 18
            }
        ],
        "_id": "5e8186aa5d750a38e4260fcc",
        "customer": {
            "_id": "5e8508ea69a10e42d07414be",
            "name": "Emma",
            "lastname": "Watson",
            "email": "emma@watson.com",
            "password": "$2a$10$hhn8vSvl6rpv42undbkQ.O5XIdIJkujyqQWqKIxRJgLQYCGlM/6rW"
        },
        "date": "2020-03-11T05:00:00.000Z"
    },
    {
        "order_detail": [
            {
                "category": "mainCourse",
                "_id": "5e60650ea0403411bc4a332f",
                "name": "Stew",
                "price": 20
            },
            {
                "category": "firstCourse",
                "_id": "5e6066e9a0403411bc4a3334",
                "name": "Tacos",
                "price": 18
            }
        ],
        "_id": "5e8187d53eda1f3a20d887e1",
        "customer": {
            "_id": "5e850bd669a10e42d07414c0",
            "name": "Pablo",
            "lastname": "Picasso",
            "email": "pablo@picasso.com",
            "password": "$2a$10$hhn8vSvl6rpv42undbkQ.O5XIdIJkujyqQWqKIxRJgLQYCGlM/6rW"
        },
        "date": "2020-03-11T05:00:00.000Z"
    }
]
```
