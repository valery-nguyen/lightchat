const mongoose = require("mongoose");
const graphql = require("graphql");
const { GraphQLObjectType, GraphQLList, GraphQLID, GraphQLNonNull } = graphql;
const UserType = require("./user_type");
const User = mongoose.model("users");
const ChannelType = require("./channel_type");
const Channel = mongoose.model("Channel");
const Message = mongoose.model("messages");
const MessageType = require('./message_type');
const DirectMessageType = require('./direct_message_type');
const DirectMessage = mongoose.model("DirectMessage");
const DirectMessageService = require('./../../services/directmessages');

const RootQueryType = new GraphQLObjectType({
  name: "RootQueryType",
  fields: () => ({
    users: {
      type: new GraphQLList(UserType),
      resolve() {
        return User.find({});
      }
    },
    user: {
      type: UserType,
      args: { _id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(_, args) {
        return User.findById(args._id);
      }
    },
    channels: {
      type: new GraphQLList(ChannelType),
      resolve() {
        return Channel.find({});
      }
    },
    channel: {
      type: ChannelType,
      args: { _id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(_, args) {
        return Channel.findById(args._id);
      }
    },
    userChannels: {
      type: new GraphQLList(ChannelType),
      args: { _id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(_, args) {
        return (async () => {
          const allChannels = await Channel.find({});
          let userchannels = [];
          allChannels.forEach(ch => {
            if (ch.users.includes(args._id)) userchannels.push(ch);
          });
          return userchannels;
        })();
      }
    },
    messages: {
      type: new GraphQLList(MessageType),
      resolve() {
        return Message.find({}).populate("users");
      }
    },
    message: {
      type: MessageType,
      args: { _id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(_, args) {
        return Message.findById(args._id);
      }
    },
    directmessages: {
      type: new GraphQLList(DirectMessageType),
      resolve() {
        return DirectMessage.find({});
      }
    },
    directmessage: {
      type: DirectMessageType,
      args: { _id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(_, args) {
        return DirectMessage.findById(args._id);
      },
    },
    fetchUserMessages: {
      type: new GraphQLList(DirectMessageType),
      args: { _id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(_, args, context) {
        return DirectMessageService.fetchUserMessages(args, context);
      }
    }
  })
});

module.exports = RootQueryType;
