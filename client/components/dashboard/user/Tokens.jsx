import request from 'superagent';
import React from 'react';

export default class AccessTokens extends React.Component {
  
  constructor(props) {
    super(props);

    this.state = { tokens: [], services: [], loading: true };
  }
  
  componentWillMount() {
    request
      .get('../api/dashboard/user/services')
      .end((err, res) => {
        this.setState(res.body);
        this._getTokens();
      });
  }

  onDelete(index) {
    const token = this.state.tokens[index];

    request
      .delete('../api/dashboard/user/tokens')
      .send({
        service: token.service_id,
        token: token.token
      })
      .end((err, res) => {
        if (!err && !res.body.error) this._getTokens();
      });
  }

  _getTokens() {
    request
      .get('../api/dashboard/user/tokens')
      .end((err, res) => {
        this.setState(res.body);

        if (this.state.loading) this.setState({ loading: false });
      });
  }
  
  render() {
    if (this.state.loading) return <div />;

    return (
      <div className='dashboard-body dashboard-tokens'>
        <section className='info'>
          <p>
            Access tokens are generated when you login to a service via Xyfir Accounts.
            <br />
            Access tokens allow previously authorized devices to access services that use Xyfir Accounts without having to login for each session.
            <br />
            It is recommended to delete any tokens you don't recognize or if one of your devices are stolen or compromised. Deleting a token only means that the device which has stored that token will have to login to the corresponding service before it can access your account.
          </p>
        </section>

        <section className='tokens'>{
          this.state.tokens.map((token, i) =>
            <div className='token' key={token.token}>
              <dl>
                <dt>Token</dt>
                <dd className='token-short'>{
                  token.token.substr(1, 10)
                }...</dd>

                <dt>Service Name</dt>
                <dd>{
                  this.state.services.find(
                    s => s.id == token.service_id
                  ).name
                }</dd>
              
                <dt>Created</dt>
                <dd>{(new Date(token.created)).toLocaleString()}</dd>

                <dt>Last Used</dt>
                <dd>{(new Date(token.last_use)).toLocaleString()}</dd>

                <dt>Expires</dt>
                <dd>{(new Date(token.expires)).toLocaleString()}</dd>
              </dl>

              <button
                className='btn-danger'
                onClick={() => this.onDelete(i)}
              >
                <span className='icon-delete' />Delete Token
              </button>
            </div>
          )
        }</section>
      </div>
    );
  }
  
}