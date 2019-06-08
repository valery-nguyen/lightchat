import "./session.scss";
import React from "react";
import { Mutation } from "react-apollo";
import { Link } from "react-router-dom";
import Mutations from "../../graphql/mutations";
const { LOGIN_USER } = Mutations;

class Login extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      email: "",
      password: ""
    };
    this.guestLogIn = this.guestLogIn.bind(this);
  }

  guestLogIn(e, loginUser) {
    e.preventDefault();
    loginUser({
      variables: {
        email: "valery@lightchat.com",
        password: "password"
      }
    });
  }

  update(field) {
    return e => this.setState({ [field]: e.target.value });
  }

  updateCache(client, { data }) {
    client.writeData({
      data: { 
        isLoggedIn: data.login.loggedIn,
        currentUserId: data.login._id
       }
    });
  }

  render() {
    return (
      <Mutation
        mutation={LOGIN_USER}
        onCompleted={data => {
          const { token, _id } = data.login;
          localStorage.setItem("auth-token", token);
          localStorage.setItem("currentUserId", _id);
          this.props.history.push("/");
        }}
        update={(client, data) => this.updateCache(client, data)}
      >
        {loginUser => (
          <div className="signup-login-form-container">
            <div className="login-header">
              <h1>LightChat</h1>
              <Link to="/signup"><p>Create a new account</p></Link>
            </div>
            <form className="signup-login-form"
              onSubmit={e => {
                e.preventDefault();
                loginUser({
                  variables: {
                    email: this.state.email,
                    password: this.state.password
                  }
                });
              }}
            >
              <h2>Sign In</h2>
              <input
                value={this.state.email}
                onChange={this.update("email")}
                placeholder="Email"
              />
              <input
                value={this.state.password}
                onChange={this.update("password")}
                type="password"
                placeholder="Password"
              />
             <button type="submit">Sign In</button>
              <div className="guest-login-container">
                <button id="guest-login" className="guest-login" onClick={e => this.guestLogIn(e, loginUser)}> Guest Log In </button>
              </div>
            </form>
            
          </div>
        )}
      </Mutation>
    );
  }
}

export default Login;