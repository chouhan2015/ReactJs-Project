import React, { Component } from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import RaisedButton from "material-ui/RaisedButton";
import TextField from "material-ui/TextField";
import axios from "axios";
import Login from "./Login";
import { Link } from "react-router-dom";
import { CONSTANTS } from "./constants";

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      password: ""
    };
  }
  style = {
    textAlign: "center"
  };

  componentWillReceiveProps(nextProps) {
    console.log("nextProps", nextProps);
  }

  handleClick(event) {
    var apiBaseUrl = CONSTANTS.url;
    var self = this;
    let strongRegexPassword = new RegExp(
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
    );
    if (!strongRegexPassword.test(this.state.password)) {
      alert(
        "Please enter Valid password. Password must contain atleast 1 lowercase, 1 Uppercase, 1 digit, 1 special character and must be 8 characters long. "
      );
      return;
    }
    let strongRegexEmail = new RegExp("(.+)@(.+){2,}.(.+){2,}");
    console.log(strongRegexEmail.test(this.state.email));
    if (!strongRegexEmail.test(this.state.email)) {
      alert("please enter valid email");
      return;
    }
    if (
      this.state.firstName &&
      this.state.lastName &&
      this.state.email &&
      this.state.password
    ) {
      var payload = {
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        email: this.state.email,
        password: this.state.password
      };
      localStorage.setItem("email", payload.email);
      axios
        .post(apiBaseUrl + "/signup", payload)
        .then(function(response) {
          console.log(response);
          if (response.status === 200) {
            console.log("registration successfull");
            sessionStorage.setItem("isLoggedIn", true);
            self.props.history.push("/Home");
            // var loginscreen = [];
            // loginscreen.push(<Login parentContext={this} appContext={self.props.appContext} />);
            // var loginmessage = "Not Registered yet.Go to registration";
            // self.props.parentContext.setState({
            //   loginscreen: loginscreen,
            //   loginmessage: loginmessage,
            //   buttonLabel: "Register",
            //   isLogin: true
            // });
          } else {
            console.log("some error ocurred", response.data.code);
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    } else {
      alert("Input field value is missing");
    }
  }

  render() {
    var userLabel;
    return (
      <div style={this.style} className="RegisterForm">
        <MuiThemeProvider>
          <div className="container">
            <div className="row justify-content-md-center">
              <div className="col-md-auto">
                <div className="card p-2 m-4">
                  <div className="card-body">
                    <h5 className="card-title">Register</h5>
                    <TextField
                      required
                      hintText="Enter your First Name"
                      floatingLabelText="First Name"
                      onChange={(event, newValue) =>
                        this.setState({ firstName: newValue })
                      }
                    />
                    <br />
                    <TextField
                      hintText="Enter your Last Name"
                      floatingLabelText="Last Name"
                      onChange={(event, newValue) =>
                        this.setState({ lastName: newValue })
                      }
                    />
                    <br />
                    <TextField
                      hintText="Enter your Email"
                      floatingLabelText={userLabel}
                      onChange={(event, newValue) =>
                        this.setState({ email: newValue })
                      }
                    />
                    <br />
                    <TextField
                      type="password"
                      hintText="Enter your Password"
                      floatingLabelText="Password"
                      onChange={(event, newValue) =>
                        this.setState({ password: newValue })
                      }
                    />
                    <br />
                    <RaisedButton
                      label="Submit"
                      disabled={
                        !(
                          this.state.firstName &&
                          this.state.lastName &&
                          this.state.email &&
                          this.state.password
                        )
                      }
                      primary={true}
                      style={style}
                      onClick={event => this.handleClick(event)}
                    />
                    <p>
                      If Already Registered Please{" "}
                      <Link to="/Login">Click here</Link> to Login
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </MuiThemeProvider>
      </div>
    );
  }
}

const style = {
  margin: 15
};

export default Register;
