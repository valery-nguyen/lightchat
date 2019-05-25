const jwt = require("jsonwebtoken");
const key = require("../../config/keys").secretOrKey;
const User = require("../models/User");
const DirectMessage = require("../models/DirectMessage");
const Message = require("../models/Message");
const pubsub = require("../schema/pubsub");

const addMessageToDM = async (data, context) => {
  try {
    // check for loggedin user
    const token = context.token;
    
    const decoded = await jwt.verify(token, key);
    const { id } = decoded;
    const loggedIn = await User.findById(id);
    
    if (!loggedIn) {
      throw new Error("A logged in user is required");
    }

    // add direct message
    const { _id, body } = data;
    let dm = await DirectMessage.findById(_id);
    

    let newMessage = new Message({
      user_id: id,
      directMessage: _id,
      body
    });
    await newMessage.save().then(async message => {
      if (!dm.messages.includes(message._id)) dm.messages.push(message._id);
      await dm.save();
    });
    
    await pubsub.publish('DIRECT_MESSAGE_SENT', { directMessageSent: dm });

    return dm;

  } catch (err) {
    throw err;
  }
};

const createDirectMessage = async (data, context) => {
  try {
    // check for loggedin user
    const token = context.token;
    
    const decoded = await jwt.verify(token, key);
    const { id } = decoded;
    const loggedIn = await User.findById(id);
    
    if (!loggedIn) {
      throw new Error("A logged in user is required");
    }

    // add direct message
    const otheruser = data.id;
    let dm = new DirectMessage({
      users: [id, otheruser]
    });

    dm.save();

    return dm;
  } catch (err) {
    throw err;
  }
};

// gets the DM's for a user
const fetchUserMessages = async (args, context) => {
  try {
    const id = args._id;
    const loggedIn = await User.findById(id);

    if (!loggedIn) {
      throw new Error("A logged in user is required");
    }
   
    let messages = await DirectMessage.find({})
      .then(dms => dms.filter((dm) => {
        return dm.users.includes(id);
      }    
      ));  
      return messages;
  } catch (err) {
    throw err;
  }
}
  
module.exports = { addMessageToDM, createDirectMessage, fetchUserMessages };