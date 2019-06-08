const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const db = require("../config/keys.js").MONGO_URI;
const expressGraphQL = require("express-graphql");
const cors = require("cors");
const User = require("./models/User");
const Channel = require("./models/Channel");
const Message = require("./models/Message");
const DirectMessage = require("./models/DirectMessage");
const schema = require("./schema/schema");
const app = express();
const path = require("path");
const  { ApolloServer, gql } = require("apollo-server-express");
const  { execute, subscribe } = require("graphql");
const  { createServer } = require("http");
const  { SubscriptionServer } = require("subscriptions-transport-ws");

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

if (!db) {
  throw new Error("You must provide a string to connect to mLab");
}

mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("Connected to MongoDB successfully"))
  .catch(err => console.log(err));

app.use(bodyParser.json());
app.use(cors());

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

module.exports = app;