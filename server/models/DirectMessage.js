const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DirectMessageSchema = new Schema({
  users: [
    {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true
    }
  ],
  messages: [{
      type: Schema.Types.ObjectId,
      ref: "messages",
      default: []
  }],
  created_at: {
    type: Date,
    default: Date.now
  }
});

// gets the users associated with a DM
DirectMessageSchema.statics.getUsers = function(directMessageId) {
  return this.findById(directMessageId)
    .populate("users")
    .then(DM => DM.users);
};

// gets the messages associated with a DM
DirectMessageSchema.statics.getMessages = function(directMessageId) {
  return this.findById(directMessageId)
    .populate("messages")
    .then(DM => DM.messages);
};



module.exports = DirectMessage = mongoose.model("DirectMessage", DirectMessageSchema);
