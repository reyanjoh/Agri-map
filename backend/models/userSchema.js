const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const userSchema = new mongoose.Schema({

    firstname:{
        type: String,
        required: true
    },
    lastname:{
        type: String,
        required: true
    },
    username:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    farmerInfo: {
        type: Schema.Types.ObjectId,
        ref: 'Farmer'
    },
    DAEmployeeInfo: {
        type: Schema.Types.ObjectId,
        ref: 'DAemployee'
    },
    userRole: {
        type: String,
        default: "FARMER",
        enum: [ "NON_ADMIN_DA_EMPLOYEE", "DA_ADMIN", "FARMER", "ROLE.SUPER_ADMIN"],
    }

}, { timestamps: true })
const User = mongoose.model('User', userSchema);

module.exports = User;