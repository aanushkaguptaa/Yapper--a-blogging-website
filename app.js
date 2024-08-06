require('dotenv').config();

const express= require('express');
const app = express();
const userRoute= require('./routes/user');
const blogRoute= require('./routes/blog');
const mongoose= require('mongoose');
const cookieParser= require('cookie-parser');
const blog= require('./models/blog');

app.set("view engine", "ejs");

const dbURI = process.env.MONGO_URL;

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);  // Exit the process if connection fails
});

const path= require('path');
const checkForCookies = require('./middlewares/authentication');
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

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
})
