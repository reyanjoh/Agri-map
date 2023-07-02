require('dotenv').config();
const PORT = process.env.PORT || 3001;
const DB = process.env.DB || 'mongodb://0.0.0.0:27017/agriMap';
// const { config } = require('process');

const mongoose = require('mongoose');
const express = require('express');
const app = express();

app.use(express.json());

// app.use(config);


mongoose.connect(DB, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
  console.log('Connected to DB');
});

app.listen(PORT, () => {
    console.log(`started @ http://localhost:${PORT}/`);
});