const mongoose = require("mongoose");
const Plate = mongoose.model("Plate");
const Schema = mongoose.Schema;

const OrderSchema = Schema({
    order_detail: [{ type: Schema.Types.ObjectId, ref: Plate }],
    date: Date,
    table: Number
});

module.exports = mongoose.model("Order", OrderSchema);
