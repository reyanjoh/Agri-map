const mongoose = require('mongoose');

const superAdminSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    }

})
const SuperAdmin = mongoose.model('SuperAdmin', superAdminSchema);

module.exports = SuperAdmin;