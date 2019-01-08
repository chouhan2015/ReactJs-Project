import React, { Component } from "react";
import { CONSTANTS } from "./constants";
import axios from "axios";
import TimeInput from "material-ui-time-picker";
import Grid from "@material-ui/core/Grid";
import classNames from "classnames";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

const classes = {
  textField: {
    marginLeft: 20,
    marginRight: 20,
    width: 250
  },
  button: {
    marginLeft: 20,
    marginRight: 20
  },
  heading: {
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 0
  },
  timeInput: {
    marginTop: 31,
    marginLeft: 20,
    marginRight: 20
  }
};

class AddFlight extends Component {
  constructor() {
    super();
    // this.classes = useStyles();
    this.state = {
      flightName: "",
      flightCode: "",
      destinations: [
        {
          from: "",
          to: "",
          departureTime: "",
          arrivalTime: "",
          departureDay: "",
          arrivalDay: "",
          haltTime: "",
          departureAirportName: "",
          arrivalAirportName: "",
          fare: ""
        }
      ]
    };
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  handleclickOndes = () => {
    let destinations = this.state.destinations;
    destinations.push({
      from: "",
      to: "",
      departureTime: "",
      arrivalTime: "",
      departureDay: "",
      arrivalDay: "",
      haltTime: "",
      departureAirportName: "",
      arrivalAirportName: "",
      fare: ""
    });
    this.setState({ destinations });
  };

  submit = event => {
    event.preventDefault();
    console.log(this.state);
    axios
      .post(CONSTANTS.url + "addflight", this.state)
      .then(function(response) {
        console.log(response);
        if (response.status === 200) {
          console.log("Flight Added successfully");
          alert(response.data);
        } else {
          console.log("some error ocurred", response.data.code);
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  handleclickOnRemove = index => {
    let destinations = this.state.destinations;
    destinations.splice(index, 1);
    this.setState({ destinations });
  };

  handleChangeTime = (time, name, index) => {
    let hrs = time.getHours().toString().length == 1 ? "0" + time.getHours() : time.getHours();
    let min = time.getMinutes().toString().length == 1 ? "0" + time.getMinutes() : time.getMinutes();
    let sec = time.getSeconds().toString().length == 1 ? "0" + time.getSeconds() : time.getSeconds();

    let timeInFormat = hrs + ":" + min + ":" + sec;
    let destinations = this.state.destinations;
    destinations[index][name] = timeInFormat;
    this.setState({ destinations });
  };

  handleChangeDes = (event, key) => {
    let destinations = this.state.destinations;
    destinations[key][event.target.name] = event.target.value;
    this.setState({ destinations });
  };
  render() {
    return (
      <div>
        <form autoComplete="off" onSubmit={this.submit}>
          <Grid>
            <Grid item xs={8}>
              <TextField
                id="flightName"
                label="Flight Name"
                name="flightName"
                style={classes.textField}
                value={this.state.flightName}
                onChange={this.handleChange}
                margin="normal"
                required
              />

              <TextField
                id="flightCode"
                label="Flight Code"
                name="flightCode"
                style={classes.textField}
                value={this.state.flightCode}
                onChange={this.handleChange}
                margin="normal"
                required
              />
            </Grid>
            <br />
            {this.state.destinations.map((value, key) => {
              return (
                <React.Fragment key={key}>
                  <Typography style={classes.heading} component="h1" variant="display1" gutterBottom>
                    Destinations
                  </Typography>
                  <Grid item xs={12}>
                    <TextField
                      id="from"
                      label="From"
                      name="from"
                      style={classes.textField}
                      value={this.state.from}
                      onChange={event => this.handleChangeDes(event, key)}
                      margin="normal"
                      required
                    />

                    <TextField
                      id="to"
                      label="to"
                      name="to"
                      style={classes.textField}
                      value={this.state.to}
                      onChange={event => this.handleChangeDes(event, key)}
                      margin="normal"
                      required
                    />
                    <TimeInput
                      mode="24h"
                      name="departureTime"
                      style={classes.timeInput}
                      id="departureTime"
                      placeholder="Departure Time"
                      onChange={time => this.handleChangeTime(time, "departureTime", key)}
                    />
                    <TimeInput
                      mode="24h"
                      name="arrivalTime"
                      style={classes.timeInput}
                      id="arrivalTime"
                      placeholder="Arrival Time"
                      onChange={time => this.handleChangeTime(time, "arrivalTime", key)}
                    />
                  </Grid>
                  <div>
                    <TextField
                      id="departureDay"
                      label="departureDay"
                      name="departureDay"
                      style={classes.textField}
                      value={this.state.departureDay}
                      onChange={event => this.handleChangeDes(event, key)}
                      margin="normal"
                      required
                    />
                    <TextField
                      id="arrivalDay"
                      label="arrivalDay"
                      name="arrivalDay"
                      style={classes.textField}
                      value={this.state.arrivalDay}
                      onChange={event => this.handleChangeDes(event, key)}
                      margin="normal"
                      required
                    />
                    <TextField
                      id="haltTime"
                      label="haltTime"
                      name="haltTime"
                      style={classes.textField}
                      value={this.state.haltTime}
                      onChange={event => this.handleChangeDes(event, key)}
                      margin="normal"
                      required
                    />
                  </div>
                  <div>
                    <TextField
                      id="departureAirportName"
                      label="departureAirportName"
                      name="departureAirportName"
                      style={classes.textField}
                      value={this.state.departureAirportName}
                      onChange={event => this.handleChangeDes(event, key)}
                      margin="normal"
                      required
                    />

                    <TextField
                      id="arrivalAirportName"
                      label="arrivalAirportName"
                      name="arrivalAirportName"
                      style={classes.textField}
                      value={this.state.arrivalAirportName}
                      onChange={event => this.handleChangeDes(event, key)}
                      margin="normal"
                      required
                    />
                    <TextField
                      id="fare"
                      label="fare"
                      name="fare"
                      style={classes.textField}
                      value={this.state.fare}
                      onChange={event => this.handleChangeDes(event, key)}
                      margin="normal"
                      required
                    />
                  </div>

                  {key > 0 ? (
                    <Button style={classes.button} variant="contained" color="primary" onClick={() => this.handleclickOnRemove(key)}>
                      Remove
                    </Button>
                  ) : (
                    ""
                  )}
                </React.Fragment>
              );
            })}
            <br />
            <br />
          </Grid>
          <Button style={classes.button} variant="contained" color="primary" onClick={this.handleclickOndes}>
            Add More
          </Button>
          <Button style={classes.button} variant="contained" color="primary" type="submit">
            submit
          </Button>
        </form>
      </div>
    );
  }
}

export default AddFlight;
