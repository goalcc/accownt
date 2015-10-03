!function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a="function"==typeof require&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}for(var i="function"==typeof require&&require,o=0;o<r.length;o++)s(r[o]);return s}({1:[function(require,module,exports){var Ads=require("./dashboard/Ads.jsx"),Nav=require("./dashboard/Nav.jsx"),Account=require("./dashboard/Account.jsx"),Profiles=require("./dashboard/Profiles.jsx"),Security=require("./dashboard/Security.jsx"),Services=require("./dashboard/Services.jsx"),currentView="account",Dashboard=React.createClass({displayName:"Dashboard",getInitialState:function(){return{view:"account"}},changeView:function(view){this.setState({view:view},function(){})},render:function(){var view;switch(this.state.view){case"account":view=React.createElement(Account,null);break;case"security":view=React.createElement(Security,null);break;case"profiles":view=React.createElement(Profiles,null);break;case"services":view=React.createElement(Services,null);break;case"ads":view=React.createElement(Ads,null)}return React.createElement("div",{className:"dashboard"},React.createElement("div",{className:"dashboard-nav col-sm-12 col-md-3"},React.createElement(Nav,{onClick:this.changeView,active:this.state.view},"Account"),React.createElement(Nav,{onClick:this.changeView,active:this.state.view},"Security"),React.createElement(Nav,{onClick:this.changeView,active:this.state.view},"Profiles"),React.createElement(Nav,{onClick:this.changeView,active:this.state.view},"Services"),React.createElement(Nav,{onClick:this.changeView,active:this.state.view},"Ads")),view)}});React.render(React.createElement(Dashboard,null),$("#content"))},{"./dashboard/Account.jsx":2,"./dashboard/Ads.jsx":3,"./dashboard/Nav.jsx":4,"./dashboard/Profiles.jsx":6,"./dashboard/Security.jsx":7,"./dashboard/Services.jsx":9}],2:[function(require,module,exports){var Button=require("../forms/Button.jsx"),Alert=require("../misc/Alert.jsx");module.exports=React.createClass({displayName:"exports",getInitialState:function(){return{error:!1,message:"",email:"",recovered:!1}},componentWillMount:function(){ajax({url:"api/dashboard/account",dataType:"json",success:function(result){this.setState(result)}.bind(this)})},updatePassword:function(){var curPass=React.findDOMNode(this.refs.cpassword).value+"",newPass=React.findDOMNode(this.refs.npassword).value,conPass=React.findDOMNode(this.refs.rpassword).value;newPass!=conPass?this.setState({error:!0,message:"Passwords do not match."}):newPass.length<12?this.setState({error:!0,message:"Password needs to be at least 12 characters long."}):ajax({url:"api/dashboard/account",method:"PUT",dataType:"json",data:{currentPassword:curPass,newPassword:newPass},success:function(result){this.setState(result)}.bind(this)})},render:function(){var userAlert;return this.state.error?userAlert=React.createElement(Alert,{type:"error",title:"Error!"},this.state.message):this.state.message&&(userAlert=React.createElement(Alert,{type:"success",title:"Success!"},this.state.message)),React.createElement("div",{className:"dashboard-body col-sm-12 col-md-8"},userAlert,React.createElement("h3",null,this.state.email),React.createElement("input",{type:this.state.recovered?"hidden":"password",ref:"cpassword",placeholder:"Current Password"}),React.createElement("input",{type:"password",ref:"npassword",placeholder:"New Password"}),React.createElement("input",{type:"password",ref:"rpassword",placeholder:"Confirm"}),React.createElement(Button,{onClick:this.updatePassword},"Update Password"))}})},{"../forms/Button.jsx":10,"../misc/Alert.jsx":11}],3:[function(require,module,exports){},{}],4:[function(require,module,exports){module.exports=React.createClass({displayName:"exports",click:function(){this.props.onClick(this.props.children.toLowerCase())},render:function(){var active=this.props.children.toLowerCase()==this.props.active?" dashboard-nav-active":"";return React.createElement("div",{className:"col-sm-12"+active,onClick:this.click},this.props.children)}})},{}],5:[function(require,module,exports){var Button=require("../forms/Button.jsx");module.exports=React.createClass({displayName:"exports",getInitialState:function(){return{view:"list",profile:{}}},componentWillMount:function(){ajax({url:"api/dashboard/profiles/"+this.props.id,dataType:"json",success:function(result){this.setState({profile:result.profile})}.bind(this)})},toggleView:function(){"list"==this.state.view?this.setState({view:"full"}):this.setState({view:"list"})},deleteProfile:function(){ajax({url:"api/dashboard/profiles/"+this.props.id,method:"DELETE",dataType:"json",success:function(result){result.error||this.props.update()}.bind(this)})},updateProfile:function(){var data={name:React.findDOMNode(this.refs.name).value,email:React.findDOMNode(this.refs.email).value,fname:React.findDOMNode(this.refs.fname).value,lname:React.findDOMNode(this.refs.lname).value,gender:React.findDOMNode(this.refs.gender).value,phone:React.findDOMNode(this.refs.phone).value,birthdate:React.findDOMNode(this.refs.birthdate).value,address:React.findDOMNode(this.refs.address).value,zip:React.findDOMNode(this.refs.zip).value,region:React.findDOMNode(this.refs.region).value,country:React.findDOMNode(this.refs.country).value};ajax({url:"api/dashboard/profiles/"+this.props.id,method:"PUT",dataType:"json",data:data,success:function(result){result.error||this.props.update()}.bind(this)})},render:function(){if("list"==this.state.view)return React.createElement("div",{className:"profile-list-view"},React.createElement("h2",null,this.state.profile.name),React.createElement(Button,{type:"secondary",onClick:this.toggleView},"Edit"),React.createElement(Button,{type:"danger",onClick:this.deleteProfile},"Delete"));var p=this.state.profile;return React.createElement("div",{className:"profile-form-view"},React.createElement("h2",null,p.name),React.createElement("a",{className:"link-lg",onClick:this.toggleView},"Hide Form"),React.createElement("hr",null),React.createElement("input",{type:"text",placeholder:"Profile Name",ref:"name",defaultValue:p.name}),React.createElement("input",{type:"email",placeholder:"Email",ref:"email",defaultValue:p.email}),React.createElement("br",null),React.createElement("input",{type:"text",placeholder:"First Name",ref:"fname",defaultValue:p.fname}),React.createElement("input",{type:"text",placeholder:"Last Name",ref:"lname",defaultValue:p.lname}),React.createElement("select",{ref:"gender",defaultValue:p.gender},React.createElement("option",{value:"0"},"-"),React.createElement("option",{value:"1"},"Male"),React.createElement("option",{value:"2"},"Female"),React.createElement("option",{value:"3"},"Other")),React.createElement("input",{type:"tel",placeholder:"Phone Number",ref:"phone",defaultValue:p.phone}),React.createElement("input",{type:"text",placeholder:"Birthdate (2020-07-31)",ref:"birthdate",defaultValue:p.birthdate}),React.createElement("br",null),React.createElement("input",{type:"text",placeholder:"Address",ref:"address",defaultValue:p.address}),React.createElement("input",{type:"number",placeholder:"Zip",ref:"zip",defaultValue:p.zip}),React.createElement("input",{type:"text",placeholder:"Region/State/Province",ref:"region",defaultValue:p.region}),React.createElement("input",{type:"text",placeholder:"Country (US/CA/UK/etc)",ref:"country",defaultValue:p.country}),React.createElement(Button,{onClick:this.updateProfile},"Update Profile"))}})},{"../forms/Button.jsx":10}],6:[function(require,module,exports){var Profile=require("./Profile.jsx"),Button=require("../forms/Button.jsx"),Alert=require("../misc/Alert.jsx");module.exports=React.createClass({displayName:"exports",getInitialState:function(){return{creatingProfile:!1,profiles:[],message:"",count:0,error:!1}},updateProfiles:function(){ajax({url:"api/dashboard/profiles",dataType:"json",success:function(result){this.setState(result)}.bind(this)})},componentWillMount:function(){this.updateProfiles()},createProfile:function(){if(this.state.creatingProfile){var data={name:React.findDOMNode(this.refs.name).value,email:React.findDOMNode(this.refs.email).value,fname:React.findDOMNode(this.refs.fname).value,lname:React.findDOMNode(this.refs.lname).value,gender:React.findDOMNode(this.refs.gender).value,phone:React.findDOMNode(this.refs.phone).value,birthdate:React.findDOMNode(this.refs.birthdate).value,address:React.findDOMNode(this.refs.address).value,zip:React.findDOMNode(this.refs.zip).value,region:React.findDOMNode(this.refs.region).value,country:React.findDOMNode(this.refs.country).value};ajax({url:"api/dashboard/profiles/",method:"POST",dataType:"json",data:data,success:function(result){this.setState(result),this.setState({creatingProfile:!1}),this.updateProfiles()}.bind(this)})}else this.setState({creatingProfile:!0})},render:function(){var userAlert;this.state.error?userAlert=React.createElement(Alert,{type:"error",title:"Error!"},this.state.message):this.state.message&&(userAlert=React.createElement(Alert,{type:"success",title:"Success!"},this.state.message));var profiles=[];this.state.profiles.forEach(function(profile){profiles.push(React.createElement(Profile,{picture:profile.picture,name:profile.name,id:profile.profile_id,update:this.updateProfiles}))}.bind(this));var createProfile;return this.state.creatingProfile&&(createProfile=React.createElement("div",{className:"profile-create"},React.createElement("h2",null,"Create a Profile"),React.createElement("p",null,"All fields other than profile name are optional."),React.createElement("hr",null),React.createElement("input",{type:"text",placeholder:"Profile Name",ref:"name"}),React.createElement("input",{type:"email",placeholder:"Email",ref:"email"}),React.createElement("br",null),React.createElement("input",{type:"text",placeholder:"First Name",ref:"fname"}),React.createElement("input",{type:"text",placeholder:"Last Name",ref:"lname"}),React.createElement("select",{ref:"gender"},React.createElement("option",{value:"0"},"-"),React.createElement("option",{value:"1"},"Male"),React.createElement("option",{value:"2"},"Female"),React.createElement("option",{value:"3"},"Other")),React.createElement("input",{type:"tel",placeholder:"Phone Number",ref:"phone"}),React.createElement("input",{type:"text",placeholder:"Birthdate (2020-07-31)",ref:"birthdate"}),React.createElement("br",null),React.createElement("input",{type:"text",placeholder:"Address",ref:"address"}),React.createElement("input",{type:"number",placeholder:"Zip",ref:"zip"}),React.createElement("input",{type:"text",placeholder:"Region/State/Province",ref:"region"}),React.createElement("input",{type:"text",placeholder:"Country (US/CA/UK/etc)",ref:"country"}))),React.createElement("div",{className:"dashboard-body col-sm-12 col-md-8"},userAlert,React.createElement("h2",null,"Profiles"),React.createElement("p",null,"Profiles allow you to easily give services linked to your Xyfir Account access to required or optional information. When linking a service to your Xyfir Account you will be able to choose a profile to for the service to access."),React.createElement("hr",null),React.createElement("div",{className:"profile-list"},profiles),createProfile,React.createElement(Button,{onClick:this.createProfile},"Create Profile"))}})},{"../forms/Button.jsx":10,"../misc/Alert.jsx":11,"./Profile.jsx":5}],7:[function(require,module,exports){var Button=require("../forms/Button.jsx"),Alert=require("../misc/Alert.jsx");module.exports=React.createClass({displayName:"exports",getInitialState:function(){return{error:!1,message:"",phone:"",whitelist:"",codes:"",passwordless:0,verifyingSms:!1}},componentWillMount:function(){ajax({url:"api/dashboard/security",dataType:"json",success:function(result){this.setState(result)}.bind(this)})},updatePhone:function(){if(this.state.verifyingSms)ajax({url:"api/dashboard/security/phone/verify",method:"PUT",dataType:"json",data:{phone:React.findDOMNode(this.refs.phone).value,code:React.findDOMNode(this.refs.smsCode).value},success:function(result){this.setState(result),this.setState({verifyingSms:!1})}.bind(this)});else{var phone=React.findDOMNode(this.refs.phone).value;phone=phone?phone:0,ajax({url:"api/dashboard/security/phone",method:"PUT",dataType:"json",data:{phone:phone},success:function(result){}.bind(this)}),0!=phone&&this.setState({verifyingSms:!0})}},generateCodes:function(){ajax({url:"api/dashboard/security/codes",method:"PUT",dataType:"json",data:{type:React.findDOMNode(this.refs.codeType).value,count:React.findDOMNode(this.refs.codeCount).value},success:function(result){this.setState(result)}.bind(this)})},changeWhitelist:function(){this.setState({whitelist:this.refs.whitelist.replace("\n",",")})},updateWhitelist:function(){ajax({url:"api/dashboard/security/whitelist",method:"PUT",dataType:"json",data:{whitelist:React.findDOMNode(this.refs.whitelist).value.replace("\n",",")},success:function(result){this.setState(result)}.bind(this)})},updatePasswordless:function(){ajax({url:"api/dashboard/security/passwordless",method:"PUT",dataType:"json",data:{passwordless:React.findDOMNode(this.refs.passwordless).value},success:function(result){this.setState(result)}.bind(this)})},render:function(){var userAlert;this.state.error?userAlert=React.createElement(Alert,{type:"error",title:"Error!"},this.state.message):this.state.message&&(userAlert=React.createElement(Alert,{type:"success",title:"Success!"},this.state.message));var codes="";return this.state.codes&&(codes=[],this.state.codes.split(",").forEach(function(code){codes.push(React.createElement("li",null,code))})),React.createElement("div",{className:"dashboard-body col-sm-12 col-md-8"},userAlert,React.createElement("div",null,React.createElement("h2",null,"Two Factor Authentication"),React.createElement("p",null,"Upon login and account recovery we will send a code to your phone via SMS."),React.createElement("input",{type:"tel",ref:"phone",placeholder:this.state.phone>0?this.state.phone:"Phone #"}),this.state.verifyingSms?React.createElement("input",{type:"text",ref:"smsCode",placeholder:"Code"}):"",React.createElement(Button,{onClick:this.updatePhone},this.state.verifyingSms?"Verify Code":"Update Phone")),React.createElement("hr",null),React.createElement("div",null,React.createElement("h2",null,"Security Codes"),React.createElement("p",null,"A numbered list of 5-20 randomly generated words and/or numbers. On login and account recovery a specific code must be entered."),React.createElement("ol",null,codes),React.createElement("label",null,"Code Type"),React.createElement("select",{ref:"codeType"},React.createElement("option",{value:"1"},"Numbers"),React.createElement("option",{value:"2"},"Words"),React.createElement("option",{value:"3"},"Both")),React.createElement("label",null,"How Many?"),React.createElement("input",{type:"number",ref:"codeCount",placeholder:"10"}),React.createElement(Button,{onClick:this.generateCodes},"Generate Codes")),React.createElement("hr",null),React.createElement("div",null,React.createElement("h2",null,"IP Whitelist"),React.createElement("p",null,"Only allow logins from a list of whitelisted IP addresses.",React.createElement("br",null),React.createElement("small",null,"Each address should be separated by a new line.")),React.createElement("textarea",{value:this.state.whitelist.replace(",","\n"),onChange:this.changeWhitelist,ref:"whitelist"}),React.createElement(Button,{onClick:this.updateWhitelist},"Update Whitelist")),React.createElement("hr",null),React.createElement("div",null,React.createElement("h2",null,"Passwordless Login"),React.createElement("p",null,"Login with a link sent to your email or phone."),React.createElement("select",{ref:"passwordless"},React.createElement("option",{value:"0"},"Disabled"),React.createElement("option",{value:"1"},"Receive via SMS"),React.createElement("option",{value:"2"},"Receive via Email"),React.createElement("option",{value:"3"},"Receive via Both")),React.createElement(Button,{onClick:this.updatePasswordless},"Update")))}})},{"../forms/Button.jsx":10,"../misc/Alert.jsx":11}],8:[function(require,module,exports){var Button=require("../forms/Button.jsx"),Alert=require("../misc/Alert.jsx");module.exports=React.createClass({displayName:"exports",getInitialState:function(){return{view:"list",profiles:[],error:!1,service:{},message:""}},update:function(){ajax({url:"api/dashboard/services/"+this.props.id,dataType:"json",success:function(result){this.setState({service:result.service},function(){})}.bind(this)}),ajax({url:"api/dashboard/profiles",dataType:"json",success:function(result){this.setState({profiles:result.profiles},function(){})}.bind(this)})},componentWillMount:function(){this.update()},toggleView:function(){"list"==this.state.view?this.setState({view:"full"}):this.setState({view:"list"})},unlink:function(){ajax({url:"api/dashboard/services/"+this.props.id,method:"DELETE",dataType:"json",success:function(result){result.error||this.props.update()}.bind(this)})},updateService:function(){if(0!=React.findDOMNode(this.refs.profile).value)var data={profile:React.findDOMNode(this.refs.profile).value,required:React.findDOMNode(this.refs.profile_allow_required).checked,optional:React.findDOMNode(this.refs.profile_allow_optional).checked};else var data={email:React.findDOMNode(this.refs.email).value,fname:React.findDOMNode(this.refs.fname).value,lname:React.findDOMNode(this.refs.lname).value,gender:React.findDOMNode(this.refs.gender).value,phone:React.findDOMNode(this.refs.phone).value,birthdate:React.findDOMNode(this.refs.birthdate).value,address:React.findDOMNode(this.refs.address).value,zip:React.findDOMNode(this.refs.zip).value,region:React.findDOMNode(this.refs.region).value,country:React.findDOMNode(this.refs.country).value};ajax({url:"api/dashboard/services/"+this.props.id,method:"PUT",dataType:"json",data:data,success:function(result){this.setState(result)}.bind(this)})},render:function(){if("list"==this.state.view)return React.createElement("div",{className:"service-list-view"},React.createElement("h2",null,this.state.service.name),React.createElement(Button,{type:"secondary",onClick:this.toggleView},"Edit"),React.createElement(Button,{type:"danger",onClick:this.unlink},"Unlink"));var s=this.state.service,requiredInfo=[];for(var key in s.info.requested.required)s.info.requested.required.hasOwnProperty(key)&&requiredInfo.push(React.createElement("dl",null,React.createElement("dt",null,key),React.createElement("dd",null,s.info.requested.required[key])));var optionalInfo=[];for(var key in s.info.requested.optional)s.info.requested.optional.hasOwnProperty(key)&&optionalInfo.push(React.createElement("dl",null,React.createElement("dt",null,key),React.createElement("dd",null,s.info.requested.optional[key])));var profiles=[];this.state.profiles.forEach(function(profile){profiles.push(React.createElement("option",{value:profile.profile_id},profile.name))});var form={email:"",fname:"",lname:"",phone:"",birthdate:"",address:"",zip:"",region:"",country:"",gender:0},loadFromProfile=void 0==s.info.provided.profile?!1:!0;loadFromProfile||Object.assign(form,s.info.provided);var userAlert;return this.state.error?userAlert=React.createElement(Alert,{type:"error",title:"Error!"},this.state.message):this.state.message&&(userAlert=React.createElement(Alert,{type:"success",title:"Success!"},this.state.message)),React.createElement("div",{className:"service-form-view"},React.createElement("h2",null,s.name),React.createElement("p",null,s.description),React.createElement("a",{className:"link-lg",onClick:this.toggleView},"Hide Form"),userAlert,React.createElement("hr",null),React.createElement("div",{className:"service-info service-info-required"},React.createElement("h4",null,"required information:"),requiredInfo),React.createElement("div",{className:"service-info service-info-optional"},optionalInfo.length>0?React.createElement("h4",null,"optional information:"):"",optionalInfo),React.createElement(Button,{onClick:this.updateService},"Update Service"),React.createElement("hr",null),React.createElement("h2",null,"Load Data From Profile"),React.createElement("p",null,"Choose a profile and ",s.name," will automatically access information you allow from the profile."),React.createElement("select",{ref:"profile",className:"profile-selector",defaultValue:loadFromProfile?s.info.provided.profile:0},React.createElement("option",{value:"0"},"-"),profiles),React.createElement("input",{type:"checkbox",ref:"profile_allow_required",defaultChecked:loadFromProfile}),"Allow Access to Required Data",React.createElement("input",{type:"checkbox",ref:"profile_allow_optional",defaultChecked:loadFromProfile&&"true"==s.info.provided.optional?!0:!1}),"Allow Access to Optional Data",React.createElement("h3",null,"~~ or ~~"),React.createElement("h2",null,"Set Custom Data"),React.createElement("p",null,"Set data that only this service will be able to access."),React.createElement("input",{type:"email",placeholder:"Email",ref:"email",defaultValue:form.email}),React.createElement("br",null),React.createElement("input",{type:"text",placeholder:"First Name",ref:"fname",defaultValue:form.fname}),React.createElement("input",{type:"text",placeholder:"Last Name",ref:"lname",defaultValue:form.lname}),React.createElement("select",{ref:"gender",defaultValue:form.gender},React.createElement("option",{value:"0"},"-"),React.createElement("option",{value:"1"},"Male"),React.createElement("option",{value:"2"},"Female"),React.createElement("option",{value:"3"},"Other")),React.createElement("input",{type:"tel",placeholder:"Phone Number",ref:"phone",defaultValue:form.phone}),React.createElement("input",{type:"text",placeholder:"Birthdate (2020-07-31)",ref:"birthdate",defaultValue:form.birthdate}),React.createElement("br",null),React.createElement("input",{type:"text",placeholder:"Address",ref:"address",defaultValue:form.address}),React.createElement("input",{type:"number",placeholder:"Zip",ref:"zip",defaultValue:form.zip}),React.createElement("input",{type:"text",placeholder:"Region/State/Province",ref:"region",defaultValue:form.region}),React.createElement("input",{type:"text",placeholder:"Country (US/CA/UK/etc)",ref:"country",defaultValue:form.country}))}})},{"../forms/Button.jsx":10,"../misc/Alert.jsx":11}],9:[function(require,module,exports){var Service=require("./Service.jsx"),Button=require("../forms/Button.jsx");module.exports=React.createClass({displayName:"exports",getInitialState:function(){return{services:[]}},updateServices:function(){ajax({url:"api/dashboard/services",dataType:"json",success:function(result){this.setState(result)}.bind(this)})},componentWillMount:function(){this.updateServices()},render:function(){var services=[];return this.state.services.forEach(function(service){services.push(React.createElement(Service,{id:service.id,update:this.updateServices}))}.bind(this)),React.createElement("div",{className:"dashboard-body col-sm-12 col-md-8"},React.createElement("h2",null,"Services"),React.createElement("hr",null),React.createElement("div",{className:"service-list"},services))}})},{"../forms/Button.jsx":10,"./Service.jsx":8}],10:[function(require,module,exports){module.exports=React.createClass({displayName:"exports",getDefaultProps:function(){return{type:"primary"}},render:function(){return React.createElement("button",{className:"btn-"+this.props.type,onClick:this.props.onClick},this.props.children)}})},{}],11:[function(require,module,exports){module.exports=React.createClass({displayName:"exports",getDefaultProps:function(){return{type:"info"}},render:function(){return React.createElement("div",{className:"alert alert-"+this.props.type},React.createElement("h3",null,this.props.title),React.createElement("p",null,this.props.children))}})},{}]},{},[1]);