import React from 'react';
import { Query, Subscription } from "react-apollo";
import Queries from "../../graphql/queries";
import Subscriptions from "../../graphql/subscriptions";
import CreateDirectMessage from './../direct_messages/create_direct_message';
import { HeaderConsole } from './../main_page/header_console';
const { FETCH_DIRECT_MESSAGES } = Queries;
const { NEW_DIRECT_MESSAGE_SUBSCRIPTION } = Subscriptions;

class DMChat extends React.Component {

  namesGetter(usersArray) {
    let names = "";
    usersArray.forEach((user) => {
      if ( !names.includes(user.name) ) {
        names += user.name;
        names += ", ";
      }
    });
    return names.slice(0, -2);
  }

  componentDidMount() {
    window.addEventListener('DOMContentLoaded', (event) => {
      console.log('DOM fully loaded and parsed');
      console.log(document.getElementById("empty"));
    });
    // let el;
    // window.onload = () => (console.log(document));
    // console.log(document);
    // console.log(el);
    // .scrollIntoView();
  }

  render() {
    return (
      <Query query={FETCH_DIRECT_MESSAGES} variables={{ id: this.props.history.location.pathname.split("/").slice(-1)[0] }}>
        {({ loading, error, data}) => {
          if (loading) return null;
          if (error) return `Error! ${error.message}`;
          if (!data) return null;
          let allMessages;
          let names;
          if (!data.directmessage) {
            allMessages = [];
            names = "";
          } else {
            allMessages = [].concat(data.directmessage.messages);
            names = this.namesGetter(data.directmessage.users);
          }
          
          let newData = data;
          let messageAuthor;
          return (
            <Subscription
              subscription={NEW_DIRECT_MESSAGE_SUBSCRIPTION}
            >
              {({ data, loading }) => {
                return (
                  <div>
                    <HeaderConsole name={names}/>
                    <div className="main-chat-window">
                      <ul className="message-list">
                        {allMessages.map((message, idx) => {
                          messageAuthor = newData.directmessage.users.filter((user) => (user._id === message.user_id))[0].name;
                          return <li className="message-element" key={idx}>
                          <div className="message-object">
                          <img className="message-pic" src={require('./pika.jpg')} alt="pika"/>
                            <div className="message-box">
                              <div className="message-info">
                                  <p className="message-author">{messageAuthor}</p>
                                <p className="message-date">{message.date}</p>
                              </div>
                              <p className="message-body">{message.body}</p>
                            </div>
                          </div>
                        </li>
                        })}
                      </ul>


                        
                        <div id={"empty"}></div>
                      <CreateDirectMessage />
                    </div>
                  </div>
                );
              }}
            </Subscription>
          );
        }}
      </Query>
    )
  }
}

export default DMChat;