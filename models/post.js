const mongoose = require('mongoose');
const Schema=mongoose.Schema;

const blogSchema = new Schema({
    title: String,
    /* author:String, */
    content:String,
    image:String,
    //comments:[{comment:String,author:String,date:Date}],
    date:{type:Date,default:Date.now},
    
});
module.exports = mongoose.model('Post',blogSchema);