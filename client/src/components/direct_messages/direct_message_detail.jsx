import React from "react";
import { Query } from "react-apollo";
import { Link } from "react-router-dom";
import Queries from "../../graphql/queries";
const { FETCH_DIRECT_MESSAGES } = Queries;


class DirectMessageDetail extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      message: ""
    };

  }

  render() {

    return (
      <Query query={FETCH_DIRECT_MESSAGES} variables={{ id: this.props.id }}>
        {({ loading, error, data }) => {
          if (loading) return null;
          if (!data.directmessage) return null;
          if (error) return <p>Error</p>;
          const receiverUserEmail =
            this.props.currentUserId ===
            data.directmessage.users[1]._id
              ? data.directmessage.users[0].email
              : data.directmessage.users[1].email;
          return (
            <div className="dm-name-container">        
              <Link className="dm-link" to={`/dms/${data.directmessage._id}`}><h3 className="dm-name" >{`${receiverUserEmail}`}</h3></Link>
            </div>
          );
        }}
      </Query>
    )
  }
}

export default DirectMessageDetail;