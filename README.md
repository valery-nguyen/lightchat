# [LightChat]

LightChat, a Slack.com clone, is an application giving users the possibility to communicate through posting on channels or sending direct messages.

![screenshot](https://user-images.githubusercontent.com/13773733/58672477-16b4a480-8315-11e9-8779-eb32b379005a.png)

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

## Deployment

* [Docker](https://www.docker.com/)
* Hosted on [Heroku](https://www.heroku.com/)

```
heroku container:login
heroku container:push web --recursive -a lightchat-app
heroku container:release web -a lightchat-app
```

## Built With

* [GraphQL](https://graphql.org)
* [MongoDB](https://www.mongodb.com/)
* [Express.js](https://expressjs.com/)
* [React.js](https://reactjs.org)
* [Node.js](https://nodejs.org/)

## Technical Implementation Details

* Setting up a HTTP server to serve GraphQL queries and mutations, as well as a WebSocket server to handle subscriptions,
both servers listening on one unique port.

```js
// server/server.js

const express = require("express");
const  { createServer } = require('http');
const  { SubscriptionServer } = require('subscriptions-transport-ws');

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
    path: '/',
});

const port = process.env.PORT || 5000;
ws.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  console.log(`WebSocket listening on port ${port}`);
});
```

* Setting up HTTP and WebSocket links on the client side.

```js
// client/src/index.js

let uri;
if (process.env.NODE_ENV === "production") {
  uri = `/graphql`;
} else {
  uri = "http://localhost:5000/graphql";
}

const httpLink = createHttpLink({
  uri,
  headers: {
    authorization: localStorage.getItem('auth-token') || ""
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
      authorization: localStorage.getItem('auth-token') || ""
    },
  }
});

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink,
  httpLink
);
```

## Authors

* **Valery Nguyen**

## Acknowledgments

* The starter group project can be found [here](https://github.com/valery-nguyen/ezeechat), which was developed in collaboration with Chris Meurer and Colin Reitman.

[//]: # (reference links are listed below)
[LightChat]: <https://lightchat-app.herokuapp.com/>
[wiki]: <https://github.com/valery-nguyen/lightchat/wiki/>
