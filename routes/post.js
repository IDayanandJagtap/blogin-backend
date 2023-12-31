const express = require("express");
const router = express.Router();
const fetchUser = require("../Middleware/fetchUser");
const Posts = require("../models/Posts");
const User = require("../models/Users");
const Comments = require("../models/Comments");

// Create a new post
router.post("/newpost", fetchUser, async (req, res) => {
    if (!req.user) {
        res.status(401).send({ success: false, error: "Unauthorized access" });
        return;
    }
    try {
        const user_id = req.user.id;
        const { title, description, createdAt } = req.body;

        const user = await User.findById(user_id);

        const data = {
            user_id: user_id,
            author: user.name,
            title: title,
            description: description,
            createdAt: createdAt,
        };

        const post = await Posts.create(data);

        res.status(201).send({ success: true, message: post });
    } catch (err) {
        console.log(err);
        res.status(500).send({
            success: false,
            error: err,
        });
    }
});

// Get all posts
router.get("/posts", async (req, res) => {
    try {
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const perPage = req.query.perPage ? parseInt(req.query.perPage) : 5;
        const sort = { createdAt: -1 };
        const skip = (page - 1) * perPage; // skip first entries

        const posts = await Posts.find({}).sort(sort).skip(skip).limit(perPage);
        if (!posts) {
            res.status(404).send({ success: false, error: "No data found !" });
            return;
        }
        res.status(200).send({ success: true, payload: posts });
    } catch (err) {
        console.log(err);
        res.status(500).send({
            success: false,
            error: err,
        });
    }
});

// View user posts
router.get("/my-posts", fetchUser, async (req, res) => {
    if (!req.user) {
        res.status(401).send({ success: false, error: "Unauthorized access" });
        return;
    }

    try {
        const id = req.user.id;
        const userPosts = await Posts.find({ user_id: id });
        res.status(200).send({ success: true, payload: userPosts });
    } catch (err) {
        console.log(err);
        res.status(500).send({
            success: false,
            error: err,
        });
    }
});

// Search posts
router.get("/search", async (req, res) => {
    try {
        const userQuery = req.query.query;
        // If your search isn't working here's the problem ... create a new index {"title": "text"}
        const query = {
            $text: { $search: userQuery },
        };

        const response = await Posts.find(query);

        res.status(200).send({ success: true, payload: response });
    } catch (err) {
        res.status(200).send({ success: false, error: err.message });
    }
});

// Comments on a post :
router.post("/comment", fetchUser, async (req, res) => {
    if (!req.user) {
        res.status(401).send({ success: false, error: "Unauthorised access" });
        return;
    }
    try {
        const { post_id, description } = req.body;
        const comment = await Comment.create({
            post_id: post_id,
            description: description,
        });
        res.status(201).send({ success: true, payload: comment });
    } catch (err) {
        res.status(500).send({ success: false, error: err });
    }
});

// Likes on comment :
router.put("/comment", fetchUser, async (req, res) => {
    if (!req.user) {
        res.status(401).send({ success: false, error: "Unauthorised access" });
        return;
    }
    try {
        const { post_id, likes } = req.body;
        const comment = await Comment.findOneAndUpdate(
            { post_id: post_id },
            { likes: likes }
        );
        res.status(201).send({ success: true, payload: comment });
    } catch (err) {
        res.status(500).send({ success: false, error: err });
    }
});

// View a single post:
router.get("/view-post/:id", async (req, res) => {
    try {
        const post_id = req.params.id;
        const post = await Posts.findById(post_id);

        const comments = (await Comments.find({ post_id: post_id })) || null;

        res.status(200).send({
            success: true,
            payload: { post: post, comments: comments },
        });
    } catch (err) {
        res.send(err);
    }
});

// Delete a post :
router.delete("/delete/:id", fetchUser, async (req, res) => {
    if (!req.user) {
        res.status(401).send({
            success: false,
            payload: "Unauthorized user !",
        });
        return;
    }
    try {
        const id = req.params.id;

        const response = await Posts.findByIdAndDelete(id);
        res.status(200).send({
            success: true,
            payload: "Post deleted successfully !",
        });
    } catch (err) {
        res.status(500).send({ success: false, payload: err.message });
    }
});

module.exports = router;
/*
100 -> continue
102 -> processing
200 -> ok 
201 -> created 
400 -> bad request 
401 -> unauthorized
500 -> internal server error 

100 -> information 
200 -> successful 
300 -> redirection 
400 -> client error 
500 -> server error
*/
