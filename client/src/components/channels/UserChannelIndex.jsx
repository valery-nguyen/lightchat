import "./channels.scss";
import React from "react";
import { Query } from "react-apollo";
import ChannelNavDetail from "./ChannelNavDetail";
import Queries from "../../graphql/queries";
import { Link } from "react-router-dom";
import { withRouter } from "react-router";
const { FETCH_USER_CHANNELS } = Queries;

class UserChannelIndex extends React.Component {
  render() {
    if (this.props.currentUserId) {
      
      return <Query query={FETCH_USER_CHANNELS} variables={{ id: this.props.currentUserId }}>
        {({ data }) => {
          let name = "";
          if (data.userChannels && data.userChannels[0]) {
            data.userChannels[0].users.forEach(user => {
              if (user._id === this.props.currentUserId) name = name || user.name;
            });
          }

          return (
            <div className="channel-list">
              <h1 id="user-name"><span className="dot"></span>{name}</h1>
              <h3 className="channel-header"><Link to="/channels">Channels</Link></h3>
              {!data.userChannels || !data.userChannels.length ? (
                null
              ) : (
                  <div>
                    {data.userChannels.map(channel => {
                      return <ChannelNavDetail key={channel._id} id={channel._id} />;
                    })}
                  </div>
                )}
              <h3 ><Link id="add-a-channel" to="/channels/">+ Add a channel</Link></h3>
            </div>
          );
        }}
      </Query>
    } else {
      return null;
    }
  }
}

export default withRouter(UserChannelIndex);