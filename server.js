require('dotenv').config();
const PORT = process.env.PORT || 5001;
const DB = process.env.DB || 'mongodb://0.0.0.0:27017/agriMap';


const express = require('express');
const app = express();
const mongoose = require('mongoose');
app.use(express.json());
const cors = require('cors');

app.use(
  cors({
    origin: '*'
  })
)

const farmersRouter = require('./backend/routes/farmersRouter')
const adminDARouter = require('./backend/routes/DA_adminRouter')
const landCoordinatesRouter = require('./backend/routes/landCoordinatesRouter')
const morgageRouter = require('./backend/routes/mortgageRouter')
const user = require('./backend/routes/user')



mongoose.connect(DB, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
  console.log('Connected to DB');
  console.log('You may now start the Development');

});


app.use('/farmers', farmersRouter)
app.use('/da-admin', adminDARouter)
app.use('/landCoordinates', landCoordinatesRouter)
app.use('/morgage', morgageRouter)
app.use('/', user)



app.listen(PORT, () => {
    console.log(` server started @ http://localhost:${PORT}/`);
});