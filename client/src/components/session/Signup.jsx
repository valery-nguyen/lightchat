import './session.scss';
import { Link } from 'react-router-dom';
import React, { Component } from "react";
import { Mutation } from "react-apollo";
import Mutations from "../../graphql/mutations";

const { SIGNUP_USER } = Mutations;

class Signup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      email: "",
      password: ""
    };
  }

  update(field) {
    return e => this.setState({ [field]: e.target.value });
  }

  updateCache(client, { data }) {
    client.writeData({
      data: { 
        isLoggedIn: data.signup.loggedIn,
        currentUserId: data.signup._id }
    });
  }

  render() {
    return (
      <Mutation
        mutation={SIGNUP_USER}
        onCompleted={data => {
          const { token, _id } = data.signup;
          localStorage.setItem("auth-token", token);
          localStorage.setItem('currentUserId', _id);
          this.props.history.push("/");
        }}
        update={(client, data) => this.updateCache(client, data)}
      >
        {signupUser => (
          <div className="signup-login-form-container">
            <div className="login-header">
              <h1>Welcome to LightChat</h1>
              <Link to="/signin"><p>Log In</p></Link>
            </div>
            <form className="signup-login-form"
              onSubmit={e => {
                e.preventDefault();
                signupUser({
                  variables: {
                    name: this.state.name,
                    email: this.state.email,
                    password: this.state.password
                  }
                });
              }}
            >
              <h2>Sign Up</h2>
              <input
                value={this.state.name}
                onChange={this.update("name")}
                placeholder="Name"
              />
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
              <button type="submit">Sign Up</button>
            </form>
          </div>
        )}
      </Mutation>
    );
  }
}

export default Signup;