const express =require('express');
const router=express.Router();
const User=require('../models/user');
const passport=require('passport');
const wrapAsync = require('../utilities/wrapAsync');

router.get('/register',(req,res) =>{
    res.render('users/register');
});
router.post('/register',wrapAsync(async(req,res)=>{
    try{
    const{username,password,thumbnail}=req.body;
    const user = new User({username,thumbnail});
    const registerUser=await User.register(user,password);
    req.login(registerUser,err =>{
        if(err) return next(err);
        req.flash('success','Welcome to Nirvan');
        res.redirect('/main');
    })
    }catch(e){
        req.flash('error',e.message);
        res.redirect('register');
    }
}));

router.get('/login',(req,res)=>{
    res.render('users/login');
})

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success','Welcome Back');
    const redirectUrl=req.session.returnTo ||'/main';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
})


//auth with facebook
router.get('/auth/facebook', passport.authenticate('facebook', {
    scope: ['profile']
}));

router.get('/auth/facebook/redirect', passport.authenticate('facebook',{ failureFlash: true, failureRedirect: '/login' }), (req, res) => {
     //res.send(req.user);
     req.flash('success','Welcome');
    res.redirect('/main');
});

// auth with google+
router.get('/auth/google', passport.authenticate('google', {
    scope:['profile']
}));


// callback route for google to redirect to
// hand control to passport to use code to grab profile info
router.get('/auth/google/redirect', passport.authenticate('google',{ failureFlash: true, failureRedirect: '/login' }), (req, res) => {
     //res.send(req.user);
     req.flash('success','Welcome');
    res.redirect('/main');
});

//logout
router.get('/logout',(req,res) =>{
    req.logout();
    req.flash('success',"Goodbye!");
    res.redirect('/main');
})


module.exports=router;