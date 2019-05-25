const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = mongoose.model("users");

const ChannelSchema = new Schema({
  host_id: {
    type: Schema.Types.ObjectId,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  users: [{
    type: Schema.Types.ObjectId,
    ref: 'users',
    default: []
  }],
  messages: [{
    type: Schema.Types.ObjectId,
    ref: 'messages',
    default: []
  }],
  created_at: {
    type: Date,
    default: Date.now
  }
});

ChannelSchema.statics.findHostName = function (channelId) {
  return this.findById(channelId).then(channel => User.findById(channel.host_id).then(user => user.name));
};

ChannelSchema.statics.findUsers = function (channelId) {
  return this.findById(channelId)
    .populate("users")
    .then(channel => channel.users);
};

ChannelSchema.statics.findMessages = function (channelId) {
  return this.findById(channelId)
    .populate("messages")
    .then(channel => channel.messages);
};

module.exports = Channel = mongoose.model('Channel', ChannelSchema);