//Require
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

//Starting Contents
const homeStartingContent = "The journal—it’s one of those things that can be as useless as a piece of trash, or one of the most valuable things you’ve ever owned…. This can be the place where you journal about your day-to-day: what you did, what you ate, who you saw and spoke with. Whatever you want. It’s a working way to log your life. The best part about this journaling habit is that you literally have a hand-written record of what you’ve done on any given day… And believe me when I tell you that it comes in handy.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";


//Mongoose connect
mongoose.connect("mongodb+srv://"+process.env.DB_USERNAME+":"+process.env.DB_PASSWORD+"@cluster0.hgiqf.mongodb.net/Journal");

//Schema
const postSchema = new mongoose.Schema({
  title:String,
  content:String
});


//Model
const Post = mongoose.model("Post",postSchema);
const Home = mongoose.model("HomePost", postSchema);
const AboutUs = mongoose.model("AboutUsPost",postSchema);
const Contact = mongoose.model("ContactPost",postSchema);


//Objects
const homePost1 = new Home({
  title:"Home",
  content:homeStartingContent
});
//------------>Aboutus contact remaining<--------------

const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

let posts =[];


//Get
app.get("/",function(req,res){
  Home.find({},(err,homePosts)=>{
    if(homePosts.length ===0){
       homePost1.save();
       res.redirect("/");
    }
    else{
      Post.find({}, (err,posts)=>{
        if(!err) res.render("home",{homePosts:homePosts,posts:posts});
      });
    }
  });
});
app.get("/about",function(req,res){
  res.render("about",{aboutContent:aboutContent});
});
app.get("/contact",function(req,res){
  res.render("contact",{contactContent:contactContent});
});
app.get("/compose",function(req,res){
  res.render("compose");
});
app.get("/posts/:id",function(req,res){
  Post.findOne({_id:req.params.id},(err,post)=>{
     res.render("post",{singlePostTitle:post.title,singlePostBody:post.content});
  })
});


//Post
app.post("/compose",function(req,res){
  const newPost =new Post({
    title:req.body.postTitle,
    content:req.body.postBody
  });
  newPost.save();
  res.redirect("/");
});



//Listen
app.listen(3000, function() {
  console.log("Server started on port 3000");
});
