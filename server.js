

var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");


// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");


var PORT = 8080;

// Initialize Express
var app = express();

var router = express.Router();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use express.static to serve the public folder as a static directory
app.use(express.static(__dirname + "/public"));

// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Connect to the Mongo DB
// var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/week18Populater"

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
// mongoose.connect(MONGODB_URI);


/** 
* ? GET ROUTES ?
*/

// Articles not saved 
app.get("/", function (req, res) {


  db.Article.find({ isSave: false }).then(function (data) {

    // console.log(data);
    console.log(data);
    res.render("index", { piece: data });

  });

});


//Get from one article all the corresponding notes
app.get("/articles/:id", function (req, res) {

  db.Note.find({ title: req.params.id }).then(function (dbnotes) {


    console.log(`Backend route found by one request the following item: 
    ${dbnotes}`);

    res.json(dbnotes);

  })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });

});



/*
 * * Save data to db Routes
*/
// route to change boolean to true to show in saved.handlebars
app.put("/saved/:id", function (req, res) {

  db.Article.findOneAndUpdate({ _id: req.params.id }, { $set: { isSave: true } }).then(function (dbArticle) {


    console.log(`getting only the saved item: 
    ${dbArticle}`);

    res.json(dbArticle);

  })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });

});


//Display only saved Articles
app.get("/saved", function (req, res) {


  db.Article.find({ isSave: true }).then(function (data) {

    // console.log(data);
    console.log(data);
    res.render("saved", { pieceS: data });

  });

});


// Route for saving/updating an Article's associated Note
app.post("/article/:id", function (req, res) {
  // Create a new note and pass the req.body to the entry

  db.Article.findOne({ _id: req.params.id }).then(function () {
    db.Note.create(req.body)
      .then(function (dbNote) {

        db.Note.find({ title: dbNote.title }).then(function (allnotes) {

          console.log(`Backend route found by request the following item: 
          ${allnotes}`);

          res.json(allnotes);
        })
          .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
          });
        //console.log(`this is the response for dbNote${JSON.stringify(dbNote)}`);
        //res.json(dbNote);
      })
  })
});

/*
! *  TODO: Delete routes
*/ 

// Note delete route
app.delete("/notes/:id", function (req, res) {

  db.Note.deleteOne({ _id: req.params.id }).then(function () {
    console.log("Note deleted");
  });

});

app.delete("/delete/:id", function (req, res) {

  db.Article.deleteOne({ _id: req.params.id }).then(function () {
    console.log("Article deleted");
  });

});




/**
 * * Scrape route
 */

// A GET route for scraping the echoJS website
app.get("/scrape", function (req, res) {
  // First, we grab the body of the html with request
  axios.get("https://www.businessinsider.com/").then(function (response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);


    $(".feature-post").each(function (i, element) {


      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this)
        .children("a")
        .text();
      result.link = $(this)
        .children("a")
        .attr("href");

      console.log(result);

      // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
        .then(function (dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
          res.redirect("/")
        })
        .catch(function (err) {
          // If an error occurred, send it to the client
          return res.json(err);
        });

    });
    //  If we were able to successfully scrape and save an Article, send a message to the client
  });
  console.log("reloded");
});

// Start the server
app.listen(PORT, function () {
  console.log("App running on http://localhost:" + PORT);
});
