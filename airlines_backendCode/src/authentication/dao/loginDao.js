const mongo = require("mongodb");
const MongoClient = mongo.MongoClient;
const db = require("./../../database/db");
const _ = require("underscore");
const Response = require("./../../model/response.model");
let date = require("date-and-time");

// (function() {
//   const data = [];

//   console.trace("got it = ", data);

//   MongoClient.connect(
//     db.url,
//     function(err, db) {
//       if (err) throw err;
//       const dbo = db.db("airlines");
//       let dt = new Date();
//       console.log(date.format(dt, "DD/MM/YYYY"));

//       for (let i = 0; i < 365; i++) {
//         let now = date.format(date.addDays(dt, i), "DD/MM/YYYY");
//         let myobj = [
//           {
//             flightCode: "InE02",
//             date: now,
//             availableseats: 20,
//             bookedSeats: 0,
//             totalSeats: 20
//           },
//           {
//             flightCode: "InE03",
//             date: now,
//             availableseats: 20,
//             bookedSeats: 0,
//             totalSeats: 20
//           },
//           {
//             flightCode: "InE04",
//             date: now,
//             availableseats: 20,
//             bookedSeats: 0,
//             totalSeats: 20
//           },
//           {
//             flightCode: "jeE02",
//             date: now,
//             availableseats: 20,
//             bookedSeats: 0,
//             totalSeats: 20
//           },
//           {
//             flightCode: "jeE03",
//             date: now,
//             availableseats: 20,
//             bookedSeats: 0,
//             totalSeats: 20
//           },
//           {
//             flightCode: "jeE04",
//             date: now,
//             availableseats: 20,
//             bookedSeats: 0,
//             totalSeats: 20
//           }
//         ];
//         dbo.collection("flightSeats").insertMany(myobj, function(err, res) {
//           if (err) throw err;
//           console.trace("Number of documents inserted: " + res.insertedCount);
//         });
//       }
//       db.close();
//     }
//   );
// })();

function findUser(reqJson, callback) {
  console.trace("inside find user function");
  MongoClient.connect(
    db.url,
    function(err, db) {
      if (err) {
        console.trace(err);
        throw err;
      }
      var dbo = db.db("airlines");
      dbo
        .collection("users")
        .find(reqJson)
        .toArray(function(err, result) {
          if (err) throw err;
          db.close();
          console.trace("Result = ", result);
          callback(null, result);
        });
    }
  );
}

function getLocation(req, res, callback) {
  console.trace("query params = ", req.query.place);
  MongoClient.connect(
    db.url,
    function(err, db) {
      if (err) {
        console.trace(err);
        throw err;
      }
      const dbo = db.db("airlines");
      const reqJson = {
        name: new RegExp("^" + req.query.place, "i")
      };
      console.trace(reqJson);
      dbo
        .collection("places")
        .find(reqJson)
        .toArray(function(err, result) {
          if (err) throw err;
          db.close();
          console.trace("Result = ", result);
          if (result.length > 0) {
            result = _.sortBy(result, "name");
          }
          callback(null, result);
        });
    }
  );
}

function login(req, res, callback) {
  let reqJson = _.pick(req.body, "email", "password");
  findUser(reqJson, (err, result) => {
    callback(null, result);
  });
}

function signUp(req, res, callback) {
  MongoClient.connect(
    db.url,
    function(err, db) {
      if (err) throw err;
      console.trace("Request body = ", req.body);
      let reqJson = _.pick(req.body, "email");
      console.trace("reqJson = ", reqJson);

      findUser(reqJson, (err, result) => {
        console.trace(result.length);
        if (result.length == 0) {
          const dbo = db.db("airlines");
          dbo.collection("users").insertOne(req.body, function(err, result) {
            if (err) throw err;
            callback(null, "Data Inserted");
            db.close();
          });
        } else {
          callback(null, "User is already registered");
        }
      });
    }
  );
}

function searchF(req, callback) {
  MongoClient.connect(
    db.url,
    function(err, db) {
      if (err) {
        console.trace(err);
        throw err;
      }
      const { from, to, date, totalSeats } = req;
      const dbo = db.db("airlines");
      dbo
        .collection("flightDestinations")
        .aggregate([
          {
            $lookup: {
              from: "flightSeats",
              localField: "flightCode",
              foreignField: "flightCode",
              as: "seats_information"
            }
          },

          { $unwind: "$seats_information" },
          {
            $match: {
              "destinations.from": new RegExp(from, "i"),
              "destinations.to": new RegExp(to, "i"),
              "seats_information.availableseats": { $gte: totalSeats },
              "seats_information.date": new RegExp(date, "i")
            }
          }
        ])
        .toArray(function(err, result) {
          if (err) throw err;
          db.close();
          console.trace("Result = ", result);
          callback(null, result);
        });
    }
  );
}

function getNextSequenceValue(db, sequenceName, callback) {
  db.collection("counters").findOneAndUpdate(
    { _id: sequenceName },
    { $inc: { sequence_value: 1 } },
    { new: true },
    (err, sequenceDocument) => {
      console.trace("sequenceDocument = ", sequenceDocument);
      callback(err, sequenceDocument.value.sequence_value);
    }
  );
}

function searchFlight(req, res, callback) {
  if (req.body.isRoundTrip) {
    let reqObject = _.pick(req.body, "from", "to", "totalSeats");
    reqObject.date = req.body.departureDate;
    searchF(reqObject, (err, result) => {
      let obj = {};
      obj.departureTrip = result;
      reqObject.from = req.body.to;
      reqObject.to = req.body.from;
      reqObject.date = req.body.returnDate;
      searchF(reqObject, (err, result) => {
        obj.returnTrip = result;
        callback(null, obj);
      });
    });
  } else {
    let reqObject = _.pick(req.body, "from", "to", "totalSeats");
    reqObject.date = req.body.departureDate;
    console.trace(reqObject);
    searchF(reqObject, (err, result) => {
      let obj = {};
      obj.departureTrip = result;
      callback(null, obj);
    });
  }
}

function bookTickets(req, res, callback) {
  MongoClient.connect(
    db.url,
    function(err, db) {
      if (err) throw err;
      console.trace("Request body = ", req.body);
      let reqJson = {};
      console.trace("reqJson = ", reqJson);
      const dbo = db.db("airlines");
      reqJson = _.extend({}, req.body);
      reqJson.noOfSeats = parseInt(reqJson.noOfSeats);

      if (reqJson.isRoundTrip) {
        let insertMany = [];
        let obj = _.extend({}, reqJson);
        reqJson.bookedDate = new Date();
        obj = _.omit(obj, "returnFlightCode", "returnDate");
        getNextSequenceValue(dbo, "ticketId", (err, sequence_value) => {
          obj.ticketNumber = reqJson.departureFlightCode + "Tic" + sequence_value;
          obj.status = "Booked";
          obj.dateBooked = date.format(new Date(), "DD/MM/YYYY");
          insertMany.push(obj);
          let obj1 = _.extend({}, obj);
          obj1.from = reqJson.to;
          obj1.to = reqJson.from;
          obj1.departureFlightCode = reqJson.returnFlightCode;
          obj1.departureDate = reqJson.returnDate;
          getNextSequenceValue(dbo, "ticketId", (err, sequence_value1) => {
            obj1.ticketNumber = reqJson.returnFlightCode + "Tic" + sequence_value1;
            insertMany.push(obj1);
            console.trace("final object", insertMany);
            dbo.collection("bookedTickets").insertMany(insertMany, { ordered: false }, function(err, result) {
              if (err) throw err;
              dbo.collection("flightSeats").updateMany(
                {
                  $or: [
                    {
                      $and: [
                        { flightCode: reqJson.departureFlightCode },
                        { date: reqJson.departureDate },
                        { availableseats: { $gte: reqJson.noOfSeats } }
                      ]
                    },
                    {
                      $and: [
                        { flightCode: reqJson.returnFlightCode },
                        { date: reqJson.returnDate },
                        { availableseats: { $gte: reqJson.noOfSeats } }
                      ]
                    }
                  ]
                },
                { $inc: { availableseats: -reqJson.noOfSeats, bookedSeats: reqJson.noOfSeats } },
                // { multi: true },
                (err, resultOfFindAndUpdate) => {
                  if (!resultOfFindAndUpdate) {
                    callback(null, "Invalid request JSON");
                    return;
                  }
                  console.trace("resultOfFindAndUpdate = ", resultOfFindAndUpdate.result);
                  callback(null, result.ops);
                  db.close();
                }
              );
            });
          });
        });
      } else {
        getNextSequenceValue(dbo, "ticketId", (err, sequence_value1) => {
          reqJson.ticketNumber = reqJson.departureFlightCode + "Tic" + sequence_value1;
          reqJson.status = "Booked";
          reqJson.dateBooked = date.format(new Date(), "DD/MM/YYYY");
          dbo.collection("bookedTickets").insertOne(reqJson, function(err, result) {
            if (err) throw err;
            dbo.collection("flightSeats").updateMany(
              {
                $and: [
                  { flightCode: reqJson.departureFlightCode },
                  { date: reqJson.departureDate },
                  { availableseats: { $gte: reqJson.noOfSeats } }
                ]
              },
              { $inc: { availableseats: -reqJson.noOfSeats, bookedSeats: reqJson.noOfSeats } },
              (err, resultOfFindAndUpdate) => {
                if (err) {
                  callback(null, err);
                  return;
                }
                console.trace("resultOfFindAndUpdate = ", resultOfFindAndUpdate.result);
                callback(null, result.ops);
                db.close();
              }
            );
          });
        });
      }
    }
  );
}

function cancelTickets(req, res, callback) {
  MongoClient.connect(
    db.url,
    function(err, db) {
      if (err) {
        console.trace(err);
        throw err;
      }
      const dbo = db.db("airlines");
      let reqObj = req.body;
      dbo
        .collection("bookedTickets")
        .findOneAndUpdate({ ticketNumber: reqObj.ticketNumber }, { $set: { status: "Cancelled" } })
        .then(result => {
          dbo.collection("flightSeats").updateMany(
            {
              $and: [{ flightCode: reqObj.departureFlightCode }, { date: reqObj.departureDate }]
            },
            { $inc: { availableseats: reqObj.noOfSeats, bookedSeats: -reqObj.noOfSeats } },
            (err, updateMany) => {
              console.trace("updateMany = ", updateMany.result);
              if (updateMany.result.ok == 1 && result.ok == 1) {
                Response.msg = "Ticket Cancelled Successfully";
                Response.data = "Ticket Cancelled Successfully";
                Response.status = "200";
                callback(null, Response);
              } else {
                Response.msg = "Operation Failed";
                Response.data = "Operation Failed";
                Response.status = "400";
                callback(null, Response);
              }

              db.close();
            }
          );
        });
    }
  );
}

function getBookedTickets(req, res, callback) {
  MongoClient.connect(
    db.url,
    function(err, db) {
      if (err) {
        console.trace(err);
        throw err;
      }
      const dbo = db.db("airlines");
      dbo
        .collection("user-role")
        .find({
          emailId: new RegExp(req.body.emailId, "i")
        })
        .toArray(function(err, result) {
          if (err) throw err;
          console.trace(result);
          let role = "";
          if (result && result.length > 0) {
            role = result[0].role;
          }
          let reqJson;
          if (role.toUpperCase() == "ADMIN") {
            reqJson = {};
          } else {
            reqJson = {
              emailId: req.body.emailId
            };
          }
          dbo
            .collection("bookedTickets")
            .find(reqJson)
            .toArray(function(err, result) {
              if (err) throw err;
              db.close();
              console.trace("Result = ", result);
              callback(null, result);
            });
        });
      // let reqJson = {
      //   emailId: req.body.emailId
      // };
      // console.trace("reqJson in getBookedTickets = ", reqJson);
      // const dbo = db.db("airlines");

      // dbo
      //   .collection("bookedTickets")
      //   .find(reqJson)
      //   .toArray(function(err, result) {
      //     if (err) throw err;
      //     db.close();
      //     console.trace("Result = ", result);
      //     callback(null, result);
      //   });
    }
  );
}

function getTicketByNumber(req, res, callback) {
  MongoClient.connect(
    db.url,
    function(err, db) {
      if (err) {
        console.trace(err);
        throw err;
      }

      let reqJson = {
        [req.body.param]: new RegExp(req.body.value, "i")
      };
      console.trace("reqJson in getTicketByNumber = ", reqJson);
      const dbo = db.db("airlines");
      dbo
        .collection("bookedTickets")
        .find(reqJson)
        .toArray(function(err, result) {
          if (err) throw err;
          db.close();
          console.trace("Result = ", result);
          callback(null, result);
        });
    }
  );
}

function getTickets(req, res, callback) {
  if (!(req.query.ticketNumber && req.query.emailId)) {
    callback(null, "Please send ticket number and email id");
    return;
  }

  MongoClient.connect(
    db.url,
    function(err, db) {
      if (err) {
        console.trace(err);
        throw err;
      }

      const dbo = db.db("airlines");
      dbo
        .collection("user-role")
        .find({
          emailId: new RegExp(req.query.emailId, "i")
        })
        .toArray(function(err, result) {
          if (err) throw err;
          console.trace(result);
          let role = "";
          if (result && result.length > 0) {
            role = result[0].role;
          }
          let reqJson;
          if (role.toUpperCase() == "ADMIN") {
            reqJson = {
              ticketNumber: new RegExp("^" + req.query.ticketNumber, "i")
            };
          } else {
            reqJson = {
              emailId: req.query.emailId,
              ticketNumber: new RegExp("^" + req.query.ticketNumber, "i")
            };
          }
          dbo
            .collection("bookedTickets")
            .find(reqJson)
            .project({ ticketNumber: 1, _id: 0 })
            .toArray(function(err, resultOfFindTicket) {
              if (err) throw err;
              db.close();
              console.trace("Result = ", resultOfFindTicket);
              callback(null, resultOfFindTicket);
            });
        });
    }
  );
}

function addflight(req, res, callback) {
  MongoClient.connect(
    db.url,
    function(err, db) {
      if (err) throw err;
      console.trace("Request body = ", req.body);

      // findUser(reqJson, (err, result) => {
      //   console.trace(result.length);
      //   if (result.length == 0) {
      const dbo = db.db("airlines");
      dbo
        .collection("flightDestinations")
        .find({ flightCode: req.body.flightCode })
        .toArray(function(err, result) {
          if (err) throw err;
          console.trace(result);
          if (result.length > 0) {
            dbo
              .collection("flightDestinations")
              .updateOne({ flightCode: req.body.flightCode }, { $push: { destinations: req.body.destinations[0] } }, function(
                err,
                result1
              ) {
                if (err) throw err;
                console.trace(result1);
                callback(null, "Data Updated");
                db.close();
              });
          } else {
            dbo.collection("flightDestinations").insertOne(req.body, function(err, result2) {
              if (err) throw err;
              console.trace(result2);
              let dt = new Date();
              console.log(date.format(dt, "DD/MM/YYYY"));

              for (let i = 0; i < 365; i++) {
                let now = date.format(date.addDays(dt, i), "DD/MM/YYYY");
                let myobj = [
                  {
                    flightCode: req.body.flightCode,
                    date: now,
                    availableseats: 20,
                    bookedSeats: 0,
                    totalSeats: 20
                  }
                ];
                dbo.collection("flightSeats").insertMany(myobj, function(err, res) {
                  if (err) throw err;
                  console.trace("Number of documents inserted: " + res.insertedCount);
                });
              }
              db.close();
              callback(null, "Data Inserted");
            });
          }
        });
    }
  );
}

function getAllFlights(req, res, callback) {
  MongoClient.connect(
    db.url,
    function(err, db) {
      if (err) throw err;
      console.trace("Request body = ", req.body);

      // findUser(reqJson, (err, result) => {
      //   console.trace(result.length);
      //   if (result.length == 0) {
      const dbo = db.db("airlines");
      dbo
        .collection("flightDestinations")
        .find({})
        .toArray(function(err, result) {
          if (err) throw err;
          db.close();
          callback(null, result);
        });
    }
  );
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
