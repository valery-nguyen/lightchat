const jwt = require("jsonwebtoken");
const key = require("../../config/keys").secretOrKey;
const User = require("../models/User");
const Message = require("../models/Message");
const Channel = require("../models/Channel");
const pubsub = require('../schema/pubsub');
const channelService = require('./channels');

const addMessage = async (data, context) => {
  const token = context.token;
  const { body, channel } = data;

  const decoded = jwt.verify(token, key);
  const { id } = decoded;
  if (id) {
    let message = new Message({
      user_id: id,
      channel,
      body,
    });

    await message.save();
    await channelService.addChannelMessage({_id: channel, message: message}, context);
    await pubsub.publish('MESSAGE_SENT', { messageSent: message, channel: channel});
    return message;
  } else {
    throw new Error (
      "Sorry, you need to be logged in to send a message."
    );
  }
};

const updateMessage = async ({ id, body }) => {
  
  const updateObj = {};

  if (id) updateObj.id = id;
  if (body) updateObj.body = body;

  return Message.findOneAndUpdate({ _id: id }, { $set: updateObj }, { new: true }, (err, message) => {
    return message;
  });
};

const deleteMessage = async (data, context) => {
  try {
    // check for loggedin user
    const token = context.token;

    const decoded = await jwt.verify(token, key);
    const { id } = decoded;

    // update channel / delete message
    const { _id } = data;
    let message = await Message.findById(_id);

    if (message.user_id != id) {
      throw new Error("Cannot delete messages that are not your own");
    }
    
    let channel = await Channel.findById(message.channel);
    let messages = channel.messages;

    if (messages.includes(_id)) messages.splice(messages.indexOf(_id), 1);

    channel.messages = messages;
    await channel.save();
    await message.remove();
    await pubsub.publish('MESSAGE_REMOVED', { messageRemoved: message, channel: channel });

    return message;
  } catch (err) {
    throw err;
  }
};



module.exports = { addMessage, updateMessage, deleteMessage };

