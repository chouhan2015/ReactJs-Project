const loginService = require("./../service/loginService");
const _ = require("underscore");

exports.login = function(req, res) {
  loginService.login(req, res, function(err, response) {
    if (err) {
      console.log(err);
      res.status(500);
      return res.send("Internal server error");
    } else {
      if (response.length == 0) {
        res.status(400);
        return res.send("Invalid User name or Password");
      }
      res.status(200);
      return res.send(response);
    }
  });
};

function signUp(req, res) {
  if (_.isEmpty(req.body)) {
    res.send("Request body is empty");
    return;
  }
  loginService.signUp(req, res, function(err, response) {
    if (err) {
      console.log(err);
    } else {
      res.send(response);
    }
  });
}

function getLocation(req, res) {
  if (req.query.place) {
    loginService.getLocation(req, res, function(err, response) {
      if (err) {
        console.log(err);
      } else {
        res.send(response);
      }
    });
  } else {
    res.status(400);
    res.send("Please specify place query params");
  }
}

function searchFlight(req, res) {
  loginService.searchFlight(req, res, (err, response) => {
    if (err) {
      console.log(err);
    } else {
      res.send(response);
    }
  });
}

function bookTickets(req, res) {
  loginService.bookTickets(req, res, (err, response) => {
    if (err) {
      console.log(err);
    } else {
      res.send(response);
    }
  });
}

function cancelTickets(req, res) {
  loginService.cancelTickets(req, res, (err, response) => {
    if (err) {
      console.log(err);
    } else {
      if (response.status != 200) {
        res.status(400);
      }
      res.send(response.data);
    }
  });
}

function getBookedTickets(req, res) {
  loginService.getBookedTickets(req, res, (err, response) => {
    if (err) {
      console.log(err);
    } else {
      res.send(response);
    }
  });
}

function getTicketByNumber(req, res) {
  loginService.getTicketByNumber(req, res, (err, response) => {
    if (err) {
      console.log(err);
    } else {
      res.send(response);
    }
  });
}

function getTickets(req, res) {
  if (req.query.ticketNumber && req.query.emailId) {
    if (req.query.ticketNumber && req.query.ticketNumber.length > 3) {
      loginService.getTickets(req, res, function(err, response) {
        if (err) {
          console.log(err);
        } else {
          res.send(response);
        }
      });
    } else {
      res.status(400);
      res.send("Please specify place ticketNumber query param with atleast 4 characters");
    }
  } else {
    res.status(400);
    res.send("Please specify place query params");
  }
}

function addflight(req, res) {
  loginService.addflight(req, res, (err, response) => {
    if (err) {
      console.log(err);
    } else {
      res.send(response);
    }
  });
}

function getAllFlights(req, res) {
  loginService.getAllFlights(req, res, (err, response) => {
    if (err) {
      console.log(err);
    } else {
      res.send(response);
    }
  });
}

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
