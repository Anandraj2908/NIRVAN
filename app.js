const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utilities/ExpressErrors');
const methodOverride = require('method-override');
const posts=require('./routes/posts');
const comments=require('./routes/comments');
const session = require('express-session');
const flash=require('connect-flash');

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
app.use(express.static(path.join(__dirname, 'public')))

const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig));

app.use(flash());
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


//routes for /main/
app.use('/main',posts);

//routes for comments
app.use('/main/:id/comments',comments);

//home page
app.get('/',(req,res) => {
    res.render('home')
});





//if the request dosen't match the above routes
app.all('*',(req,res,next) =>{
   next(new ExpressError('Page Not Found', 404))
})


app.use((err,req,res,next) => {
    const {statusCode =500}=err;
    if(!err.message) err.message='Internal Server Error'
    res.status(statusCode).render('errors',{err});
    
})


//connected to localhost
app.listen(6478,()=> {
    console.log("Connected on PORT 6478")
})