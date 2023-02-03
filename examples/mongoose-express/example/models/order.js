const mongoose = require('mongoose');
const Menu = require('./menu');
const Customer = require('./customer');

const Schema = mongoose.Schema;

const OrderSchema = Schema({
  order_detail: [{ type: Schema.Types.ObjectId, ref: Menu }],
  customer: { type: Schema.Types.ObjectId, ref: Customer },
  date: Date,
});

module.exports = mongoose.model('Order', OrderSchema);
