require('dotenv').config();
const PORT = process.env.PORT || 3001;
const DB = process.env.DB || 'mongodb://0.0.0.0:27017/agriMap';
// const { config } = require('process');

const express = require('express');
const app = express();
app.use(express.json());

// app.use(config);


app.listen(PORT, () => {
    console.log(`started @ http://localhost:${PORT}/`);
});