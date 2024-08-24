const { Router } = require('express');
const router = Router();
const multer = require('multer');
const { GridFSBucket } = require('mongodb');
const mongoose = require('mongoose');
const Blog = require('../models/blog');
const Comment = require('../models/comments');
const gfs = require('../services/gridfs');

const upload = multer({
  storage: multer.memoryStorage(), // Store files in memory temporarily
});

// Add new blog post page
router.get('/add-new', (req, res) => {
  return res.render("addblog", {
    user: req.user,
  });
});

// View a specific blog post
router.get("/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate('author');
  const comments = await Comment.find({ blogID: req.params.id }).populate('author');
  return res.render('blog', { user: req.user, blog, comments });
});

// Handle blog post creation
router.post('/', upload.single('coverimage'), async (req, res) => {
  const { title, body } = req.body;

  // Create a new GridFS bucket instance
  const bucket = new GridFSBucket(mongoose.connection.db, {
    bucketName: 'uploads'
  });

  // Create a write stream to GridFS
  const uploadStream = bucket.openUploadStream(req.file.originalname);
  uploadStream.end(req.file.buffer);

  uploadStream.on('finish', async () => {
    const coverImageURL = `/files/${uploadStream.filename}`;
    const blog = await Blog.create({
      title,
      body,
      coverImageURL,
      author: req.user._id,
    });
    return res.redirect(`/blog/${blog._id}`);
  });
});

// Handle new comment
router.post('/comment/:blogID', async (req, res) => {
  const comment = new Comment({
    content: req.body.content,
    author: req.user._id,
    blogID: req.params.blogID,
  });
  await comment.save();
  return res.redirect(`/blog/${req.params.blogID}`);
});

// Serve files from GridFS
router.get('/files/:filename', (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    if (!file || file.length === 0) {
      return res.status(404).json({ err: 'No file exists' });
    }

    const readstream = gfs.createReadStream({ filename: file.filename });
    readstream.pipe(res);
  });
});

module.exports = router;