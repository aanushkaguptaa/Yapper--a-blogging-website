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

const dbURI = process.env.MONGO_URL;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(dbURI, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
      serverSelectionTimeoutMS: 50000, // Increase server selection timeout
     socketTimeoutMS: 45000, // Increase socket timeout
    }
  });
  async function run() {
    try {
      // Connect the client to the server	(optional starting in v4.7)
      await client.connect();
      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
  }
  run().catch(console.dir);

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
