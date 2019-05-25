const mongoose = require("mongoose");
const graphql = require("graphql");
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList } = graphql;


const DirectMessageType = new GraphQLObjectType({
  name: "DirectMessageType",
  fields: () => ({
    _id: { type: GraphQLID },
    users: {
      type: new GraphQLList(require("./user_type")),
      resolve(parentValue) {
        return DirectMessage.getUsers(parentValue._id);
      }
    },
    messages: {
      type: new GraphQLList(require("./message_type")),
      resolve(parentValue) {
        return DirectMessage.getMessages(parentValue._id);
      }
    },
  })
});

module.exports = DirectMessageType;
