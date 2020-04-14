const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const port = process.env.PORT || 3979;
const Order = require("./models/order");
const app = express();

const api = express.Router();

api.get("/orders", (req, res) => {
    Order.find()
        .populate("order_detail customer")
        .exec(function (err, order) {
            if (err) return handleError(err);

            res.status(200).send(order);
        });
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(`/api/v1`, api);

mongoose.connect(
    `mongodb://localhost:localhost:27017/mongooseding_mongoose_express`,
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
    (err, res) => {
        if (err) {
            throw err;
        } else {
            app.listen(port, () => {
                console.log(" ••••••••••••••••••••••••••••••••••••••••••");
                console.log(` •••••• http://localhost:${port}/api/v1/ •••••`);
                console.log(" ••••••••••••••••••••••••••••••••••••••••••");
            });

            app.get("/api/v1/", (req, res) => {
                res.send(`http://localhost:${port}/api/v1/`);
            });
        }
    }
);
