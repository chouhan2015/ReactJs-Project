import React from "react";
import PropTypes, { bool } from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import TextField from 'material-ui/TextField';
import { CONSTANTS } from "./constants"
import axios from 'axios';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import RaisedButton from "material-ui/RaisedButton";


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
    },
    paper: {
        position: 'absolute',
        width: theme.spacing.unit * 50,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing.unit * 4,
    },
    style: {
        marginTop: 47
    }
});
function rand() {
    return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
    const top = 50 + rand();
    const left = 50 + rand();

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}


class BookFlight extends React.Component {
    state = {
        // type: "",
        from: "",
        to: "",
        departureFlightCode: "",
        departureFlightName: "",
        departureDate: "",
        isRoundTrip: bool,
        returnDate: "",
        returnFlightCode: "",
        returnFlightName: "",
        // name : "",
        // age : "",
        fare: 0,
        noOfSeats: localStorage.totalSeats,
        open: false,
        status: "",
        ticketNumber: "",
        class: localStorage.class,
        travellers: [{
            name: "",
            age: "",
            type: ""

        }]
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    componentDidMount(props) {
        console.log(this.props)
        let result;
        if (this.props.getData()) {
            result = this.props.getData();
            console.log(result);
        }
        this.setState({
            departureDate: result.departureDate,
            departureFlightCode: result.departureFlightCode,
            departureFlightName: result.departureFlightName,
            from: result.from,
            to: result.to,
            isRoundTrip: result.isRoundTrip,
            returnDate: result.returnDate,
            returnFlightCode: result.returnFlightCode,
            returnFlightName: result.returnFlightName,
            fare: result.fare
        })
    }

    style = {
        marginTop: 30
    }
    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    handleOpen = () => {
        this.setState({ open: true });
    };

    handleRedirect = (event) => {
        this.props.history.push("/BookedFlightList");
    }

    handleClick(event) {
        var apiBaseUrl = CONSTANTS.url;
        var self = this;
        if (this.state.travellers.length > 0) {
            var payload = {
                "from": this.state.from,
                "to": this.state.to,
                "departureFlightCode": this.state.departureFlightCode,
                "departureFlightName": this.state.departureFlightName,
                "returnFlightname": this.state.returnFlightName,
                "departureDate": this.state.departureDate,
                "returnFlightCode": this.state.returnFlightCode,
                "returnDate": this.state.returnDate,
                "isRoundTrip": this.state.isRoundTrip,
                "noOfSeats": this.state.travellers.length,
                "emailId": localStorage.email,
                "disableAddButton": false,
                "travellers": this.state.travellers,
                "class": this.state.class
            }
            axios.post(apiBaseUrl + 'book/tickets', payload)
                .then((response) => {
                    response.data.map((value) => {
                        this.setState({
                            status: value.status,
                            ticketNumber: value.ticketNumber
                        })
                    })
                    if (response.status === 200) {
                        console.log("Flight Booked successfull");
                        this.handleOpen();
                    }

                    else {
                        console.log("some error ocurred", response.data.code);
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
        else {
            alert("Input field value is missing");
        }



    }

    handleTravellers = (index, key, value) => {
        let ts = this.state.travellers;
        ts[index][key] = value;
        this.setState({ travellers: ts })
    }

    addNewPassenger = () => {
        if (this.state.travellers.length < this.state.noOfSeats) {
            let ts = this.state.travellers;
            ts.push({
                "name": "",
                "age": "",
                "type": ""
            })
            this.setState({ travellers: ts })
            if (ts.length == this.state.noOfSeats) {
                this.setState({ disableAddButton: true });
            }
        }

    }

    render() {
        const { classes } = this.props;

        return (
            <MuiThemeProvider>
                <div><h3 className="homeTitle"><i>Book Flight</i></h3>
                    <hr />
                </div>
                <div>
                    <div className="col-md-12">
                        <div className="row">
                            <div className="col-md-9 " style={this.style}>
                                <div className="card">
                                    <div className="card-header">
                                        {this.state.from} - {this.state.to} On {this.state.departureDate}
                                    </div>
                                    <div className="card-body">
                                        <h5 className="card-text">{this.state.departureDate}<span className="BookingDetail">{this.state.departureDate}</span><br />{this.state.from}<span className="BookingDetail">{this.state.to}</span>
                                        </h5>
                                    </div>
                                </div>

                            </div>
                            <div className="col-md-3 " style={this.style}>
                                <div className="card">
                                    <div className="card-header">
                                        Fair Detail
                                    </div>
                                    <div className="card-body">
                                        <p className="card-text">Fare &nbsp;: <span  className="fare"><img src="https://img.icons8.com/windows/64/000000/rupee.png" className="rupees-icon" />{this.state.fare}</span></p>
                                        <p className="card-text">Other Charges &nbsp;:<span className="fare-other"><img src="https://img.icons8.com/windows/64/000000/rupee.png" className="rupees-icon" />0.00</span></p> <hr />
                                        <span><input type="button" className="button orange fr" value="Total Fare" /><img src="https://img.icons8.com/windows/64/000000/rupee.png" className="rupees-icon" />{this.state.fare}</span>

                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="col-md-12">
                        <div className="row">
                            <div className="col-md-12" style={this.style}>
                                <div className="card">
                                    <div className="card-header">
                                        Traveller Details
                                </div>
                                    <div className="card-body">
                                        <div>
                                            <h5 className="card-title">Please Fill Travellers Detail below</h5>
                                            {this.state.travellers.map((res, k) => {
                                                return (
                                                    <div className="col-md-12 travellers-section" key={k}>
                                                        <span className="col-md-4">
                                                            <TextField
                                                                hintText="Enter your Name"
                                                                floatingLabelText="Name"
                                                                onChange={(event, newValue) => this.handleTravellers(k, "name", newValue)}
                                                            />
                                                        </span>
                                                        <span className="col-md-4">
                                                            <TextField
                                                                hintText="Enter your Age"
                                                                floatingLabelText="Age"
                                                                onChange={(event, newValue) => this.handleTravellers(k, "age", newValue)}
                                                            />
                                                        </span>
                                                        <span className="col-md-4">
                                                            <FormControl className={classes.formControl}>
                                                                <InputLabel htmlFor="type-simple">Type</InputLabel>
                                                                <Select
                                                                    value={this.state.travellers[k].type}
                                                                    onChange={(event, newValue) => this.handleTravellers(k, "type", event.target.value)}
                                                                    inputProps={{
                                                                        name: "type",
                                                                        id: "type-simple"
                                                                    }}
                                                                >
                                                                    <MenuItem value="">
                                                                        <em>None</em>
                                                                    </MenuItem>
                                                                    <MenuItem value={'adult'}>Adult</MenuItem>
                                                                    <MenuItem value={'children'}>Children</MenuItem>
                                                                    <MenuItem value={'seniorCitizen'}>Senior Citizen</MenuItem>
                                                                </Select>
                                                            </FormControl>

                                                        </span>


                                                    </div>
                                                );
                                            })
                                            }
                                        </div>
                                        <RaisedButton
                                            label="Add New passenger"
                                            disabled={(this.state.disableAddButton)}
                                            primary={true}
                                            style={this.style}
                                            onClick={this.addNewPassenger}
                                        />

                                        {/* <button className="btn btn-primary" onClick={(event) => this.handleClick(event)}>Proceed TO Book</button> */}
                                        {/* <span className="fr"><span className="db clearfix">
                                            <button value="Proceed TO Book" onClick={(event) => this.handleClick(event)}
                                                className="button orange fr">Proceed TO Book </button>
                                        </span>
                                        </span> */}
                                        <span ><button className="btn btn-danger" onClick={(event) => this.handleClick(event)}>Proceed TO Book</button></span>
                                        <Modal
                                            aria-labelledby="simple-modal-title"
                                            aria-describedby="simple-modal-description"
                                            open={this.state.open}
                                            onClose={this.handleClose}
                                        >
                                            <div style={getModalStyle()} className={classes.paper}>
                                                <Typography variant="h6" id="modal-title">
                                                    Flight Booking Details
                                                </Typography>
                                                <Typography variant="subtitle1" id="simple-modal-description">
                                                    <ul>
                                                        <li> From : {this.state.from}</li>
                                                        <li> To : {this.state.to}</li>
                                                        <li> Departure Date : {this.state.departureDate}</li>
                                                        <li> No. of Seats : {this.state.noOfSeats}</li>
                                                        <li> Ticket Number : {this.state.ticketNumber}</li>
                                                        <li> Class : {this.state.class}</li>
                                                        <li> Status : {this.state.status}</li>
                                                    </ul>
                                                    <button className="btn btn-primary" onClick={(event) => this.handleRedirect(event)}>Ok</button>
                                                </Typography>

                                            </div>
                                        </Modal>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </MuiThemeProvider>
        );
    }
}

BookFlight.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(BookFlight);
