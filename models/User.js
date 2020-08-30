const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// Create Schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  dateofbirth: {
    type: Date,
    required: true
  }
});


//Model
const User = mongoose.model("users", UserSchema);


module.exports =  User