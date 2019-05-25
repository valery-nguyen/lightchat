const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = mongoose.model("users");

const MessageSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  channel: {
    type: Schema.Types.ObjectId,
    ref: "Channel"
  },
  directMessage: {
    type: Schema.Types.ObjectId,
    ref: "DirectMessage"
  },
  date: {
    type: Date,
    default: Date.now
  },
  body: {
    type: String,
    required: true
  }
});

MessageSchema.statics.findAuthor = function(messageId) {
  return this.findById(messageId).then(message => User.findById(message.user_id).then(user => user.name));
};

module.exports = mongoose.model("messages", MessageSchema);