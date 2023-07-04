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
        ref: 'Farmer'
    }

}, { timestamps: true })
const User = mongoose.model('User', userSchema);

module.exports = User;