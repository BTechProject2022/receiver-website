const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const CredModel = new Schema({
  name: {
    type: String,
    required: true,
  },
  credName: {
    type: String,
    default: "NA",
  },
  studentId: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  credDid: {
    type: String,
    required: true,
  },
  hash: {
    type: String,
    required: true,
  },
  sign: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("credentials", CredModel);
