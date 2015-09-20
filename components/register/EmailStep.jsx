var Button = require("../forms/Button.jsx");

module.exports = React.createClass({

	getInitialState: function() {
		return {error: false, message: ""};
	},

	nextStep: function() {
		var email = React.findDOMNode(this.refs.email).value;
		
		// Check if email is valid
		var regex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
		if (!regex.test(email)) {
			this.setState({error: true, message: "Please enter a valid email."});
			return;
		}

		// Check if email is available
		ajax({
			url: "api/register/email/" + email,
			dataType: "text",
			success: function(result) {
				if (result == 1) {
					this.setState({error: true, message: "Email is already linked to an account."});
				}
				else {
					this.setState({error: false, message: ""});
					
					// Save email to Register's data object
					// Call Register's nextStep function
					this.props.save({email: email});
					this.props.nextStep();
				}
			}.bind(this)
		});
	},
	
	next: function(e) {
		if (e.keyCode == 13)
		 this.nextStep();
	},
	
	render: function() {
		var inputClass = "";
		if (this.state.error) inputClass = "input-error";
	
		return (
			<div className="form-step">
				<div className="form-step-header">
					<h2>Email</h2>
					<p>Your email will be used to login to your account, receive notifications, and for account recovery.</p>
					<hr />
				</div>
			
				<div className="form-step-body">
					<p className="input-error">{this.state.message}</p>
					<input type="email" placeholder="Enter your email" ref="email" className={inputClass} onKeyDown={this.next} />
				</div>
				
				<Button onClick={this.nextStep}>Next</Button>
			</div>
		);
	}
});