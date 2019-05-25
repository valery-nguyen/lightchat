import React, { Component } from "react";
import { Mutation } from "react-apollo";
import Mutations from "../../graphql/mutations";
import { withRouter } from "react-router";
const { NEW_DIRECT_MESSAGE } = Mutations;

class CreateMessage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      body: "",
      directMessage: ""
    };
  }

  update(field) {
    return e => this.setState({ [field]: e.target.value });
  }

  handleSubmit(e, addMessageToDM) {
    e.preventDefault();
    addMessageToDM({
      variables: {
        body: this.state.body,
        _id: this.props.history.location.pathname.split("/").slice(-1)[0]
      }
    });
    
    this.setState({
      body: ""
    });
  }

  render() {
    return (
      <Mutation
        mutation={NEW_DIRECT_MESSAGE}
      >
        {(addMessageToDM, { data }) => (
          <div className="send-message-form-div">
            <form className="send-message-form" onSubmit={e => this.handleSubmit(e, addMessageToDM)}>
              <input
                onChange={this.update("body")}
                value={this.state.body}
                placeholder="Send a message"
                className="message-input"
              />
            </form>
          </div>
        )}
      </Mutation>
    );
  }
}

export default withRouter(CreateMessage);