const mongoose = require("mongoose");

const CommentSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users"
  },
  comment: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  like: {
    type: [String]
  }
});

module.exports = mongoose.model("comment", CommentSchema);
