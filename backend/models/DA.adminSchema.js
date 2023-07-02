const mongoose = require('mongoose');

const DA_adminSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    }

})
const DAAdmin = mongoose.model('DAAdmin', DA_adminSchema);

module.exports = DAAdmin;