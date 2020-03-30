![Mongo Seeding](https://raw.githubusercontent.com/D4ITON/mongo-seeding/master/docs/assets/logo-express-mongodb-mongoose-mongo-seeding.png)
# Como usar mongo-seeding-cli con express y mongoose

Si estas usando una base de datos no relacional como Mongodb debes tener en cuenta que tener datos de prueba es muy importante ya que nos ayuda a probar con datos muy similares al que se va a hacer uso, sin usar generadores ya que no siempre se adaptan a nuestros propósitos, por eso en este ejemplo he querido hacer un pequeño ejemplo de la importación de datos usando un sistema de backend express + mongodb + mongoose y mongo-seeding-cli.

### 1. Tener el modelo de datos
Para llenar tu base de datos mongodb, usando mongo-seeding cli, debes tener la idea del modelo de datos que requieres, por ejemplo tomemos el caso de un sistema de pedidos en un restaurante, contiene los siguientes modelos o documentos (tablas en una base de datos relacional).


**Modelo User**
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

**Modelo Order**
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

**Model Plate**
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

### 2. Tener la información
Por consiguiente debemos tener la información y esta debe estar estructurada como nos menciona Paweł, debemos ordenar los archivos según la [guia de importación de datos](https://github.com/pkosiec/mongo-seeding/blob/master/docs/import-data-definition.md), en este ejemplo usaremos la siguiente estructura:

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
Para ser más específicos con nuestro ejemplo, usaremos los siguientes datos:

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

### 3. Instalación y ejecución de mongo-seeding-cli
Para poder usarlo en más de un proyecto, instalamos el paquete globalmente con el siguiente comando:

```bash
npm install -g mongo-seeding-cli
```

Una vez instalado, lo que hacemos es ejecutar el comando seed que nos proporciona este paquete, para esto nosotros debemos averiguar el puerto de la base de datos que generalmente es 27017, debemos tener en cuenta en que ruta estamos en el CLI, en este caso estamos en

```bash
$ pwd
E:\mongo-seeding\examples\import-data-json\example>
```
Asegurándonos que estamos en la ruta para poder direccionar correctamente la carpeta data, usamos el comando:
```bash
$ seed -u mongodb://127.0.0.1:27017/restaurant --drop-database ./data
```

Cuando ejecutamos el comando de arriba, no nos da un mensaje pero si te fijas en tu GUI de base de datos notarás que ya tienes tus tablas pobladas con la información que hemos colocado.


### 4. Extra

Como mencioné que se esta usando express, para traernos la relación definida de platos y pedidos usamos la función [populate](https://mongoosejs.com/docs/populate.html) de mongoose, cuya función sería la siguiente:

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

Esta consulta nos retornará la información de la siguiente manera:

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

Agradezco su atención en este post, espero colaborar en próximos... saludos de ~Dalthon.