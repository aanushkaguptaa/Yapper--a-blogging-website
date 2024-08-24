require('dotenv').config();

const express= require('express');
const app = express();
const userRoute= require('./routes/user');
const blogRoute= require('./routes/blog');
const mongoose= require('mongoose');
const cookieParser= require('cookie-parser');
const blog= require('./models/blog');
const { MongoClient, ServerApiVersion } = require('mongodb');

app.set("view engine", "ejs");

const uri = process.env.MONGO_URL;

mongoose.connect(uri)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("Some error: ", err));

const path= require('path');
const checkForCookies = require  ('./middlewares/authentication');
app.set("views", path.resolve('./views'));

app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(checkForCookies('token'));
app.use(express.static(path.resolve('./public')));

app.get('/', async (req, res)=>{
    const blogs= await blog.find({}).sort({createdAt: -1});

    res.render("home",{ user: req.user, blogs: blogs, });
})

app.use('/user', userRoute);
app.use('/blog', blogRoute);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
})
