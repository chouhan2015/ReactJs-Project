import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { CONSTANTS } from "./constants";
import axios from "axios";
import { Router } from "react-router-dom";
import AutoComplete from "./autoComplete";
import Icon from '@material-ui/core/Icon';

const styles = theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap"
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2
  }
});
class BookedFlightList extends React.Component {
  style = {
    marginTop: 30
  };
  constructor() {
    super();
    this.state = {
      email: localStorage.email,
      responseFromApi: []
    };
  }
  originalResponse;

  init = () => {
    var apiBaseUrl = CONSTANTS.url + "getbookedtickets";
    var self = this;
    if (this.state.email) {
      var payload = {
        emailId: this.state.email
      };
      axios
        .post(apiBaseUrl, payload)
        .then(function(response) {
          self.setState({
            responseFromApi: response.data
          });
          self.originalResponse = response.data;
          var responseFromApi = response.data;
          if (response.status === 200) {
            console.log("Fatch the Booked Tikcets");
          } else {
            console.log("some error ocurred", response.status);
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  };
  componentDidMount() {
    this.init();
  }

  componentWillMount() {
    this.setState({ responseFromApi: this.state.responseFromApi });
  }

  filterList = event => {
    let updatedList = this.originalResponse;
    if (event.target.value) {
      updatedList = updatedList.filter(function(item) {
        return (
          item.ticketNumber
            .toLowerCase()
            .search(event.target.value.toLowerCase()) !== -1
        );
      });
    }
    this.setState({ responseFromApi: updatedList });
    console.log(this.state.responseFromApi);
  };

  handleClick(event, res) {
    var apiBaseUrl = CONSTANTS.url;
    var self = this;
    if (res.departureFlightCode && res.departureDate && res.ticketNumber && res.travellers.length ) {
      var payload = {
        departureFlightCode: res.departureFlightCode,
        departureDate: res.departureDate,
        ticketNumber: res.ticketNumber,
        noOfSeats: res.travellers.length
      };
      axios
        .post(apiBaseUrl + "cancel/tickets ", payload)
        .then(response => {
          if (response.status === 200) {
            alert("Ticket Cancelled successfull");
            this.init();
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
    return (
      <React.Fragment>
        
        <div><h3 className="homeTitle"><i>Booking History</i></h3>
        <hr/></div>

        <br />
        {this.state.responseFromApi.le}
        <div className="col-md-10 md-form active-cyan active-cyan-2 mb-3">
          <input
            className="form-control"
            type="text"
            onChange={this.filterList}
            placeholder="Search Ticket By TicketNumber"
            aria-label="Search"
          />
        </div>
        {this.state.responseFromApi.length > 0 ? (
          <div>
          {this.state.responseFromApi.map((res, k) => {
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
                            {res.status === "Booked" ? (
                              <span className="fr">
                                <span className="db clearfix">
                                  <input
                                    type="button"
                                    value="Cancel Ticket"
                                    onClick={event =>
                                      this.handleClick(event, res)
                                    }
                                    className="button orange fr"
                                  />
                                </span>
                              </span>
                            ) : (
                              ""
                            )}
                            {/* <button className="btn btn-danger cancel-ticket" onClick={event => this.handleClick(event, res)}>Cancel Ticket</button> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
          </div> ): (
            <div className="data-unavailable"><h5>No Booked History Available for You</h5></div>
          )
        }
     
       
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(BookedFlightList);
