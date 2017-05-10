import request from 'superagent';
import React from 'react';

export default class LoginService extends React.Component {
  
  constructor(props) {
    super(props);

    this.state = {
      message: '', service: this.props.hash[2]
    };

    this._createSession = this._createSession.bind(this);
  }
  
  /**
   * Check if user is logged in and linked to the service.
   */
  componentWillMount() {
    request
      .get('api/service/' + this.state.service)
      .end((err, res) => {
        if (err)
          location.hash = '#/';
        // User is not logged in
        // After login user will be redirect back here
        else if (res.body.error && res.body.message == 'Not logged in')
          location.hash = '#/login';
        // Create session
        else if (
          res.body.error && res.body.message.indexOf('already linked') > -1
        )
          this._createSession();
        // User hasn't linked service yet
        else
          location.hash = '#/register/' + this.state.service;
      });
  }
  
  /**
   * Creates a session linked to the user and service. Redirect the user to 
   * the service's login route.
   */
  _createSession() {
    request
      .post(`api/service/${this.state.service}/session`)
      .end((err, res) =>
        !err && location.replace(res.body.redirect)
      );
  }
  
  render() {
    return <h2>{this.state.message}</h2>;
  }
  
}