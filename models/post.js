const mongoose = require('mongoose');
const Comment =require('./comment');
const Schema=mongoose.Schema;

const blogSchema = new Schema({
    title: String,
    /* author:String, */
    content:String,
    image:String,
    date:{type:Date,default:Date.now},
    //comments:[{comment:String,author:String,date:Date}],
    comments:[
        {
            type:Schema.Types.ObjectId,
            ref:'Comment'
        }
    ]
    
});

blogSchema.post('findOneAndDelete', async function (doc) {
    if(doc){
        await Comment.deleteMany({
            _id:{
                $in:doc.comments
            }
        })
    }
})

module.exports = mongoose.model('Post',blogSchema);