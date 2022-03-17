const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const SchemaModel = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "Description for the Schema",
  },
  did: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("schemas", SchemaModel);
