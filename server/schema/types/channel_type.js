const mongoose = require("mongoose");
const graphql = require("graphql");
const graphqlisodate = require('graphql-iso-date');
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList } = graphql;
const { GraphQLDateTime } = graphqlisodate;

const ChannelType = new GraphQLObjectType({
  name: "ChannelType",
  fields: () => ({
    _id: { type: GraphQLID },
    host_id: { type: GraphQLID },
    name: { type: GraphQLString },
    host_name: {
      type: GraphQLString,
      resolve(parentValue) {
        return Channel.findHostName(parentValue._id);
      }
    },
    created_at: { type: GraphQLDateTime },
    users: {
      type: new GraphQLList(require('./user_type')),
      resolve(parentValue) {
        return Channel.findUsers(parentValue._id);
      }
    },
    messages: {
      type: new GraphQLList(require('./message_type')),
      resolve(parentValue) {
        return Channel.findMessages(parentValue._id);
      }
    }
  })
});

module.exports = ChannelType;