import React from "react";
import PropTypes, { bool } from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import AutoComplete from "./autoComplete";
import axios from "axios";
import { CONSTANTS } from "./constants";
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

class Home extends React.Component {
  state = {
    seat: 0,
    value: "oneWay",
    //Journeytype: 'oneWay',
    names: [],
    selectedname: "",
    validationError: "",
    from: "",
    to: "",
    departureDate: "",
    returnDate: "",
    isRoundTrip: bool,
    class : "Economy"
  };
  // self;
  // constructor() {
  //   super();
  //   self = this;
  // }

  // function(searchInput) {
  //   let url = CONSTANTS.url + "getplaces?place=" + searchInput;
  // }

  componentDidMount() {
    console.log(CONSTANTS.url);
    fetch(CONSTANTS.url + "getplaces?place=Pa")
      .then(response => {
        return response.json();
      })
      .then(data => {
        let nameFromApi = data.map(name => {
          return { value: name.name, display: name.name, id: name._id };
        });
        this.setState({
          names: [{ value: "", display: "(Select your departure city)", id: 0 }].concat(nameFromApi)
        });
        console.log("state = ", this.state);
      })
      .catch(error => {
        console.log(error);
      });
    //  localStorage.setItem('email',email)
    console.log(sessionStorage.getItem("isLoggedIn"))
  }

  handleChange = event => {
    console.log(event);
    this.setState({ [event.target.name]: event.target.value }, result => {
      console.log("changed state from total seats = ", this.state);
      localStorage.setItem("class", this.state.class);
    });
  };

  handleTypeChange = event => {
    this.setState({ value: event.target.value });
  };

  handleClick(event) {
    console.log("this is handle click", this.state);
    var dpDate = this.formatDate(this.state.departureDate);
    var rpDate = this.formatDate(this.state.returnDate);
    var apiBaseUrl = CONSTANTS.url + "search/flight";
    var self = this;
    if (this.state.value === "twoWay") {
      this.state.isRoundTrip = true;
      this.state.returnDate = rpDate;
    } else {
      this.state.isRoundTrip = false;
      this.state.returnDate = "";
    }
    if (this.state.from && this.state.to && dpDate && this.state.seat) {
      var payload = {
        from: this.state.from,
        to: this.state.to,
        departureDate: dpDate,
        returnDate: rpDate,
        //returnDate: this.state.returnDate,
        totalSeats: this.state.seat,
        isRoundTrip: this.state.isRoundTrip
      };
      localStorage.setItem("totalSeats", this.state.seat);
      axios
        .post(apiBaseUrl, payload)
        .then(function (response) {
          console.log(response);
          if (response.status === 200) {
            let res = {
              otherInfo: {
                from: self.state.from,
                to: self.state.to
              },
              data: response.data
            };
            if (response.data.departureTrip.length == 0) {
              alert("No Flights Available for these Locations");
            } else {
              self.props.setData(res);
              console.log("Got the Flight Info");
              self.props.history.push("/FlightList");
            }

          }
          else {
            console.log("some error ocurred", response.data.code);
          }
        }
        )
        .catch(function (error) {
          console.log(error);
        });
    }
  }

  formatDate(date) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();
    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
    return [day, month, year].join("/");
  }

  render() {
    console.log(this.props);
    const { classes } = this.props;
    return (
      <div>
        <div><h3 className="homeTitle"><i>Search Flights</i></h3>
        <hr/></div>
        <div className="col-md-12 col-lg-12 col-sm-12 col-12">
          <div className="row">
            <div className="col-md-3 col-lg-4" />
            <div className="col-md-6 col-lg-4 search-widget">
              <div className={classes.root}>
                <FormControl component="fieldset" className={classes.formControl}>
                  <RadioGroup name="Journeytype" className={classes.group} value={this.state.value} onChange={this.handleTypeChange}>
                    <FormControlLabel value="oneWay" control={<Radio color="primary" />} label="One Way" />
                    <FormControlLabel value="twoWay" control={<Radio color="primary" />} label="Two Way" />
                  </RadioGroup>
                </FormControl>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <AutoComplete name="from" handleChange={this.handleChange} placeholder="From" />
                </div>
                <div className="col-md-6">
                  <AutoComplete name="to" handleChange={this.handleChange} placeholder="To" />
                </div>
                <div style={{ color: "red", marginTop: "5px" }}>{this.state.validationError}</div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="age-simple">Total Seats</InputLabel>
                    <Select
                      value={this.state.seat}
                      name="seat"
                      onChange={this.handleChange}
                      inputProps={{
                        name: "seat",
                        id: "seat-simple"
                      }}
                    >
                      <MenuItem value={1}>1</MenuItem>
                      <MenuItem value={2}>2</MenuItem>
                      <MenuItem value={3}>3</MenuItem>
                      <MenuItem value={4}>4</MenuItem>
                      <MenuItem value={5}>5</MenuItem>
                      <MenuItem value={6}>6</MenuItem>
                      <MenuItem value={7}>7</MenuItem>
                      <MenuItem value={8}>8</MenuItem>
                      <MenuItem value={9}>9</MenuItem>
                      <MenuItem value={10}>10</MenuItem>
                    </Select>
                  </FormControl>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="age-simple">Class</InputLabel>
                    <Select
                      value={this.state.class}
                      name="class"
                      onChange={this.handleChange}
                      inputProps={{
                        name: "class",
                        id: "class-simple"
                      }}
                    >
                      <MenuItem value={"Economy"}>Economy</MenuItem>
                      <MenuItem value={"Business"}>Business</MenuItem>
                      <MenuItem value={"First Class"}>First Class</MenuItem>
                      <MenuItem value={"Premium Economy"}>Premium Economy</MenuItem>
                    </Select>
                  </FormControl>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <input type="date" className="journeyDate" name="departureDate" onChange={this.handleChange} required />
                </div>
              </div>
              <br />
              {this.state.value === "twoWay" ? (
                <div className="row">
                  <div className="col-md-12">
                    <input className="returnDate" type="date" name="returnDate" onChange={this.handleChange} required />
                  </div>
                </div>
              ) : (
                  ""
                )}
              <br />
              <div className="row">
                <div className="col-md-12">
                  <button className="btn btn-primary submit-btn" onClick={event => this.handleClick(event)}>
                    Search Flights
                    </button>
                </div>
              </div>
            </div>
          </div>
          <div />
        </div>
      </div>
    );
  }
}

Home.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Home);
