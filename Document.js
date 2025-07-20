// models/Document.js
const mongoose = require("mongoose");

const DocumentSchema = new mongoose.Schema({
  _id: String, // use socket room or docId as ID
  data: Object,
});

module.exports = mongoose.model("Document", DocumentSchema);
