const express = require('express');
const app=express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate =require('ejs-mate');
const Post = require('./models/post');
const methodOverride = require('method-override');


mongoose.connect('mongodb://localhost:27017/nirvan',{
    useNewUrlParser:true,
    useUnifiedTopology:true
});

const db = mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


app.engine('ejs',ejsMate);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));


//home page
app.get('/',(req,res) => {
    res.render('home')
});

//Main menu
app.get('/main', async (req,res) => {
    const posts =await Post.find({});
    res.render('Blogs/index', {posts}) ;
});

//Create
app.get('/main/new',(req,res) => {
    res.render('Blogs/new');
}) 
app.post('/main', async (req,res) =>{
    const posts = await Post(req.body.posts);
    await posts.save();
    res.redirect(`/main/${posts._id}`)
})

//Show page
app.get('/main/:id', async (req,res) => {
    const posts = await Post.findById(req.params.id);
    res.render('Blogs/show',{posts});
});

//Edit
app.get('/main/:id/edit',async (req,res) => {
    const posts = await Post.findById(req.params.id);
    res.render('Blogs/edit',{posts});
})
app.put('/main/:id', async (req,res) => {
    const {id} = req.params;
    const posts = await Post.findByIdAndUpdate(id,{...req.body.posts});
    res.redirect(`/main/${posts._id}`);
})


//Delete
app.delete('/main/:id', async (req,res) => {
    const {id} = req.params;
    await Post.findByIdAndDelete(id);
    res.redirect('/main');
})



//connected to localhost
app.listen(6478,()=> {
    console.log("Connected on PORT 6478")
})