import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { CONSTANTS } from "./constants";
import axios from "axios";
import { Router } from "react-router-dom";
import MenuItem from "@material-ui/core/MenuItem";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import Icon from '@material-ui/core/Icon';

import RaisedButton from "material-ui/RaisedButton";
import TextField from "@material-ui/core/TextField";

const styles = theme => ({
  root: {
    display: "flex",
    flexGrow: 1
  },
  formControl: {
    margin: theme.spacing.unit * 3,
    margin: "24px 0px 24px 0px",
    width: "inherit",
    textAlign: "left"
  },
  group: {
    margin: `${theme.spacing.unit}px 0`,
    width: "auto",
    height: "auto",
    display: "flex",
    flexWrap: "nowrap",
    flexDirection: "row"
  }
});

class FilterData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      param: "status",
      value: "",
      responseFromApi: [],
      fetchedData:false
    };
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value }, result => {
    });
  };

  valueChange = event => {
    this.setState({ ["value"]: event.target.value }, result => {
    });
  };

  handleClick() {
    var apiBaseUrl = CONSTANTS.url;
    var self = this;
    var payload = {
      param: this.state.param,
      value: this.state.value
    };
    this.setState({fetchedData:false});
    if (this.state.param && this.state.value) {
      axios
        .post(apiBaseUrl + "searchTicket", payload)
        .then(response => {
          if (response.status === 200) {
              this.setState({fetchedData:true});
            
            self.setState({
              responseFromApi: response.data
            });
          } else {
            console.log("some error ocurred", response.data.code);
          }
          console.log(this.state.responseFromApi);
        })
        .catch(function (error) {
          console.log(error);
        });
       
    } else {
      alert("Input Field Is Missing")
    }

  }

  render() {
    const { classes } = this.props;
    return (
      <React.Fragment>
      <div>
        <div><h3 className="homeTitle"><i>Search Tickets</i></h3>
          <hr /></div>
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="col-12">
                <div className="row">
                  <div className="col">
                    <FormControl className="form-input">
                      <InputLabel htmlFor="age-simple">Search By</InputLabel>
                      <Select
                        value={this.state.param}
                        name="param"
                        onChange={this.handleChange}
                        inputProps={{
                          name: "param",
                          id: "param-simple"
                        }}
                      >
                        <MenuItem value={"status"}>Status</MenuItem>
                        <MenuItem value={"ticketNumber"}>Ticket Number</MenuItem>
                        <MenuItem value={"departureFlightCode"}>Flight Code</MenuItem>
                        <MenuItem value={"dateBooked"}>Booked Date</MenuItem>
                        <MenuItem value={"departureFlightName"}>Flight Name</MenuItem>
                        <MenuItem value={"from"}>Departure City</MenuItem>
                        <MenuItem value={"to"}>Arrival City</MenuItem>
                        <MenuItem value={"depcount"}>Departure Country</MenuItem>
                        <MenuItem value={"arrcount"}>Arrival Country</MenuItem>

                      </Select>
                    </FormControl>
                  </div>
                  <div className="col">
                    <TextField
                      id="standard-name"
                      label="Search Ticket By TicketNumber"
                      onChange={this.valueChange}
                      className="form-input"
                    />
                  </div>
                  <div className="col">
                    <button className="btn btn-primary" onClick={event => this.handleClick(event)}><Icon style={{ fontSize: 20, marginBottom: -3 }}>search</Icon></button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div> 
    {this.state.fetchedData ? (
      <div>
        {this.state.responseFromApi.length==0 ?(
                        <div className="data-unavailable"><h5>No Data Available for this value</h5></div>
                     ):
          (this.state.responseFromApi.map((res, k) =>{
            return (
              <div key={k + "i"}>
                  <div key={k} className="col-md-12 page-setup">
                    <div className="row">
                      <div className="col-md-12">
                        <div className="card">
                          <div className="card-header">
                            <div className="card-body">
                              <img
                                src="https://img.icons8.com/dusk/64/000000/airport.png"
                                alt="AirPlane"
                                className="airplaneImg"
                              />
                              <div className="col-md-12">
                                <span className="col-md-2">
                                  {res.departureFlightCode}
                                </span>
                                <span className="col-md-2">
                                  {res.departureFlightName}
                                </span>
                                <span className="col-md-2">
                                  Dept Date: {res.departureDate}{" "}
                                </span>
                                <span className="col-md-2">From: {res.from}</span>
                                <span className="col-md-2">To: {res.to}</span>
                                <span className="col-md-2">
                                  Status: {res.status}
                                </span>
                                <span>Booking Date : {res.dateBooked}</span>
                                <span className="col-md-2">
                                  Ticket No. {res.ticketNumber}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      </div> 
                  </div>
                </div>
                
            )
          }))} 
          </div> ) : (
            <div></div>
                     )}
    </React.Fragment>

    )
}
}

export default FilterData;
