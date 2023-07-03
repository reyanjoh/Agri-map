require('dotenv').config();
const PORT = process.env.PORT || 3001;
const DB = process.env.DB || 'mongodb://0.0.0.0:27017/agriMap';


const express = require('express');
const app = express();
const mongoose = require('mongoose');
app.use(express.json());

const farmersRouter = require('./backend/routes/farmersRouter')
const adminDARouter = require('./backend/routes/DA_adminRouter')
const landCoordinatesRouter = require('./backend/routes/landCoordinatesRouter')
const morgageRouter = require('./backend/routes/mortgageRouter')






mongoose.connect(DB, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
  console.log('Connected to DB');
  console.log('You may now start the Development');

});


app.use('/farmers', farmersRouter)
app.use('/da-admin', adminDARouter)
app.use('/landCoordinates', landCoordinatesRouter)
app.use('/morgage', morgageRouter)


app.listen(PORT, () => {
    console.log(`started @ http://localhost:${PORT}/`);
});