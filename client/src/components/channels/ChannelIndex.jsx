import './channels.scss';

import React from "react";
import { Query } from "react-apollo";
import ChannelDetail from './ChannelDetail';
import Queries from "../../graphql/queries";
import { Link } from 'react-router-dom';

const { FETCH_CHANNELS, CURRENT_USER } = Queries;

class ChannelIndex extends React.Component {
  render() {
    return (
      <Query query={FETCH_CHANNELS}>
        {({ loading, error, data }) => {
          if (loading) return null;
          if (error) return <p>Error</p>;
          const channelData = data;
          return (
          <Query query={CURRENT_USER}>
            {({ data }) => {
              const userId = data.currentUserId;
              let inChannel = false;
              return (
                
               <div className="whole-index">
                  <div className="channel-index">
                    <div className="channel-browse-header">
                      <h3 className="channel-index-header">Browse channels</h3>

                      <Link to="/channels/new"><button className="create-channel-button">Create Channel</button></Link>
                    </div>
                  
                    <div>
                    <form className="channel-search">
                      <input
                        placeholder="Search channels"
                        className="channel-search-input"
                      />
                    </form>
                    
                    </div>
                    {!channelData.channels || !channelData.channels.length ? (
                      null
                    ) : (
                        <div>
                          {channelData.channels.map(channel => {
                            inChannel = false;
                            channel.users.forEach(user => {
                              if (user._id === userId) inChannel = true;
                            })
                            if (!inChannel) return <ChannelDetail key={channel._id} id={channel._id} userId={userId}/>;
                          })}
                        </div>
                      )}
                  </div>
                  <div className="exit-div">
                    <div className="exit-box">
                      <a className="channel-index-exit" href={`/#/mainchat/`}>&#215;</a><br/>
                      <p className="esc" >esc</p>
                    </div>
                  </div>  
                </div>
              );
            }}
          </Query>
          )
        }}
      </Query>
    )
  }
}

export default ChannelIndex;