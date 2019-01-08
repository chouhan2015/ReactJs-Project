var express = require("express");
var router = express.Router();

const loginController = require("./../authentication/controller/loginController");

router.post("/login", function(req, res) {
  loginController.login(req, res);
});

router.post("/signup", function(req, res) {
  loginController.signUp(req, res);
});

router.post("/search/flight", function(req, res) {
  loginController.searchFlight(req, res);
});

router.get("/getplaces", function(req, res) {
  loginController.getLocation(req, res);
});

router.get("/get/tickets", function(req, res) {
  loginController.getTickets(req, res);
});

router.post("/book/tickets", function(req, res) {
  loginController.bookTickets(req, res);
});

router.post("/cancel/tickets", function(req, res) {
  loginController.cancelTickets(req, res);
});

router.post("/getbookedtickets", function(req, res) {
  loginController.getBookedTickets(req, res);
});

router.post("/searchTicket", function(req, res) {
  loginController.getTicketByNumber(req, res);
});

router.post("/addflight", function(req, res) {
  loginController.addflight(req, res);
});

router.get("/getAllFlights", function(req, res) {
  loginController.getAllFlights(req, res);
});

module.exports = router;
