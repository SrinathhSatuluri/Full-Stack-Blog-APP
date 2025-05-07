const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const PostSchema = new Schema({
    title: { type: String, required: true },
    summary: { type: String, required: true },
    content: { type: String, required: true },
    cover: { type: String, required: true },
    publishedAt: { type: Date, default: Date.now },
    author: { type: String, required: true }, // Make sure author field is included
}, {
    timestamps: false,
});

const PostModel = model('Post', PostSchema);

module.exports = PostModel;




