require('dotenv').config();
const PORT = process.env.PORT || 3001;
const DB = process.env.DB || 'mongodb://0.0.0.0:27017/blogs';

const express = require('express');
const app = express();



app.listen(PORT, () => {
    console.log(`started @ http://localhost:${PORT}/`);
});