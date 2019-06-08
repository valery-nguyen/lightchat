import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import ApolloClient from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { createHttpLink } from "apollo-link-http";
import { ApolloProvider } from "react-apollo";
import { HashRouter } from "react-router-dom";
import { split } from "apollo-link";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";
import Mutations from "./graphql/mutations";
const { VERIFY_USER } = Mutations;

const cache = new InMemoryCache({
  dataIdFromObject: object => object._id || null
});

let uri;
if (process.env.NODE_ENV === "production") {
  uri = `/graphql`;
} else {
  uri = "http://localhost:5000/graphql";
}

const httpLink = createHttpLink({
  uri,
  headers: {
    authorization: localStorage.getItem("auth-token") || ""
  }
});

let wsUri;
if (process.env.NODE_ENV === "production") {
  wsUri = "wss://" + window.location.host +  "/";
} else {
  wsUri = "ws://localhost:5000/";
}

const wsLink = new WebSocketLink({
  uri: wsUri,
  options: {
    reconnect: true,
    connectionParams: {
      authorization: localStorage.getItem("auth-token") || ""
    },
  }
});

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === "OperationDefinition" && operation === "subscription";
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  link,
  cache,
  onError: ({ networkError, graphQLErrors }) => {
    console.log("graphQLErrors", graphQLErrors);
    console.log("networkError", networkError);
  }
});

cache.writeData({
  data: {
    isLoggedIn: Boolean(localStorage.getItem("auth-token")),
    currentUserId: localStorage.getItem("currentUserId")
  }
});

const token = localStorage.getItem("auth-token");
if (token) {
  client
    .mutate({ mutation: VERIFY_USER, variables: { token } })
    .then(({ data }) => {
      cache.writeData({
        data: {
          isLoggedIn: data.verifyUser.loggedIn,
          currentUserId: data.verifyUser._id
        }
      });
    });
}

const Root = () => {
  return (
    <ApolloProvider client={client}>
      <HashRouter >
        <App />
      </HashRouter>
    </ApolloProvider>
  );
};

ReactDOM.render(<Root />, document.getElementById("root"));