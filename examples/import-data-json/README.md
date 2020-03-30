![Mongo Seeding](https://raw.githubusercontent.com/D4ITON/mongo-seeding/master/docs/assets/logo-express-mongodb-mongoose-mongo-seeding.png)

# How to use mongoseeding with express and mongoose
If you're using a no-relational database like Mongodb, you should keep in mind that test data is very important because help to us testing data very similar to we will be used in a production enviorement, we dont use a faker because not always they adapt to our purposes, so in this post I wanted to make a small example of importing data using a backend express + mongodb + mongoose and mongo-seeding-cli system.

For this, I separated it into four important points:

### 1. Have the data odel
To seed your database, using mongo seeding cli, you must have the idea of ​​the datamodel that you require, for example take the case of a restaurant, it contain the following documents in mongodb (tables in a relational database ), users, plates and orders, note that there are a relation between plate and order models.

**User model**
```js
const mongoose = require("mongoose");

const UserShema = mongoose.Schema({
    name: String,
    lastname: String,
    username: {
        type: String,
        unique: true
    },
    password: String,
    role: {
        type: String,
        enum: ["mozo", "despachador", "admin"],
        default: "mozo"
    }
});

module.exports = mongoose.model("User", UserShema);

```

**Order model**
```js
const mongoose = require("mongoose");

const Plate = mongoose.model("Plate");
const Schema = mongoose.Schema;

const OrderSchema = Schema({
    order_detail: [{ type: Schema.Types.ObjectId, ref: Plate }],
    date: Date,
    table: Number
});

module.exports = mongoose.model("Order", OrderSchema);
```

**Plate model**
```js
const mongoose = require("mongoose");

const PlateSchema = mongoose.Schema({
    name: String,
    price: Number,
    category: {
        type: String,
        enum: ["fund", "entry"],
        default: "fund"
    }
});

module.exports = mongoose.model("Plate", PlateSchema);
```

### 2. Have the information
We must have the data and it shoud be structured like Paweł says, using the [Import data definition guide](https://github.com/pkosiec/mongo-seeding/blob/master/docs/import-data-definition.md),, in this example we use the following directory structure:

```
   .
   ├── data // Root directory
   │    ├── 1-users // `users` collection
   │    │   └── users.json
   │    ├── 2-plates // `plates` collection
   │    │   └── plates.json
   │    └── 3-orders // `orders` collection
   │        └── orders.json

```
To be more specific with our example, we use this json files:

**Users.json**

```json
[
    {   
        "_id": { "$oid": "5e601e82b3f2a43b5477b647" },
        "name": "Dalthon",
        "lastname": "Mamani",
        "username": "D4ITON",
        "password": "$2a$10$hhn8vSvl6rpv42undbkQ.O5XIdIJkujyqQWqKIxRJgLQYCGlM/6rW",
        "role": "admin"
    },
    {   
        "_id": { "$oid": "5e601e8cb3f2a43b5477b648" },
        "name": "Juan",
        "lastname": "Pérez",
        "username": "JU4N",
        "password": "$2a$10$hhn8vSvl6rpv42undbkQ.O5XIdIJkujyqQWqKIxRJgLQYCGlM/6rW",
        "role": "mozo"
    },
    {   
        "_id": { "$oid": "5e606354dc8aec3040688a7f" },
        "name": "Marta",
        "lastname": "López",
        "username": "Marta",
        "password": "$2a$10$hhn8vSvl6rpv42undbkQ.O5XIdIJkujyqQWqKIxRJgLQYCGlM/6rW",
        "role": "despachador"
    }
]
```

**Plates.json**
```json
[
    {   
        "_id": { "$oid": "5e606408dc8aec3040688a86" },
        "name": "Lomo saltado",
        "price": 20.00,
        "category": "fund"
    },
    {   
        "_id": { "$oid": "5e60650ea0403411bc4a332f" },
        "name": "Arroz con pollo",
        "price": 22.00,
        "category": "fund"
    },
    {   
        "_id": { "$oid": "5e6066bea0403411bc4a3333" },
        "name": "Ceviche",
        "price": 18.00,
        "category": "entry"
    },
    {   
        "_id": { "$oid": "5e6066e9a0403411bc4a3334" },
        "name": "Causa",
        "price": 18.00,
        "category": "entry"
    }
]
```

**Orders.json**

```json
[
    {
        "_id": { "$oid": "5e8186aa5d750a38e4260fcc" },
        "order_detail": [
            { "$oid": "5e606408dc8aec3040688a86" },
            { "$oid": "5e6066bea0403411bc4a3333" }
        ],
        "date": { "$date": { "$numberLong": "1583902800000" } },
        "table": { "$numberInt": "1" },
        "__v": { "$numberInt": "0" }
    },
    {
        "_id": { "$oid": "5e8187d53eda1f3a20d887e1" },
        "order_detail": [
            { "$oid": "5e60650ea0403411bc4a332f" },
            { "$oid": "5e6066e9a0403411bc4a3334" }
        ],
        "date": { "$date": { "$numberLong": "1583902800000" } },
        "table": { "$numberInt": "3" },
        "__v": { "$numberInt": "0" }
    }
]
```

### 3. Mongo-seeding-cli installation and execution
To use it in more than one project, we install it globally with this command:

```bash
npm install -g mongo-seeding-cli
```
After install, we could use the command *seed* that give us the package, to use the command we must to know  the string of conection with the database, so before we must be sure of the route to direct the data folder, in this example we're in:

```bash
$ pwd
E:\mongo-seeding\examples\import-data-json\example>
```
After to be sure the we're correctly in the route, we use the command:
```bash
$ seed -u mongodb://127.0.0.1:27017/restaurant --drop-database ./data
```

When we execute the command above, it does not give us a message but if you look at your database GUI you will notice that you already have your tables populated with the information that we have placed.


### 4. Fetch data with mongoose populate
As I mentioned that express is used, to bring the defined relation of plates and orders we must use the [populate](https://mongoosejs.com/docs/populate.html) function of mongoose, whose function would be the following:

```js
const Order = require("../models/order");
const Plate = require("../models/plate");

function getOrders(req, res) {
    Order.find({}, function(err, orders) {
        if (err) {
            throw err;
        } else {
            Plate.populate(orders, { path: "order_detail" }, function(
                err,
                orders
            ) {
                res.status(200).send(orders);
            });
        }
    });
}

module.exports = {
    getOrders,
    ... otras
}
```

To test out API, we use Postman, using the function above will return us:

```json
[
    {
        "order-detail": [
            {
                "category": "fund",
                "_id": "5e606408dc8aec3040688a86",
                "name": "Lomo saltado",
                "price": 20,
            },
            {
                "category": "entry",
                "_id": "5e6066bea0403411bc4a3333",
                "name": "Ceviche",
                "price": 18,
            }
        ],
        "_id": "5e8186aa5d750a38e4260fcc",
        "date": "2020-03-11T05:00:00.000Z",
        "table": 1,
        "__v": 0
    },
    {
        "order-detail": [
            {
                "category": "fund",
                "_id": "5e60650ea0403411bc4a332f",
                "name": "Arroz con pollo",
                "price": 22,
            },
            {
                "category": "entry",
                "_id": { "$oid": "5e6066e9a0403401bc4a3334" },
                "name": "Causa",
                "price": 18,
            }
        ],
        "_id": "5e8187d53eda1f3a20d887e1",
        "date": "2020-03-11T05:00:00.000Z",
        "table": 3,
        "__v": 0
    }
]
```

I appreciate your attention, greetings from ~ Dalthon.
