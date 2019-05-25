import './messages.scss';

import React, { Component } from "react";
import { Mutation } from "react-apollo";
import Queries from '../../graphql/queries';
import Mutations from "../../graphql/mutations";
import { withRouter } from 'react-router';
const { FETCH_MESSAGES } = Queries;
const { NEW_MESSAGE } = Mutations;

class CreateMessage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      body: "",
      message: "",
      channel: ""
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  update(field) {
    return e => this.setState({ [field]: e.target.value });
  }

  updateCache(cache, { data }) {
    let messages;
    try {
      messages = cache.readQuery({ query: FETCH_MESSAGES });
    } catch (err) {
      return;
    }
    if (messages) {
      let messageArray = messages.messages;
      let newMessage = data.newMessage;
      cache.writeQuery({
        query: FETCH_MESSAGES,
        data: { messages: messageArray.concat(newMessage) }
      });
    }
  }

  handleSubmit(e, newMessage) {
    e.preventDefault();
    e.stopPropagation();
    newMessage({
      variables: {
        body: this.state.body,
        user_id: "",
        channel: this.props.history.location.pathname.split("/").slice(-1)[0]
      }
    });

    this.setState({
      body: "",
      message: "",
      channel: ""
    });
  }

  render() {
    return (
      <Mutation
        mutation={NEW_MESSAGE}
        onError={err => this.setState({ message: err.message })}
        update={(cache, data) => this.updateCache(cache, data)}
      >
        {(newMessage, { data }) => (
          <div className="message-field-box">
            <div className="send-message-form-div">
              <form className="send-message-form" onSubmit={e => this.handleSubmit(e, newMessage)}>
                <input
                  onChange={this.update("body")}
                  value={this.state.body}
                  placeholder="Send a message"
                  className="message-input"
                />
              </form>
            </div>
          </div>
        )}
      </Mutation>
    );
  }
}

export default withRouter(CreateMessage);