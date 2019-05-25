import './users.scss';
import React from "react";
import { Query, Mutation } from "react-apollo";
import Queries from "../../graphql/queries";
import Mutations from '../../graphql/mutations';
import { withRouter } from "react-router";


const { FETCH_USERS, FETCH_USER_MESSAGES, CURRENT_USER } = Queries;
const { CREATE_DIRECT_MESSAGE } = Mutations;

class DirectMessageUsers extends React.Component {
  constructor(props){
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(createDirectMessage, user_id) {
    createDirectMessage({
      variables: {
        id: user_id
      } 
    }).then((data) => this.props.history.push(`/dms/${data.data.createDirectMessage._id}`));
  }

  render() {
    return <Query query={CURRENT_USER}>
      {({ data }) => {
        const currentUserId = data.currentUserId;
        return (
        <Query query={FETCH_USERS} >
          {({ loading, error, data }) => {
            if (loading) return null;
            if (error) return <p>Error</p>;
            const fetchUsersData = data;
            return (
              <Query query={FETCH_USER_MESSAGES} variables={{ id: currentUserId }}>
                {({ loading, error, data }) => {
                  if (loading) return null;
                  if (error) return <p>Error</p>;
                  const messageData = data;
                  const badUsers = messageData.fetchUserMessages.map((dm) => dm.users[1]._id)
                  return (
                    <Mutation
                      mutation={CREATE_DIRECT_MESSAGE}
                      onError={err => console.log(err.message)}
                      refetchQueries={() => [{ query: FETCH_USER_MESSAGES, variables:{ id: currentUserId } }]}
                    >
                      {(createDirectMessage, { data }) => {
                        
                        return (
                        <div className="whole-index">
                          
                          {(!fetchUsersData.users || !fetchUsersData.users.length) ? (
                            null
                          ) : (
                            badUsers.length === fetchUsersData.users.length ? (<p>Already messaging with everyone!</p>) : (
                              <div className="channel-index">
                                    <div className="channel-browse-header">
                                      <h3 className="channel-index-header">Users</h3>
                                    </div>
                                    <div>
                                      <form className="channel-search">
                                        <input
                                          placeholder="Search users (isn't working right now!)"
                                          className="channel-search-input"
                                        />
                                      </form>
                                    </div>
                                <ul>
                                  {fetchUsersData.users.map((user) => {
                                    return (
                                      !badUsers.includes(user._id) ? (<div className="channels-box" key={user._id}>
                                                                        <li key={user._id} className="dm-detail">
                                                                          <div className="channel-info-box">
                                                                            <h3 className="channel-index-name">{user.name}</h3>
                                                                            <h3 className="dm-info">{user.email}</h3>
                                                                          </div>
                                                                          <div><button className="dm-button" onClick={(e) => { e.preventDefault(); return this.handleClick(createDirectMessage, user._id) }}>Send Message</button></div>
                                                                        </li><hr/>
                                                                      </div>) : (null)
                                    );
                                  })}
                                </ul>
                              </div>
                            ))}
                            <div className="exit-div">
                              <div className="exit-box">
                                <a className="channel-index-exit" href={`/#/mainchat/`}>&#215;</a><br />
                                <p className="esc" >esc</p>
                              </div>
                            </div>  
                        </div>
                        )
                      }}
                    </Mutation>
                  );
                }}
              </Query>
            )
          }}
        </Query>
        )
    }}
    </Query>

      
  }
}

export default withRouter(DirectMessageUsers);