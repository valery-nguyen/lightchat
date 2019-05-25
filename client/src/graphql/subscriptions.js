import gql from "graphql-tag";

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
  REMOVED_MESSAGE_SUBSCRIPTION: gql`
    subscription onMessageRemoved {
      messageRemoved {
        _id
        user_id
        body
        date
        channel
        author
      }
    }
  `,
  NEW_DIRECT_MESSAGE_SUBSCRIPTION: gql`
    subscription onDirectMessageSent {
      directMessageSent {
        _id
        users {
          _id
          email
          name
        }
        messages {
          date
          body
          user_id
          author
        }
      }
    }
  `
};