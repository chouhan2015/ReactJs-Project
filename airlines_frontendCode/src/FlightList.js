import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
// import BookFlight from "./BookFlight";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import Icon from "@material-ui/core/Icon";
const styles = {
  root: {
    flexGrow: 1
  },
  card: {
    minWidth: 100,
    border: "1px Solid Skyblue"
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)"
  },
  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  }
};

function FlightList(props) {
  const { classes } = props;
  let result;
  if (props.getData()) {
    result = props.getData().data;
  }

  let resultedObj = props.getData().data;

  if (resultedObj) {
    resultedObj = {
      departureTrip: result.departureTrip,
      returnTrip: result.returnTrip ? result.returnTrip : []
    };
  }

  function handleClick(departureTrip, returnTrip) {
    let res = {};
    if (departureTrip && returnTrip !== undefined) {
      console.log(departureTrip);
      res = {
        departureFlightCode: departureTrip.flightCode,
        departureFlightName: departureTrip.flightName,
        departureDate: departureTrip.fullDetails.seats_information.date,
        isRoundTrip: true,
        from: departureTrip.from,
        to: departureTrip.to,
        returnFlightCode: returnTrip.flightCode,
        returnFlightName: returnTrip.flightName,
        returnDate: returnTrip.fullDetails.seats_information.date,
        fare: departureTrip.fare
      };
    } else {
      res = {
        departureFlightCode: departureTrip.flightCode,
        departureFlightName: departureTrip.flightName,
        departureDate: departureTrip.fullDetails.seats_information.date,
        isRoundTrip: false,
        from: departureTrip.from,
        to: departureTrip.to,
        fare: departureTrip.fare
      };
    }
    props.setData(res);
    props.history.push("/BookFlight");
  }
  return (
    <div>
      <div>
        <h3 className="homeTitle">
          <i>Available Flight Lists</i>
        </h3>
        <hr />
      </div>
      <div className="col">
      <div className="card">
        <div className="card-body">
          <div className="row flight-table">
            <div className="col">
              <h6> <Icon  style={{ fontSize: 14,color:'grey' }}>flight_takeoff</Icon>&nbsp;Flight Name</h6>
            </div>
            <div className="col">
              <h6><Icon  style={{ fontSize: 14,color:'grey' }}>compare_arrows</Icon>&nbsp;Route</h6>
            </div>
            <div className="col">
              <h6><Icon  style={{ fontSize: 14,color:'grey' }}>access_time</Icon>&nbsp;Departure Time</h6>
            </div>
            <div className="col">
              <h6><Icon  style={{ fontSize: 14,color:'grey' }}>access_time</Icon>&nbsp;Arrival Time</h6>
            </div>
            <div className="col">
              <h6><Icon  style={{ fontSize: 14,color:'grey' }}>timer</Icon>&nbsp;Duration</h6>
            </div>
            <div className="col">
              <h6> <Icon  style={{ fontSize: 14,color:'grey' }}>airline_seat_recline_normal</Icon>&nbsp;Available Seats</h6>
            </div>
            <div className="col">
              <h6><img src="https://img.icons8.com/windows/64/000000/rupee.png" className="rupees-icon" />&nbsp;Fare</h6>
            </div>
            <div className="col">
              <h6><Icon style={{ fontSize: 14,color:'grey' }}>send</Icon>&nbsp;Action</h6>
            </div>
          </div>
          </div>
          {resultedObj.returnTrip.length > 0
          ? resultedObj.departureTrip.map((departureTrip, k) => {
              return (
                <div key={k}>
                  {" "}
                  {resultedObj.returnTrip.map((returnTrip, k) => {
                    return (
                      <div className="row" key={k} >
                        <div className="col">{departureTrip.flightName} {departureTrip.flightCode}</div>
                        <div className="col">{departureTrip.from} To {departureTrip.to}</div>
                        <div className="col">{departureTrip.departureTime}</div>
                        <div className="col">{departureTrip.arrivalTime}</div>
                        <div className="col">{departureTrip.travelTime}</div>
                        <div className="col">{departureTrip.availableseats}</div>
                        <div className="col"><img src="https://img.icons8.com/windows/64/000000/rupee.png" className="rupees-icon" />{departureTrip.fare}</div>
                        <div className="col"> <span>
                                  <button
                                    className="btn btn-primary"
                                    onClick={event =>
                                      handleClick(departureTrip, returnTrip)
                                    }
                                  >
                                    Book
                                  </button>
                                </span></div>
                      </div>
                    
                    );
                  })}
                </div>
              );
            })
          : 
            resultedObj.departureTrip.map((val, k) => {
              return (
                <div className="card"  key={k}>
                <div className="card-body flight-table-row" >
                  <div className="row">
                    <div className="col flight-table-data">{val.flightName} {val.flightCode} </div>
                    <div className="col flight-table-data">{val.from} To {val.to}</div>
                    <div className="col flight-table-data">{val.departureTime}</div>
                    <div className="col flight-table-data">{val.arrivalTime}</div>
                    <div className="col flight-table-data">{val.travelTime}&nbsp;<small>min</small></div>
                    <div className="col flight-table-data">{val.availableseats}</div>
                    <div className="col flight-table-data"><img src="https://img.icons8.com/windows/64/000000/rupee.png" className="rupees-icon" />{val.fare}</div>
                    <div className="col flight-table-data"><span>
                            <button
                              to="/BookFlight"
                              className="btn btn-primary"
                              onClick={event => handleClick(val)}
                            >
                              Book
                            </button>
                          </span></div>
                   </div>        
                </div>
                </div>
                    
              );
            })
        }    
            
           
        </div>
        </div>
      </div>
  );
}

FlightList.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(FlightList);
