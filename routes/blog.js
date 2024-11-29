const { Router } = require('express');
const router = Router();
const multer = require('multer');
const { GridFSBucket } = require('mongodb');
const mongoose = require('mongoose');
const Blog = require('../models/blog');
const Comment = require('../models/comments');
const { uploadImage } = require('../services/azureStorage');

// Use memory storage for multer
const upload = multer({ storage: multer.memoryStorage() });

// Add new blog post page
router.get('/add-new', (req, res) => {
  return res.render("addblog", {
    user: req.user,
  });
});

// View a specific blog post
router.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('author');
    const comments = await Comment.find({ blogID: req.params.id }).populate('author');
    res.render('blog', { user: req.user, blog, comments });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching blog post.");
  }
});

// Handle blog post creation
router.post('/', upload.single('coverimage'), async (req, res) => {
  try {
    const { title, body } = req.body;
    const coverImageURL = await uploadImage(req.file);
    
    const blog = await Blog.create({
      title,
      body,
      coverImageURL,
      author: req.user._id,
    });
    
    return res.redirect(`/blog/${blog._id}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating blog post.");
  }
});

// Handle new comment
router.post('/comment/:blogID', async (req, res) => {
  try {
    const comment = new Comment({
      content: req.body.content,
      author: req.user._id,
      blogID: req.params.blogID,
    });
    await comment.save();
    return res.redirect(`/blog/${req.params.blogID}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error adding comment.");
  }
});

module.exports = router;