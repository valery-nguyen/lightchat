# [LightChat]

LightChat, a Slack.com clone, is an application giving users the possibility to communicate through posting on channels or sending direct messages.

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

* [MongoDB](https://www.mongodb.com/)
* [Express](https://expressjs.com/)
* [React](https://reactjs.org)
* [GraphQL](https://graphql.org)
* [Node](https://nodejs.org/)

## Authors

* **Valery Nguyen**

## Acknowledgments

* The starter group project can be found [here](https://github.com/valery-nguyen/ezeechat), which was developed in collaboration with Chris Meurer and Colin Reitman.

[//]: # (reference links are listed below)
[LightChat]: <https://lightchat-app.herokuapp.com/>
[wiki]: <https://github.com/valery-nguyen/lightchat/wiki/>
