import app from './src/app';

import * as mongoose from 'mongoose';
require('dotenv').config();

// connecting to mongoDB
mongoose.connect(process.env.MONGODB_URL || '')
  .then(() => console.log("Successfully connected to mongoDB......."))
  .catch(err => console.log("Error while connecting to mongoDB.....", err));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running at port : ${PORT}`);
});







