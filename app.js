//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");

const app = express();

// Mongoose
const mongoose = require("mongoose");
// Initialize Mongoose
const mongoLocal = `mongodb://localhost:27017/wikiDB`
// const mongoLocal = `mongodb://localhost:27017/${process.env.DB_NAME}`
// const mongoAtlas = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-hyjeh.mongodb.net/${process.env.DB_NAME}`

mongoose.connect(mongoLocal, {
    useNewUrlParser: true,  useUnifiedTopology: true, useFindAndModify: false
});

// Initialize Model
const Article = require("./models/Wiki");

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.listen(3000, function() {
    console.log("Server started on port 3000");
});

// Articles Route, CHAINED REST API
app.route("/articles")

// 1st GET METHOD
.get(function(req,res) {
    // FIND
    Article.find(function(err, results) {
        if(!err) {
            res.send(results);
            // console.log(results);
        } else {
            console.log(err);
        }
    });
})

// 2nd POST METHOD
.post(function(req,res) {
    // Grab object form
    const article = {
        title: req.body.title,
        content: req.body.content
    }
    // Create is shortcut to make and save
    Article.create(article, function(err, results) {
        if (!err) {
            res.send("Saved onto db: " + results);
            console.log(results);
        } else {
            res.send("Error: " +err);
            console.log(err);
        }
    });
})

// 3rd DELETE METHOD
.delete(function(req,res) {
    // Delete many
    Article.deleteMany({}, function(err) {
        if (!err){
            res.send("Deleted all collections.");
            console.log("Deleted all collections.");
        } else {
            res.send("Error: " + err);
            console.log("Error: " + err);
        }
    });
});


// ARTICLES specific page route
app.route("/articles/:page")

// GET METHOD
.get(function(req,res) {
    const requestedPage = req.params.page;
    
    Article.findOne({title: requestedPage}, function(err, results) {
        if(!err) {
            console.log("Found page article: ", results);
            res.send(results);
        } else {
            console.log("Cannot find, error: ", err);
        }
    });
})
// PUT METHOD
.put(function(req,res) {
    const requestedPage = req.params.page;
    // Replace one is overwrite true !!! --> Will replace the bike
    Article.replaceOne(
        { title: requestedPage },
        { title: req.body.title, content: req.body.content },
        function(err, results) {
            if(!err) {
                res.send(requestedPage);
                console.log("Updated Page: " + requestedPage);
            } else {
                res.send(err);
                console.log("Error updating page: " + err);
            }
        }
    );
})
// PATCH METHOD
.patch(function(req,res) {
    const requestedPage = req.params.page;
    // Replace one part is overwrite false --> Will replace a part of the bike
    Article.updateOne(
        { title: requestedPage },
        // Set is dynamic input from body parser if user has that input
        { $set: req.body },
        function(err,results) {
            if(!err) {
                res.send(requestedPage);
                console.log("Updated Page: " + requestedPage);
            } else {
                res.send(err);
                console.log("Error updating page: " + err);   
            }
        }
    );
})
// DELETE METHOD
.delete(function(req,res) {
    const requestedPage = req.params.page;
    // Delete one entry
    Article.deleteOne(
        { title: requestedPage },
        function(err, results) {
            if(!err) {
                res.send("Deleted entry: " + requestedPage);
                console.log("Deleted entry: " + requestedPage);
            } else {
                res.send(err);
                console.log("Error updating page: " + err);
            }
        }
    );
});
