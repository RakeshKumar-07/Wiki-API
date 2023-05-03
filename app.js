
const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const ejs = require("ejs");


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://0.0.0.0:27017/wikiDB");

const articleSchema = {
  title: String,
  content: String
};

const Article = mongoose.model("Article", articleSchema);

const A1 = new Article({
    title: "Rakesh",
    content: "Hi my name is Rakesh!"
});

// A1.save();

////////////Request Targetting all articles////////

app.route("/articles")

.get(function(req,res){
    Article.find({}, function(err ,foundArticles){
        if(err){
            res.send(err);
        }
        else{
            res.send(foundArticles);
        }
    });
})

.post(function(req,res){

    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });

    newArticle.save(function(err){
        if(!err){
            res.send("Successfully added a new article.");
        }
        else{
            res.send(err);
        }
    });
})

.delete(function(req,res){
    Article.deleteMany({}, function(err){
        if(!err){
            res.send("Succesfully deleted all articles.");
        }
        else{
            res.send(err);
        }
    });
});

////////////Request Targetting a specific articles////////


app.route("/articles/:articleTitle")

.get(function(req,res){
    Article.findOne({title: req.params.articleTitle}, function(err ,foundArticle){
        if(foundArticle){
            res.send(foundArticle);
        }
        else{
            res.send("No such article found");
        }
    });
})

.put(function(req,res){

    Article.updateOne(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content},
        // {overwrite: true},
        function(err){
            if(!err){
                res.send("Succesfully Updated");
            }
        }
    );
})

.patch(function(req,res){

    Article.updateOne(
        {title: req.params.articleTitle},
        {$set: req.body},
        // {overwrite: true},
        function(err){
            if(!err){
                res.send("Succesfully Updated changes");
            }
            else{
                res.send(err);
            }
        }
    );
})

.delete(function(req,res){
    Article.deleteMany({title: req.params.articleTitle}, function(err){
        if(!err){
            res.send("Succesfully deleted article.");
        }
        else{
            res.send(err);
        }
    });
});

app.listen(3000, function(){
    console.log("Server started on port 3000.");
});

// {
//     "_id": "6310b009b1b3aeefcb625674",
//     "title": "Rakesh",
//     "content": "Hi my name is Rakesh!",
//     "__v": 0
// },
// {
//     "_id": "6310b1a75a1bba6719c03eef",
//     "title": "Jack Bauer",
//     "content": "Jack Bauer once stepped into quicksand. The quicksand couldn't escape and nearly drowned.",
//     "__v": 0
// }