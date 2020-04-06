const mongoose = require("mongoose");

const MenuSchema = mongoose.Schema({
    name: String,
    price: Number,
    category: {
        type: String,
        enum: ["firstCourse", "mainCourse"],
        default: "mainCourse"
    }
});

module.exports = mongoose.model("Menu", MenuSchema);