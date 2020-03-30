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