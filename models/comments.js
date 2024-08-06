const {Schema, model} = require('mongoose');

const commentSchema = new Schema({
    content:{
        type: String,
        required: true,
    },
    author:{
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    blogID:{
        type: Schema.Types.ObjectId,
        ref: "blog",
        required: true
    },
}, {timestamps: true});

const Comment = model('comment', commentSchema);
module.exports = Comment;