const { Router } = require('express');
const router = Router();
const multer = require('multer');
const { GridFSBucket } = require('mongodb');
const mongoose = require('mongoose');
const Blog = require('../models/blog');
const Comment = require('../models/comments');
const gfs = require('../services/gridfs');

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
  const { title, body } = req.body;

  try {
    // Create a new GridFS bucket instance
    const bucket = new GridFSBucket(mongoose.connection.db, { bucketName: 'uploads' });

    // Create a write stream to GridFS
    const uploadStream = bucket.openUploadStream(req.file.originalname);
    uploadStream.end(req.file.buffer);

    uploadStream.on('finish', async () => {
      const coverImageURL = `/files/${uploadStream.filename}`;
      console.log(`Cover image URL: ${coverImageURL}`);  // Log URL for debugging
      const blog = await Blog.create({
        title,
        body,
        coverImageURL,
        author: req.user._id,
      });
      return res.redirect(`/blog/${blog._id}`);
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error uploading file.");
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

// Serve files from GridFS
router.get('/files/:filename', (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    if (err || !file) {
      return res.status(404).json({ err: 'No file exists' });
    }

    const readstream = gfs.createReadStream({ filename: file.filename });
    readstream.pipe(res);
  });
});

module.exports = router;