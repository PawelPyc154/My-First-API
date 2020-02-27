const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Comment = require("../models/Comment");
const User = require("../models/User");

router.get("/", async (req, res) => {
  try {
    const comments = await Comment.find();
    res.json(comments);
  } catch (error) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.post("/", auth, async (req, res) => {
  const {comment} = req.body;

  try {
    let user = await User.findById(req.user.id);
    const newComment = new Comment({
      comment,
      author: user.name,
      like: [],
      user: req.user.id
    });
    const commentDB = await newComment.save();

    res.json(commentDB);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.put("/:id", auth, async (req, res) => {
  const {comment, author} = req.body;
  // Build contact object

  const commentFields = {};
  if (comment) commentFields.comment = comment;
  if (author) commentFields.author = author;

  try {
    let comment = await Comment.findById(req.params.id);

    if (!comment) return res.status(404).json({msg: "Contact not found"});

    //Make sure user owns  contact
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({msg: "Not authorized"});
    }
    comment = await Comment.findByIdAndUpdate(
      req.params.id,
      {$set: commentFields},
      {new: true}
    );
    res.json(comment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.put("/like/:id", auth, async (req, res) => {
  // Build contact object
  try {
    let comment = await Comment.findById(req.params.id);

    if (comment.like.includes(req.user.id)) {
      return res.status(404).json({msg: "Only one like"});
    }
    const commentFields = {like: [...comment.like, req.user.id]};

    if (!comment) return res.status(404).json({msg: "Contact not found"});

    comment = await Comment.findByIdAndUpdate(
      req.params.id,
      {$set: commentFields},
      {new: true}
    );
    res.json(comment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
router.put("/removeLike/:id", auth, async (req, res) => {
  // Build contact object

  try {
    let comment = await Comment.findById(req.params.id);
    // console.log(comment.like.includes(req.user.id));
    if (!comment.like.includes(req.user.id)) {
      console.log("You dont like this comment");
      return res.status(404).json({msg: "You dont like this comment"});
    }
    let allLike = [...comment.like];
    const removedLike = allLike.filter(like => like !== req.user.id);
    const commentFields = {like: removedLike};

    if (!comment) return res.status(404).json({msg: "Contact not found"});

    comment = await Comment.findByIdAndUpdate(
      req.params.id,
      {$set: commentFields},
      {new: true}
    );
    res.json(comment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    let comment = await Comment.findById(req.params.id);

    if (!comment) return res.status(404).json({msg: "Contact not found"});
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({msg: "Not authorized"});
    }

    await Comment.findByIdAndRemove(req.params.id);
    res.json({msg: "Contact remove"});
  } catch (error) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
