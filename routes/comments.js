const express = require('express');
const router = express.Router({ mergeParams: true });//mergege params includes id outside routes
const {commentSchema} = require('../schemas.js');
const wrapAsync = require('../utilities/wrapAsync');
const ExpressError = require('../utilities/ExpressErrors');
const Post = require('../models/post');
const Comment=require('../models/comment');


//validating comment through Joi
const validateComment = (req, res, next) => {
    const { error } = commentSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

//Create Comment
router.post('/',validateComment,wrapAsync(async(req,res) =>{
    const post = await Post.findById(req.params.id);
    const comment = new Comment(req.body.comment);
    post.comments.push(comment);//can get an error of null so add mergerParams:true inside Router
    await comment.save();
    await post.save();
    req.flash('success','Comment added!')
    res.redirect(`/main/${post._id}`);
   
}))


//Delete Comment
router.delete('/:commentId',wrapAsync(async(req,res) =>{
    const {id,commentId}=req.params;
    await Post.findByIdAndUpdate(id,{$pull:{comments:commentId}});
    await Comment.findByIdAndDelete(commentId);
    req.flash('success','Deleted Comment!')
    res.redirect(`/main/${id}`);
    
}))

module.exports =router;