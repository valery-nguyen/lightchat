import React from "react";
import { ApolloConsumer, Query } from "react-apollo";
import { Link } from "react-router-dom";
import { withRouter } from 'react-router';
import UserChannelIndex from '../channels/UserChannelIndex';
import DirectMessageIndex from './../direct_messages/direct_messages_index';

import Queries from "../../graphql/queries";
const { IS_LOGGED_IN } = Queries;

const MainNav = props => {
  return (
    <ApolloConsumer>
      {client => (
        <div>
          <Query query={IS_LOGGED_IN}>
            {({ data }) => {
              if (data.isLoggedIn) {
                return <div className="nav">
                  <div className="left-panel">
                    <h1 className="app-header">LightChat</h1>
                    <UserChannelIndex currentUserId={props.currentUserId} />
                    <DirectMessageIndex currentUserId={props.currentUserId} />
                    <div className="log-out-button-container">
                      <button className="log-out-button"
                        onClick={e => {
                          e.preventDefault();
                          localStorage.removeItem("auth-token");
                          client.writeData({
                            data: {
                              isLoggedIn: false,
                              currentUserId: null
                            }
                          });
                          props.history.push("/");
                        }}
                      >
                        Log out
                    </button>
                    </div>
                  </div>
                </div>
              }
              else {
                return (
                  <div className="nav">
                    <Link to="/signin">Sign In</Link>
                    <Link to="/signup">Sign Up</Link>
                  </div>
                );
              }
            }}
          </Query>
        </div>
      )}
    </ApolloConsumer>
  );
};

export default withRouter(MainNav);