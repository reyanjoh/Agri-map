const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DAemployeeSchema = new mongoose.Schema({
    
    firstname:{
        type: String,
        required: true
    },lastname:{
        type: String,
        required: true
    },da_id:{
        type: String,
        required: true
    },username:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    userRole: {
        type: Schema.Types.ObjectId,
        ref: 'userRole'
    }

}, { timestamps: true })
const DAemployee = mongoose.model('DAemployee', DAemployeeSchema);

module.exports = DAemployee;