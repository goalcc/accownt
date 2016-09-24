import React from "react";

// Components
import Profile from "./Profile";
import Button from "../forms/Button";
import Alert from "../misc/Alert";

// Modules
import request from "../../lib/request";

export default class Profiles extends React.Component {
	
	constructor(props) {
		super(props);

		this.state = {
			creatingProfile: false, profiles: [], message: "",
			count: 0, error: false
		};

		this._updateProfiles = this._updateProfiles.bind(this);
	}
	
	componentWillMount() {
		this._updateProfiles();
	}
	
	onCreateProfile() {
		const data = {
			name: this.refs.name.value,
			email: this.refs.email.value,
			fname: this.refs.fname.value,
			lname: this.refs.lname.value,
			gender: this.refs.gender.value,
			phone: this.refs.phone.value,
			birthdate: this.refs.birthdate.value,
			address: this.refs.address.value,
			zip: this.refs.zip.value,
			region: this.refs.region.value,
			country: this.refs.country.value
		};
		
		request({
			url: "../api/dashboard/profiles/",
			method: "POST", data,
			success: (result) => {
				this.setState(result);
				this.setState({creatingProfile: false});
				this._updateProfiles();
			}
		});
	}

	_updateProfiles() {
		request({
			url: "../api/dashboard/profiles",
			success: (result) => this.setState(result)
		});
	}
	
	render() {
		let userAlert;

		if (this.state.error)
			userAlert = <Alert type="error" title="Error!">{this.state.message}</Alert>;
		else if (this.state.message)
			userAlert = <Alert type="success" title="Success!">{this.state.message}</Alert>;
	
		return (
			<div className="dashboard-body dashboard-profiles">
				{userAlert}
				
				<p>
					Profiles allow you to easily give services linked to your Xyfir Account access to required or optional information. 
					When linking a service to your Xyfir Account you will be able to choose a profile to for the service to access.
				</p>
			
				<div className="profile-list">{
					this.state.profiles.map(profile => {
						return (
							<Profile
								name={profile.name}
								id={profile.profile_id}
								update={this._updateProfiles}
							/>
						);
					})
				}</div>
				
				{this.state.creatingProfile ? (
					<div className="modal profile-create">
						<a
							onClick={() => this.setState({ creatingProfile: false })}
							className="icon-close"
						/>

						<h2>Create a Profile</h2>
						<p>All fields other than profile name are optional.</p>

						<label>Profile Name</label>
						<input type="text" ref="name" />
						
						<label>Email</label>
						<input type="email" ref="email" />
						
						<br />

						<label>First Name</label>
						<input type="text" ref="fname" />
						
						<label>Last Name</label>
						<input type="text" placeholder="Last Name" ref="lname" />
						
						<label>Gender</label>
						<select ref="gender">
							<option value="0">-</option>
							<option value="1">Male</option>
							<option value="2">Female</option>
							<option value="3">Other</option>
						</select>

						<label>Phone #</label>
						<input type="tel" ref="phone" />
						
						<label>Birthdate</label>
						<input type="text" ref="birthdate" />
						
						<br />
						
						<label>Address</label>
						<input type="text" ref="address" />
						
						<label>Zip Code</label>
						<input type="number" ref="zip" />
						
						<label>State/Province/Region Code</label>
						<input type="text" ref="region" />
						
						<label>Country Code</label>
						<input type="text" ref="country" />

						<Button onClick={() => this.onCreateProfile()}>Create Profile</Button>
					</div>
				) : (
					<div />
				)}

				<Button onClick={() => this.setState({ creatingProfile: true })}>
					Create Profile
				</Button>
			</div>
		);
	}
	
}