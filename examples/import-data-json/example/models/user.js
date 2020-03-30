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
