import express, { response } from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";

const app=express();
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://0.0.0.0:27017/wikiDB");

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article",articleSchema);

////////////////////////////Request targetting all articles.

app.route("/articles")
/*ye chaining hai matlab mene ek particular route specify kardiya ab usme mein saare calls
get,post,delete etc. laga sakta hu chaining karke.*/

.get((req,res) => {
    Article.find({}).then(function(foundArticles){
        res.send(foundArticles);
    }).catch(function(err){
        res.send(err);
    })
})

.post((req,res)=>{
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content,
    })
    newArticle.save().then(function(){
        res.send("Successfully added a new article.");
    }).catch(function(err){
        res.send(err);
    })
})

.delete((req,res)=>{
    Article.deleteMany({}).then(function(){
        res.send("Successfully deleted all articles.");
    }).catch(function(err){
        res.send(err);
    });
});


//////////////////////////Requesting targetting specific article

app.route("/articles/:articleTitle")

.get((req,res)=>{
    Article.findOne({title: req.params.articleTitle}).then(function(foundArticle){
        if(foundArticle){
            res.send(foundArticle);
        }
        else{
            res.send("No articles matching that title was found.")
        }
        /*agar hume koi aisa article chahiye jiske title mein space ho to URL encoding mein vo space %20 se 
        likha jaata hai.to localhost wali link mein jo title mein space ho uski jagah %20 lagado.*/
    })
})
.put((req,res)=>{
    Article.updateOne({title:req.params.articleTitle},{title:req.body.title,content:req.body.content}).then(function(){
        res.send("Successfully updated article.");
    })
})
.delete((req,res)=>{
    Article.deleteOne({title:req.params.articleTitle}).then(function(){
        res.send("Successfully deleted article.")
    }).catch(function(err){
        res.send(err);
    })
});

app.listen(3000,(req,res) => {
    console.log("Server is up and running on port 3000");
});