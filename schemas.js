const Joi = require('joi');

module.exports.blogSchema = Joi.object({
    posts:Joi.object({
        title: Joi.string().required(),
        image: Joi.string().allow('').optional(),
        content: Joi.string().required()
    }).required()
});

module.exports.commentSchema = Joi.object({
    comment:Joi.object({
        body:Joi.string().required()
    }).required()
})
