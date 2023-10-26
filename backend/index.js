const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();


const uri = 'mongodb://localhost:27017/projectvolthird'
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  mongoose.connect(uri, options)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

  app.use(cors({
    origin:'*',
  })); 
  app.use(express.json({ limit: '350mb' }));
  app.use(express.urlencoded({ limit: '350mb', extended: true }));



  const profileUpdateCrud = require('./profileUpdate/crud')
  const testCrud = require('./test/crud')
  const authCrud = require('./auth/crud')
  const notifyCrud = require('./notify/crud')
app.use('/app',
    testCrud,
    authCrud,
    notifyCrud,
    profileUpdateCrud
  )

  const port = 3000;
  app.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });