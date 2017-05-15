import request from 'superagent';
import React from 'react';

// react-md
import TextField from 'react-md/lib/TextFields';
import Button from 'react-md/lib/Buttons/Button';

// Constants
import { GOOGLE_CLIENT_ID } from 'constants/config';

export default class LoginStep1 extends React.Component {

  constructor(props) {
    super(props);
    
    this.state = { loginAttempts: 0 };
  }

  componentDidMount() {
    gapi.load('auth2', () => {
      const auth2 = gapi.auth2.init({
        client_id: GOOGLE_CLIENT_ID,
        cookiepolicy: 'single_host_origin'
      });
      
      auth2.attachClickHandler(
        document.querySelector('.google-login'), {},
        this._googleLogin, this._googleLoginFailure
      );
    });
  }

  _googleLogin(user) {
    request
      .post('api/login/google')
      .send({
        idToken: user.getAuthResponse().id_token
      })
      .end((err, res) => {
        if (err || res.body.error)
          swal('Error', res.body.message, 'error');
        else
          location.replace(res.body.redirect || '#/dashboard/user/account');
      });
  }

  _googleLoginFailure(data) {
    console.warn('Google Login', data);
  }

  /**
   * Attempt to login using the email and password. Move data over to Step2 if 
   * any 2FA is needed.
   */
  onLogin() {
    request
      .post('api/login')
      .send({
        email: this.refs.email.getField().value,
        password: this.refs.password.getField().value
      })
      .end((err, res) => {
        const b = (res || { body: {} }).body;

        // Error with request or xyAccounts or invalid login data
        if (err || b.error) {
          this.setState({ loginAttempts: b.loginAttempts || 0 });
          swal('Error', b.message, 'error');
        }
        // Two factor authentication of some sort required
        else if (b.security) {
          this.props.save({ tfa: b });
          location.hash = '#/login/verify';
        }
        // User is logged in
        else {
          location.replace(b.redirect || '#/dashboard/user/account');
        }
      });
  }
  
  render() {
    return (
      <div className='login-1'>
        <h2>Login</h2>

        {this.state.loginAttempts > 0 ? (
          this.state.loginAttempts >= 5 ? (
            <span className='login-attempts'>
              You have hit the incorrect login attempt limit.
              <br />
              Please wait up to 15 minutes before trying again.
            </span>
          ) : (
            <span className='login-attempts'>
              {(5 - this.state.loginAttempts)} login attempt(s) remaining.
            </span>
          )
        ) : null}
        
        <form className='md-paper md-paper--1 section flex'>
          <TextField
            id='email'
            ref='email'
            type='email'
            label='Email'
            className='md-cell'
          />

          <TextField
            id='password'
            ref='password'
            type='password'
            label='Password'
            className='md-cell'
          />

          <div className='buttons'>
            <Button
              raised primary
              label='Xyfir Login'
              onClick={() => this.onLogin()}
            />

            <Button
              raised
              ref='google'
              label='Google Login'
              className='google-login'
            />
          </div>
        </form>
          
        <nav className='login-links'>
          <a href='#/register'>Create Account</a>
          <a href='#/login/recovery'>Account Recovery</a>
          <a href='#/login/passwordless'>Passwordless Login</a>
        </nav>
      </div>
    );
  }

}