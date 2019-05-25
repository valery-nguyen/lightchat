import gql from "graphql-tag";

export default {
  LOGIN_USER: gql`
    mutation LoginUser($email: String!, $password: String!) {
      login(email: $email, password: $password) {
        token
        loggedIn
        _id
      }
    }
  `,
  SIGNUP_USER: gql`
    mutation SignupUser($email: String!, $name: String!, $password: String!) {
      signup(email: $email, name: $name, password: $password) {
        token
        loggedIn
        _id
      }
    }
  `,
  VERIFY_USER: gql`
    mutation VerifyUser($token: String!) {
      verifyUser(token: $token) {
        loggedIn
        _id
      }
    }
  `,
  CREATE_CHANNEL: gql`
    mutation createChannel($name: String) {
      createChannel(name: $name) {
        _id
        host_id
        name
      }
    }
  `,
  UPDATE_CHANNEL_NAME: gql`
    mutation updateChannelName($id: ID, $name: String) {
      updateChannelName(_id: $id, name: $name) {
        _id
        host_id
        name
      }
    }
  `,
  ADD_CHANNEL_USER: gql`
    mutation addChannelUser($id: ID) {
      addChannelUser(_id: $id) {
        _id
        host_id
        name
        users {
          _id
          name
          email
        }
      }
    }
  `,
  REMOVE_CHANNEL_USER: gql`
    mutation removeChannelUser($id: ID) {
      removeChannelUser(_id: $id) {
        _id
        host_id
        name
        users {
          _id
          name
          email
        }
      }
    }
  `,
  NEW_MESSAGE: gql`
    mutation NewMessage($user_id: ID!, $body: String!, $channel: ID!) {
      newMessage(user_id: $user_id, body: $body, channel: $channel) {
        _id
        body
        user_id
        date
        channel
      }
    }
  `,
  DELETE_MESSAGE: gql`
    mutation DeleteMessage($id: ID!) {
      deleteMessage(_id: $id) {
        _id
      }
    }
  `,
  UPDATE_MESSAGE: gql`
    mutation UpdateMessage($id: ID!, $body: String!) {
      updateMessage(id: $id, body: $body) {
        _id
        body
      }
    }
  `,
  CREATE_DIRECT_MESSAGE: gql`
    mutation CreateDirectMessage($id: ID!) {
      createDirectMessage(id: $id) {
        _id
      }
    }
  `,
  NEW_DIRECT_MESSAGE: gql`
    mutation AddMessageToDM($_id: ID!, $body: String!) {
      addMessageToDM(_id: $_id, body: $body) {
        _id
        users {
          _id
          email
        }
        messages {
          date
          body
        }
      }
    }
  `
};