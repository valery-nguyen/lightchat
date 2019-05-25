const mongoose = require("mongoose");
const graphql = require("graphql");
const graphqlisodate = require('graphql-iso-date');
const { GraphQLDateTime } = graphqlisodate;
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList } = graphql;
const Message = mongoose.model("messages");

const MessageType = new GraphQLObjectType({
  name: "MessageType",
  fields: () => ({
    _id: { type: GraphQLID },
    user_id: { type: GraphQLID },
    author: {
      type: GraphQLString,
      resolve(parentValue) {
        return Message.findAuthor(parentValue._id);
      }
    },
    channel: { type: GraphQLID },
    directMessage: { type: GraphQLID },
    body: { type: GraphQLString },
    date: { type: GraphQLDateTime }
  })
});

module.exports = MessageType;