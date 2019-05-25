const graphql = require("graphql");
const { GraphQLSchema } = graphql;
const mutation = require('./mutations');
const query = require("./types/root_query_type");
const subscription = require("./subscriptions");

module.exports = new GraphQLSchema({
  query,
  mutation,
  subscription
});