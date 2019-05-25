const jwt = require("jsonwebtoken");
const key = require("../../config/keys").secretOrKey;
const User = require("../models/User");
const Channel = require("../models/Channel");
const validateChannelInput = require("../validation/create_channel");
const validateChannelUpdateInput = require("../validation/update_channel");

const createChannel = async (data, context) => {
  try {
    // check for loggedin user
    const token = context.token;

    const decoded = await jwt.verify(token, key);
    const { id } = decoded;
    const loggedIn = await User.findById(id);

    if (!loggedIn) {
      throw new Error("A logged in user is required");
    }

    // validate channel input
    const { message, isValid } = validateChannelInput(data);
    if (!isValid) {
      throw new Error(message);
    }

    // create channel
    const { name } = data;
  
    const channel = new Channel(
      {
        host_id: id,
        name: name
      },
      err => {
        if (err) throw err;
      }
    );

    channel.save();

    return { ...channel._doc };
  } catch (err) {
    throw err;
  }
};

const updateChannelName = async (data, context) => {
  try {
    // check for loggedin user
    const token = context.token;
    
    const decoded = await jwt.verify(token, key);
    const { id } = decoded;
    
    // check loggedin user is host
    const { _id } = data;
    let channel = await Channel.findById(_id);
    const host_id = channel.host_id;

    if (String(id) !== String(host_id)) {
      throw new Error("A logged in host is required");
    }

    // validate channel input
    const { message, isValid } = validateChannelUpdateInput(data);
    if (!isValid) {
      throw new Error(message);
    }

    // update channel
    const { name } = data;
    channel.name = name || channel.name;

    await channel.save();

    return { ...channel._doc };
  } catch (err) {
    throw err;
  }
};

const addChannelUser = async (data, context) => {
  try {
    // check for loggedin user
    const token = context.token;

    const decoded = await jwt.verify(token, key);
    const { id } = decoded;
    const loggedIn = await User.findById(id);
    if (!loggedIn) {
      throw new Error("A logged in user is required");
    }

    // update channel
    const { _id } = data;
    let channel = await Channel.findById(_id);

    if (!channel.users.includes(String(id))) channel.users.push(id);
    await channel.save();

    return { ...channel._doc };
  } catch (err) {
    throw err;
  }
};

const removeChannelUser = async (data, context) => {
  try {
    // check for loggedin user
    const token = context.token;

    const decoded = await jwt.verify(token, key);
    const { id } = decoded;
    const loggedIn = await User.findById(id);
    if (!loggedIn) {
      throw new Error("A logged in user is required");
    }

    // update channel
    const { _id } = data;
    let channel = await Channel.findById(_id);
    let users = channel.users;
    if (users.includes(id)) users.splice(users.indexOf(id), 1);

    channel.users = users;
    await channel.save();

    return { ...channel._doc };
  } catch (err) {
    throw err;
  }
};

//VTN: verify that addchannelMessage works when messages are ready
const addChannelMessage = async (data, context) => {
  try {
    // check for loggedin user
    const token = context.token;
    
    const decoded = await jwt.verify(token, key);
    const { id } = decoded;
    const loggedIn = await User.findById(id);
    
    if (!loggedIn) {
      throw new Error("A logged in user is required");
    }

    // update channel
    const { _id, message } = data;
    let channel = await Channel.findById(_id);
    if (!channel.messages.includes(message)) channel.messages.push(message);
    await channel.save();

    return { ...channel._doc };
  } catch (err) {
    throw err;
  }
};

module.exports = { createChannel, updateChannelName, addChannelUser, removeChannelUser, addChannelMessage };