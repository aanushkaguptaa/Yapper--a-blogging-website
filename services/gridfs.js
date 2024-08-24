require('dotenv').config();
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');

const conn = mongoose.createConnection(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let gfs;

conn.once('open', () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads'); // Set the collection name where files will be stored
});

module.exports = gfs;