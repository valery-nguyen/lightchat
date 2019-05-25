import React from "react";
import { Switch } from "react-router-dom";
import AuthRoute from "../util/route_util";
import Login from "./session/Login";
import Signup from "./session/Signup";
import ChannelIndex from "./channels/ChannelIndex";
import CreateChannel from "./channels/CreateChannel";
import MainPage from './main_page/main_page';
import DMUsers from './direct_messages/direct_message_users';
import './app.scss';

const App = () => {
  return (
    <div className="app-container">
      <Switch>
        <AuthRoute exact path="/dms/new" component={DMUsers} routeType="protected" />
        <AuthRoute exact path="/channels/new" component={CreateChannel} routeType="protected" />
        <AuthRoute exact path="/channels/" component={ChannelIndex} routeType="protected" />
        <AuthRoute exact path="/signin" component={Login} routeType="auth" />
        <AuthRoute exact path="/signup" component={Signup} routeType="auth" />
        <AuthRoute path="/" component={MainPage} routeType="protected" />
      </Switch>
    </div>
  );
};

export default App;