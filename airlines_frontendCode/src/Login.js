import React, { Component } from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import RaisedButton from "material-ui/RaisedButton";
import TextField from "material-ui/TextField";
import axios from "axios";
import { CONSTANTS } from "./constants";
import { Link } from "react-router-dom";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: ""
    };
  }
  style = {
    textAlign: "center"
  };

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
    var payload = {
      email: this.state.email,
      password: this.state.password
    };
    if (
      (this.state.email === "boby@gmail.com") &
      (this.state.password === "Test@1234")
    ) {
      localStorage.setItem("email", payload.email);
      axios
        .post(apiBaseUrl + "/login", payload)
        .then(function(response) {
          console.log(response);
          if (response.status === 200) {
            console.log("Login successfull");
            sessionStorage.setItem("isLoggedIn", true);
            self.props.history.push("/BookedFlightList");
          } else if (response.status === 400) {
            alert("email password do not match");
          } else {
            console.log("email does not exists");
            alert("email does not exist");
          }
        })
        .catch((error, status) => {
          console.log(error);
          console.log(status);
          alert("email password do not match");
        });
    } else {
      localStorage.setItem("email", payload.email);
      axios
        .post(apiBaseUrl + "/login", payload)
        .then(function(response) {
          console.log(response);
          if (response.status === 200) {
            console.log("Login successfull");
            sessionStorage.setItem("isLoggedIn", true);
            self.props.history.push("/Home");
          } else if (response.status === 400) {
            alert("email password do not match");
          } else {
            console.log("email does not exists");
            alert("email does not exist");
          }
        })
        .catch((error, status) => {
          console.log(error);
          console.log(status);
          alert("email password do not match");
        });
    }
  }
  render() {
    return (
      <div style={this.style}>
        <MuiThemeProvider>
          <div className="container">
            <div className="row justify-content-md-center">
              <div className="col-md-auto">
                <div className="card p-2 m-4">
                  <div className="card-body">
                    <h5 className="card-title">Login</h5>
                    <TextField
                      hintText="Enter your Email"
                      floatingLabelText="Email"
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
                      disabled={!(this.state.email && this.state.password)}
                      primary={true}
                      style={style}
                      onClick={event => this.handleClick(event)}
                    />
                  </div>
                  <p>
                    For New User Please <Link to="/">Click here</Link> to
                    Register Yourself
                  </p>
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
export default Login;
