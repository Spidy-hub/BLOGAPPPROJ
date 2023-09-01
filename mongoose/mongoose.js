const mongoose = require('mongoose')
require('dotenv').config()
const DB = process.env.DATABASE_URL;

mongoose.connect(DB)
.then(() => {console.log(`Database is connected ${DB}`)})
.catch((error) => {console.log(error)})
