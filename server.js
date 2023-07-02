require('dotenv').config();
const PORT = process.env.PORT || 3001;
const DB = process.env.DB || 'mongodb://0.0.0.0:27017/agriMap';


const express = require('express');
const app = express();
const mongoose = require('mongoose');
app.use(express.json());

const adminDARouter = require('./backend/routes/admin.DA')



mongoose.connect(DB, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
  console.log('Connected to DB');
  console.log('You may now start the Development');

});

app.use('/da-admin', adminDARouter)

app.listen(PORT, () => {
    console.log(`started @ http://localhost:${PORT}/`);
});