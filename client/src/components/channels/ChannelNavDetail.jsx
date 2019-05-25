import React from "react";
import { Mutation, Query } from "react-apollo";
import { Link } from "react-router-dom";
import Queries from "../../graphql/queries";
import Mutations from "../../graphql/mutations";
import { withRouter } from "react-router";
const { FETCH_CHANNEL } = Queries;
const { REMOVE_CHANNEL_USER } = Mutations;

class ChannelNavDetail extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      message: ""
    };

    this.joinChannel = this.joinChannel.bind(this);
    this.leaveChannel = this.leaveChannel.bind(this);
  }

  joinChannel(e, addChannelUser) {
    e.preventDefault();

    addChannelUser({
      variables: {
        id: this.props.id,
      }
    });
  }

  leaveChannel(e, removeChannelUser) {
    e.preventDefault();

    removeChannelUser({
      variables: {
        id: this.props.id,
      }
    });

    window.location.reload();
  }

  render() {
    return (
      <Query query={FETCH_CHANNEL} variables={{ id: this.props.id }}>
        {({ loading, error, data }) => {
          if (loading) return null;
          if (error) return <p>Error</p>;
          return (
            <div className="channel-name-container">        
              <Link className="channel-link" to={`/channels/${data.channel._id}`}><h3 className="channel-name"># {data.channel.name}</h3> </Link>             
              <Mutation
                mutation={REMOVE_CHANNEL_USER}
                onError={err => this.setState({ message: err.message })}
                onCompleted={data => {
                  const { name } = data.removeChannelUser;
                  this.setState({
                    message: `You successfully left channel ${name}`
                  });
                }}
              >
                {(removeChannelUser, { data }) => (
                  <div>
                    <form onSubmit={e => this.leaveChannel(e, removeChannelUser)}>
                      <button className="leave-channel-button-x" type="submit">&#215;</button>
                    </form>
                    <p>{this.state.message}</p>
                  </div>
                )}
              </Mutation>
            </div>
          );
        }}
      </Query>
    )
  }
}

export default withRouter(ChannelNavDetail);