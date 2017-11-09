import {
  SelectField, DatePicker, TextField, Checkbox, Button, Paper, List
} from 'react-md';
import request from 'superagent';
import React from 'react';
import swal from 'sweetalert';
import crd from 'country-region-data';

const Conditional = ({show, children}) => show ? children : null;

export default class RegisterService extends React.Component {
  
  constructor(props) {
    super(props);

    const hash = location.hash.split('?')[0].split('/');

    this.state = {
      linked: false, useProfile: false, country: '',
      // #/register/:id OR #/register/service/:id
      id: hash[2] == 'service' ? hash[3] : hash[2]
    };

    /** References to input components */
    this.i = {};

    this._createSession = this._createSession.bind(this);
    this._isDisabled = this._isDisabled.bind(this);
  }
  
  componentWillMount() {
    request
      .get('api/service/' + this.state.id)
      .end((err, res) => {
        if (err || res.body.error) {
          if (err || !res.body.service) {
            location.hash = '#/';
          }
          else if (res.body.message == 'Not logged in') {
            location.hash =
              '#/login?serviceName=' +
              encodeURIComponent(res.body.service.name) +
              '&serviceUrl=' +
              encodeURIComponent(res.body.service.url);
          }
          else if (res.body.message.indexOf('already linked')) {
            this._createSession();
          }
        }
        else {
          this.setState(res.body);
        }
      });
  }
  
  /**
   * Link the user's account to the service.
   */
  onLink() {
    const data = this.state.useProfile ? {
      profile: this.i.profile.value,
      required: window['checkbox-required'].checked,
      optional: window['checkbox-optional'].checked
    } : {
      zip: !this.i.zip ? undefined : this.i.zip.value,
      email: !this.i.email ? undefined : this.i.email.value,
      fname: !this.i.fname ? undefined : this.i.fname.value,
      lname: !this.i.lname ? undefined : this.i.lname.value,
      phone: !this.i.phone ? undefined : this.i.phone.value,
      region: !this.i.region ? undefined : this.i.region.value,
      gender: !this.i.gender ? undefined : this.i.gender.value,
      country: !this.i.country ? undefined : this.state.country,
      address: !this.i.address ? undefined : this.i.address.value,
      birthdate: !this.i.birthdate ? undefined : this.i.birthdate.state.value
    };
  
    request
      .post(`api/service/${this.state.id}/link`)
      .send(data)
      .end((err, res) => {
        if (err || res.body.error)
          swal('Error', res.body.message, 'error');
        else
          this.setState({ linked: true }, () => this._createSession());
      });
  }
  
  /**
   * Creates a session linked to the user and service. Redirect the user to 
   * the service's login route.
   */
  _createSession() {
    request
      .post(`api/service/${this.state.id}/session`)
      .end((err, res) =>
        !err && location.replace(res.body.redirect)
      );
  }

  /**
   * Check if a data field should be disabled because the service does not 
   * request it.
   * @param {string} key
   * @return {boolean}
   */
  _isDisabled(key) {
    return !this.state.service.requested.required[key] &&
      !this.state.service.requested.optional[key];
  }
  
  render() {
    if (this.state.linked || !this.state.service) return null;
    
    const s = this.state.service;

    const requested = {};

    Object.keys(s.requested.required).forEach(key => (
      requested[key] = '(required) ' + s.requested.required[key]
    ));
    Object.keys(s.requested.optional).forEach(key => (
      requested[key] = '(optional) ' + s.requested.optional[key]
    ));
    
    return (
      <div className='link-service'>
        <h2 className='service-name'>
          <a href={s.url}>{s.name}</a>
        </h2>
        <p className='service-description'>{s.description}</p>

        {this.state.useProfile ? (
          <Paper
            zDepth={1}
            component='section'
            className='use-profile section flex'
          >
            <Button
              flat primary
              onClick={() => this.setState({ useProfile: false })}
            >Set Custom Data</Button>

            <SelectField
              id='select-profile'
              ref={i => this.i.profile = i}
              label='Profile'
              helpText={s.name + ' will access data from this profile'}
              menuItems={this.state.profiles}
              itemLabel='name'
              itemValue='id'
              className='md-cell'
              defaultValue={this.state.profiles[0].id}
            />
            
            <div className='checkboxes'>
              <Checkbox
                inline
                id='checkbox-required'
                ref={i => this.i.required = i}
                name='checkbox-required'
                label='Allow Access to Required Data'
                defaultChecked={true}
              />
              <Checkbox
                inline
                id='checkbox-optional'
                ref={i => this.i.optional = i}
                name='checkbox-optional'
                label='Allow Access to Optional Data'
              />
            </div>

            <Button
              raised primary
              onClick={e => this.onLink()}
            >Register</Button>
          </Paper>
        ) : (
          <Paper
            zDepth={1}
            component='section'
            className='use-custom-data section flex'
          >
            {this.state.profiles.length ? (
              <Button
                flat primary
                onClick={() => this.setState({ useProfile: true })}
              >Load From Profile</Button>
            ) : null}

            <Conditional show={!this._isDisabled('email')}>
              <TextField
                id='email--email'
                ref={i => this.i.email = i}
                type='email'
                label='Email'
                helpText={requested.email}
                className='md-cell'
                defaultValue={this.state.email}
              />
            </Conditional>
            
            <Conditional show={!this._isDisabled('fname')}>
              <TextField
                id='text--fname'
                ref={i => this.i.fname = i}
                type='text'
                label='First Name'
                helpText={requested.fname}
                className='md-cell'
              />
            </Conditional>
            
            <Conditional show={!this._isDisabled('lname')}>
              <TextField
                id='text--lname'
                ref={i => this.i.lname = i}
                type='text'
                label='Last Name'
                helpText={requested.lname}
                className='md-cell'
              />
            </Conditional>
            
            <Conditional show={!this._isDisabled('gender')}>
              <SelectField
                fullWidth
                id='select-gender'
                ref={i => this.i.gender = i}
                label='Gender'
                helpText={requested.gender}
                menuItems={[
                  { label: '-', value: 0 },
                  { label: 'Male', value: 1 },
                  { label: 'Female', value: 2 },
                  { label: 'Other', value: 3 }
                ]}
                className='md-cell'
              />
            </Conditional>
            
            <Conditional show={!this._isDisabled('phone')}>
              <TextField
                id='tel--phone'
                ref={i => this.i.phone = i}
                type='tel'
                label='Phone #'
                helpText={requested.phone}
                className='md-cell'
              />
            </Conditional>
            
            <Conditional show={!this._isDisabled('birthdate')}>
              <DatePicker
                id='date--birthdate'
                ref={i => this.i.birthdate = i}
                label='Birthdate'
                helpText={requested.birthdate}
                className='md-cell'
              />
            </Conditional>

            <Conditional show={!this._isDisabled('country')}>
              <SelectField
                fullWidth
                id='select-country'
                label='Country'
                value={this.state.country}
                helpText={requested.country}
                onChange={v => this.setState({ country: v })}
                menuItems={crd}
                itemLabel='countryName'
                itemValue='countryShortCode'
                className='md-cell'
              />
            </Conditional>
            
            <Conditional show={!this._isDisabled('region')}>
              <SelectField
                fullWidth
                id='select-region'
                ref={i => this.i.region = i}
                label='State/Province/Region'
                helpText={requested.region}
                menuItems={
                  (crd.find(c => c.countryShortCode == this.state.country) ||
                  { regions: [] }).regions
                }
                itemLabel='name'
                itemValue='shortCode'
                className='md-cell'
              />
            </Conditional>
            
            <Conditional show={!this._isDisabled('address')}>
              <TextField
                id='text--address'
                ref={i => this.i.address = i}
                type='text'
                label='Address'
                helpText={requested.address}
                className='md-cell'
              />
            </Conditional>
            
            <Conditional show={!this._isDisabled('zip')}>
              <TextField
                id='text--zip'
                ref={i => this.i.zip = i}
                type='text'
                label='Zip Code'
                helpText={requested.zip}
                className='md-cell'
              />
            </Conditional>

            <Button
              raised primary
              onClick={e => this.onLink()}
            >Register</Button>
          </Paper>
        )}
      </div>
    );
  }
  
}