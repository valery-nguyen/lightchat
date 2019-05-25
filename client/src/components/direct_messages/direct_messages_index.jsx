import './direct_messages.scss';

import React from "react";
import { Query } from "react-apollo";
import DirectMessageDetail from './direct_message_detail';
import Queries from "../../graphql/queries";
import { Link } from 'react-router-dom';

const { FETCH_USER_MESSAGES } = Queries;

class DirectMessageIndex extends React.Component {
  render() {
    if (this.props.currentUserId) {
      return (
        <Query query={FETCH_USER_MESSAGES} variables={{ id: this.props.currentUserId }}>
          {({ loading, error, data }) => {
            if (loading) return null;
            if (error) return <p>Error</p>;
          
          return (
            <div className="direct-messages-list">
              <Link to={'/dms/new'} className="direct-message-header"><h5 >Direct Messages</h5><span className="add-channel-button-plus" >+</span></Link>
              {!data.fetchUserMessages || !data.fetchUserMessages.length ? (
                <p className="no-direct-messages">No Direct Messages</p>
              ) : (
                  <div>
                    {data.fetchUserMessages.map(message => {
                      return <DirectMessageDetail key={message._id} id={message._id} currentUserId={this.props.currentUserId} />;
                    })}
                  </div>
                )}
            </div>
          );
          }}
        </Query>
        )
    } else {
      return null;
    }
  }
}

export default DirectMessageIndex;