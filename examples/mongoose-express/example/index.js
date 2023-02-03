const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;
const Order = require('./models/order');
const app = express();

const api = express.Router();

api.get('/orders', (req, res) => {
  Order.find()
    .populate('order_detail customer')
    .exec(function (err, order) {
      if (err) return res.status(500).send(err);

      res.status(200).send(order);
    });
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(`/`, api);

mongoose.connect(
  `mongodb://localhost:27017/mydb`,
  { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
  (err) => {
    if (err) {
      throw err;
    } else {
      app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
      });
    }
  },
);
