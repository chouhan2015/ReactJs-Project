import React, { Component } from "react";
import "./App.css";
import { BrowserRouter, Route } from "react-router-dom";
import Register from "./Register";
import Login from "./Login";
import Home from "./Home";
import FlightList from "./FlightList";
import Navbar from "./Navbar";
import BookFlight from "./BookFlight";
import BookedFlightList from "./BookedFlightList";
import AddFlight from "./AddFlight";
import FilterData from "./FilterData";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginPage: [],
      Home: [],
      data: []
    };
  }

  setData = data => {
    this.setState({ data }, () => {
      console.log("State in App.js after setting data = ", this.state);
    });
  };

  getData = () => {
    return this.state.data;
  };

  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <ToastContainer autoClose={8000} />
          <Route path="/" component={Navbar} />
          <Route path="/Login" component={Login} />
          <Route path="/" exact component={Register} />
          <Route
            path="/Home"
            setData={this.setData}
            render={props => <Home {...props} setData={this.setData} />}
          />
          <Route
            path="/BookFlight"
            render={props => <BookFlight {...props} getData={this.getData} />}
          />
          <Route path="/BookedFlightList" component={BookedFlightList} />
          <Route path="/addFlight" component={AddFlight} />
          <Route path="/FilterData" component={FilterData} />
          <Route
            path="/FlightList"
            setData={this.setData}
            render={props => (
              <FlightList
                {...props}
                setData={this.setData}
                getData={this.getData}
              />
            )}
          />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
