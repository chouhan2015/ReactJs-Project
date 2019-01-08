const loginDao = require("./../dao/loginDao");
const _ = require("underscore");
let date = require("date-and-time");

function login(req, res, callback) {
  loginDao.login(req, res, function(err, response) {
    if (err) {
      console.log(err);
    } else {
      return callback(null, response);
    }
  });
}

function signUp(req, res, callback) {
  loginDao.signUp(req, res, function(err, response) {
    if (err) {
      console.log(err);
    } else {
      return callback(null, response);
    }
  });
}

function getLocation(req, res, callback) {
  loginDao.getLocation(req, res, function(err, response) {
    if (err) {
      console.log(err);
    } else {
      return callback(null, response);
    }
  });
}
function bookTickets(req, res, callback) {
  loginDao.bookTickets(req, res, function(err, response) {
    if (err) {
      console.log(err);
    } else {
      return callback(null, response);
    }
  });
}

function getTicketByNumber(req, res, callback) {
  loginDao.getTicketByNumber(req, res, function(err, response) {
    if (err) {
      console.log(err);
    } else {
      return callback(null, response);
    }
  });
}

function convertDataForFlightResult(req, response, callback) {
  const searchResults = [];
  _.each(response, (value, key) => {
    let object = {};
    object.fullDetails = value;
    object.from = req.from;
    object.to = req.to;
    object.flightName = value.flightName;
    object.flightCode = value.flightCode;
    object.availableseats = value.seats_information.availableseats;
    if (value.destinations.length > 0) {
      //   if (value.destinations.length > 1) {
      let departureObject, arrivalObject;
      let nextTo = _.filter(value.destinations, dest => {
        return dest.from.toUpperCase() == object.from.toUpperCase();
      })[0];
      nextTo = _.extend({}, nextTo);
      _.each(value.destinations, dest => {
        let fromfound = false;
        if (dest.from.toUpperCase() == object.from.toUpperCase()) {
          departureObject = dest;
          if (dest.to.toUpperCase() != object.to.toUpperCase()) {
            fromfound = true;
            nextTo.nextDestination = dest.to;
          }
        }
        if (!fromfound && nextTo.nextDestination && nextTo.nextDestination.toUpperCase() == dest.from.toUpperCase()) {
          nextTo.fare = nextTo.fare + dest.fare;
          if (dest.to.toUpperCase() == object.to.toUpperCase()) {
            nextTo.nextDestination = "";
          } else {
            nextTo.nextDestination = dest.to;
          }
        }
        if (dest.to.toUpperCase() == object.to.toUpperCase()) {
          arrivalObject = dest;
        }
      });
      object.fare = nextTo.fare;
      object.departureTime = departureObject.departureTime;
      object.arrivalTime = arrivalObject.arrivalTime;
      object.departureAirportName = departureObject.departureAirportName;
      object.arrivalAirportName = arrivalObject.arrivalAirportName;
      let tDiff = parseInt(arrivalObject.arrivalDay) - parseInt(departureObject.departureDay);
      let departureDt, arrivaldt;
      departureDt = date.parse(object.departureTime, "HH:mm:ss");
      arrivaldt = date.parse(object.arrivalTime, "HH:mm:ss");
      arrivaldt = date.addDays(arrivaldt, tDiff);
      object.travelTime = date.subtract(arrivaldt, departureDt).toMinutes();
    }
    searchResults.push(object);
  });
  callback(null, searchResults);
}

function searchFlight(req, res, callback) {
  loginDao.searchFlight(req, res, (err, response) => {
    if (err) {
      console.log(err);
    } else {
      let searchResults = {};
      let reqObj = _.pick(req.body, "from", "to");
      convertDataForFlightResult(reqObj, response.departureTrip, (err, result) => {
        searchResults.departureTrip = result;
        if (req.body.isRoundTrip) {
          reqObj.to = req.body.from;
          reqObj.from = req.body.to;
          convertDataForFlightResult(reqObj, response.returnTrip, (err, result) => {
            searchResults.returnTrip = result;
          });
        }
      });

      return callback(null, searchResults);
    }
  });
}

function cancelTickets(req, res, callback) {
  loginDao.cancelTickets(req, res, function(err, response) {
    if (err) {
      console.log(err);
    } else {
      return callback(null, response);
    }
  });
}

function getBookedTickets(req, res, callback) {
  loginDao.getBookedTickets(req, res, function(err, response) {
    if (err) {
      console.log(err);
    } else {
      return callback(null, response);
    }
  });
}

function getTickets(req, res, callback) {
  loginDao.getTickets(req, res, function(err, response) {
    if (err) {
      console.log(err);
    } else {
      return callback(null, response);
    }
  });
}

function addflight(req, res, callback) {
  loginDao.addflight(req, res, (err, response) => {
    if (err) {
      console.log(err);
    } else {
      return callback(null, response);
    }
  });
}

function getAllFlights(req, res, callback) {
  loginDao.getAllFlights(req, res, (err, response) => {
    if (err) {
      console.log(err);
    } else {
      return callback(null, response);
    }
  });
}

module.exports.login = login;
module.exports.signUp = signUp;
module.exports.getLocation = getLocation;
module.exports.searchFlight = searchFlight;
module.exports.bookTickets = bookTickets;
module.exports.cancelTickets = cancelTickets;
module.exports.getBookedTickets = getBookedTickets;
module.exports.getTicketByNumber = getTicketByNumber;
module.exports.getTickets = getTickets;
module.exports.addflight = addflight;
module.exports.getAllFlights = getAllFlights;
