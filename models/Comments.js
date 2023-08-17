const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
    post_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "posts",
    },
    description: {
        type: String,
        required: true,
    },
    likes: {
        type: Number,
    },
    createdAt: {
        type: Date,
        default: Date().now,
    },
});

module.exports = mongoose.model("comments", CommentSchema);
