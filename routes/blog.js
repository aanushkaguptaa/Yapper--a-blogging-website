const {Router}= require('express');
const router = Router();
const multer= require('multer');
const path= require('path');
const Blog = require('../models/blog');
const Comment = require('../models/comments');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve('./public/uploads'));
    },
    filename: function (req, file, cb) {
      const fileName= `${Date.now()}-${file.originalname}`;
      cb(null, fileName);
    },
});

const upload = multer({ storage: storage });

router.get('/add-new', (req, res)=>{
    return res.render("addblog", {
        user: req.user,
    });
});

router.get("/:id", async (req, res)=>{
    const blog= await Blog.findById(req.params.id).populate('author');
    const comments= await Comment.find({blogID: req.params.id}).populate('author');
    return res.render('blog', { user: req.user, blog, comments,});
    
})

router.post('/', upload.single('coverimage'), async (req, res)=>{
    const {title, body}= req.body;
    const blog= await Blog.create({
        title,
        body,
        coverImageURL: `/uploads/${req.file.filename}`,
        author: req.user._id,
    })
    return res.redirect(`/blog/${blog._id}`);
});

router.post('/comment:blogID', async (req, res)=>{
    const comment= new Comment.create({
        content: req.body.content,
        author: req.user._id,
        blogID: req.params.blogID,
    })
    return res.redirect(`/blog/${req.params.blogID}`);
})

module.exports= router;