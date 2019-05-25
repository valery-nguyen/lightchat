const graphql = require("graphql");
const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLID, GraphQLFloat } = graphql;
const { withFilter } = require('apollo-server');
const mongoose = require("mongoose");
const MessageType = require('./types/message_type');
const Message = mongoose.model("messages");
const DirectMessageType = require("./types/direct_message_type");
const DirectMessage = mongoose.model("DirectMessage");
const pubsub = require('./pubsub');

const messageSent = {
  type: MessageType,
  resolve(data) {
    return data.messageSent;
  },
  subscribe: withFilter(
    () => pubsub.asyncIterator(['MESSAGE_SENT']),
    (payload, variables) => {
      return true;
    }
  )
};

const messageRemoved = {
  type: MessageType,
  resolve(data) {
    return data.messageRemoved;
  },
  subscribe: withFilter(
    () => pubsub.asyncIterator(['MESSAGE_REMOVED']),
    (payload, variables) => {
      return true;
    }
  )
};

const directMessageSent = {
  type: DirectMessageType,
  resolve(data) {
    return data.directMessageSent;
  },
  subscribe: withFilter(
    () => pubsub.asyncIterator(["DIRECT_MESSAGE_SENT"]),
    (payload, variables) => {
      return true;
    }
  )
};


const subscription = new GraphQLObjectType({
  name: "Subscription",
  fields: () => ({ messageSent, messageRemoved, directMessageSent })
});

module.exports = subscription;