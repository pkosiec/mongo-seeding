const mongoose = require('mongoose');

const CustomerShema = mongoose.Schema({
  name: String,
  lastname: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
});

module.exports = mongoose.model('Customer', CustomerShema);
