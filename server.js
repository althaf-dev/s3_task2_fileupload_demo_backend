const express = require('express');
const cors = require('cors');
require('dotenv').config();
const router = require('./router/router');
const { connectDb } = require('./config/db');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

connectDb(process.env.mongo_url);

app.use('/healthy', (req, res) => {
  res.status(200).json({
    message: 'server is healthy',
  });
});

app.use('/upload', router);


app.use((err,req,res,next)=>{
  const status = err?.status || 500
  res.status(status).json({
    message: err?.message || "something went wrong "
  });
})

app.listen(PORT, () => {
  console.log('server is running', PORT);
});
