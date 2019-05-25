const graphql = require("graphql");
const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLID, GraphQLFloat, GraphQLList } = graphql;
const mongoose = require("mongoose");
const UserType = require('./types/user_type');
const ChannelType = require('./types/channel_type');
const MessageType = require('./types/message_type');
const DirectMessageType = require('./types/direct_message_type');
const AuthService = require('./../services/auth');
const ChannelsService = require('./../services/channels');
const MessageService = require('./../services/messages');
const DirectMessageService = require('./../services/directmessages');

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    signup: {
      type: UserType,
      args: {
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString }
      },
      resolve(_, args) {
        return AuthService.signup(args);
      }
    },
    logout: {
      type: UserType,
      args: {
        _id: { type: GraphQLID }
      },
      resolve(_, args) {
        return AuthService.logout(args);
      }
    },
    login: {
      type: UserType,
      args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString }
      },
      resolve(_, args) {
        return AuthService.login(args);
      }
    },
    verifyUser: {
      type: UserType,
      args: {
        token: { type: GraphQLString }
      },
      resolve(_, args) {
        return AuthService.verifyUser(args);
      }
    },
    createChannel: {
      type: ChannelType,
      args: {
        name: { type: GraphQLString },
      },
      resolve(_, args, context) {
        return ChannelsService.createChannel(args, context);
      }
    },
    updateChannelName: {
      type: ChannelType,
      args: {
        _id: { type: GraphQLID },
        name: { type: GraphQLString }
      },
      resolve(_, args, context) {
        return ChannelsService.updateChannelName(args, context);
      }
    },
    addChannelUser: {
      type: ChannelType,
      args: {
        _id: { type: GraphQLID }
      },
      resolve(_, args, context) {
        return ChannelsService.addChannelUser(args, context);
      }
    },
    removeChannelUser: {
      type: ChannelType,
      args: {
        _id: { type: GraphQLID }
      },
      resolve(_, args, context) {
        return ChannelsService.removeChannelUser(args, context);
      }
    },
    addChannelMessage: {
      type: ChannelType,
      args: {
        _id: { type: GraphQLID },
        message: { type: GraphQLID }
      },
      resolve(_, args, context) {
        return ChannelsService.addChannelMessage(args, context);
      }
    },
    newMessage: {
      type: MessageType,
      args: {
        body: { type: GraphQLString },
        user_id: { type: GraphQLID },
        channel: { type: GraphQLID }
      },
      resolve(_, args, context) {
        return MessageService.addMessage(args, context);
      }
    },
    deleteMessage: {
      type: MessageType,
      args: { _id: { type: GraphQLID } },
      resolve(_, args, context) {
        return MessageService.deleteMessage(args, context);
      }
    },
    updateMessage: {
      type: MessageType,
      args: {
        _id: { type: GraphQLID },
        body: { type: GraphQLString }
      },
      resolve(_, args, context) {
        return MessageService.updateMessage(args, context);
      }
    },
    createDirectMessage: {
      type: DirectMessageType,
      args: {
        id: { type: GraphQLID }
      },
      resolve(_, args, context) {
        return DirectMessageService.createDirectMessage(args, context);
      }
    },
    addMessageToDM: {
      type: DirectMessageType,
      args: {
        _id: { type: GraphQLID },
        body: { type: GraphQLString }
      },
      resolve(_, args, context) {
        return DirectMessageService.addMessageToDM(args, context);
      }
    },
  }
});

module.exports = mutation;