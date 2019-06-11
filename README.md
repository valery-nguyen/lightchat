# [LightChat]

LightChat, a Slack.com clone, is an application giving users the possibility to communicate through posting on channels or sending direct messages.

![screenshot](https://user-images.githubusercontent.com/13773733/59241207-c1aa4580-8bd4-11e9-8a71-018b6f51002f.jpg)

## Built With

* [GraphQL](https://graphql.org)
* [MongoDB](https://www.mongodb.com/)
* [Express.js](https://expressjs.com/)
* [React.js](https://reactjs.org)
* [Node.js](https://nodejs.org/)

## Deployment

* [Docker](https://www.docker.com/)
* Hosted on [Heroku](https://www.heroku.com/)

## Getting Started

Check out the [wiki] for development details!

## Installation

```
git clone https://github.com/valery-nguyen/lightchat.git
cd lightchat
npm install
cd client
npm install
```

## Run

* Set up the MONGO_URI and secretOrKey

```
// config/keys_dev.js

module.exports = {
  MONGO_URI: 'mongodb+srv://...',
  secretOrKey: '...'
};
```

* Start the server and client concurrently

```
npm run dev
```

## Deployment and Release

```
heroku container:login
heroku container:push web --recursive -a lightchat-app
heroku container:release web -a lightchat-app
```

## Technical Implementation Details

* **Server side:** setting up a HTTP server to serve GraphQL queries and mutations, as well as a WebSocket server to handle subscriptions, both servers listening on one unique port

```js
// server/server.js

const express = require("express");
const  { createServer } = require("http");
const  { SubscriptionServer } = require("subscriptions-transport-ws");

const app = express();
app.use(
  "/graphql",
  expressGraphQL(req => {
    return {
      schema,
      context: {
        token: req.headers.authorization
      },
      graphiql: true
    };
  })
);

const ws = createServer(app);
SubscriptionServer.create({
  execute,
  subscribe,
  schema,
}, {
    server: ws,
    path: "/",
});

const port = process.env.PORT || 5000;
ws.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  console.log(`WebSocket listening on port ${port}`);
});
```

* **Client side:** setting up the HTTP and WebSocket links

```js
// client/src/index.js

let uri;
if (process.env.NODE_ENV === "production") {
  uri = "/graphql";
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
```

* **Server side:** subscriptions implementation

**Pubsub:**

```js
// server/schema/pubsub.js

const { PubSub } = require("apollo-server");
const pubsub = new PubSub();
module.exports = pubsub;
```

**Schema:**

```js
// server/schema/schema.js

module.exports = new GraphQLSchema({
  query,
  mutation,
  subscription
});
```

**Subscriptions:**

```js
// server/schema/subscriptions.js

const subscription = new GraphQLObjectType({
  name: "Subscription",
  fields: () => ({ messageSent, ... })
});

const messageSent = {
  type: MessageType,
  resolve(data) {
    return data.messageSent;
  },
  subscribe: withFilter(
    () => pubsub.asyncIterator(["MESSAGE_SENT"]),
    (payload, variables) => {
      return true;
    }
  )
};
```

**Publish:**

```js
// server/schema/services/messages.js

const addMessage = async (data, context) => {
  ...
  
  await pubsub.publish("MESSAGE_SENT", { messageSent: message, channel: channel});
  ...
};
```

* **Client side:** subscriptions implementation

**Subscriptions:**

```js
// client/src/graphql/subscriptions.js

export default {
  NEW_MESSAGE_SUBSCRIPTION: gql`
    subscription onMessageSent {
      messageSent {
        _id
        user_id
        body
        date
        channel
        author
      }
    }
  `,
  ...
}
```

**React component:**

```js
// client/src/components/messages/main_chat.js

<Subscription subscription={NEW_MESSAGE_SUBSCRIPTION}>
  {({ data, loading }) => {
      ...
    }
  }
</Subscription>
```

## Authors

* **Valery Nguyen**

## Acknowledgments

* The starter group project can be found [here](https://github.com/valery-nguyen/ezeechat), which was developed in collaboration with Chris Meurer and Colin Reitman.

[//]: # (reference links are listed below)
[LightChat]: <https://lightchat-app.herokuapp.com/>
[wiki]: <https://github.com/valery-nguyen/lightchat/wiki/>
