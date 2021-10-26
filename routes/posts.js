const express = require('express');
const {blogSchema} = require('../schemas');
const wrapAsync = require('../utilities/wrapAsync');
const ExpressError = require('../utilities/ExpressErrors');
const Post = require('../models/post');
const router = express.Router();

//validating blog through Joi
const validateBlog = (req,res,next) => {
    const {error} = blogSchema.validate(req.body);
    if(error){
        const msg =error.details.map(el => el.message).join(',')
        throw new ExpressError(msg,400)
    }
    else{
        next();
    }
}


//Main menu
router.get('/',wrapAsync( async (req,res) => {
    const posts =await Post.find({});
    res.render('Blogs/index', {posts}) ;
}));

//Create
router.get('/new',(req,res) => {
    res.render('Blogs/new');
}) 
router.post('/',validateBlog ,wrapAsync( async (req,res) =>{
    if(!req.body.posts) throw new ExpressError('Bad Request',400);
    const posts = await Post(req.body.posts);
    await posts.save();
    req.flash('success', 'Uploaded Successfully!');
    res.redirect(`/main/${posts._id}`)
}))

//Show page
router.get('/:id',wrapAsync( async (req,res) => {
    const posts =await Post.find({});
    const post = await Post.findById(req.params.id).populate('comments');
    Array.prototype.next = function() {
        return this[++this.current];
    };
    Array.prototype.prev = function() {
        return this[--this.current];
    };
    Array.prototype.current = 0;
    let count=1;
    for(let i=0;i<posts.length-2;i++)
    { 
        if(posts[i]._id.equals( post._id)){
            break;
        }
        else{
            posts.next();
            count++;
        }  
    }
    var nextid=posts.next()._id;
    for(let k=1;k<=count;k++){
        posts.prev();
    }
    /* for(let j=posts.length-1;j>2;j--)
    {
        if(posts[j]._id.equals(post._id)){
            break;
        }
        else{
            posts.prev();
        }
    }
    var previd=posts.prev()._id; */
    
    res.render('Blogs/show',{nextid,posts,post});
}));

//Edit
router.get('/:id/edit',wrapAsync( async (req,res) => {
    const { id } = req.params;
    const posts = await Post.findById(id);
    res.render('Blogs/edit',{posts});
}))
router.put('/:id',validateBlog ,wrapAsync( async (req,res) => {
    const {id} = req.params;
    const posts = await Post.findByIdAndUpdate(id,{...req.body.posts});
    req.flash('success', 'Updated Post!')
    res.redirect(`/main/${posts._id}`);
}))


//Delete
router.delete('/:id',wrapAsync( async (req,res) => {
    const {id} = req.params;
    await Post.findByIdAndDelete(id);
    req.flash('success', 'Deleted Post')
    res.redirect('/main');
}))



module.exports =router;