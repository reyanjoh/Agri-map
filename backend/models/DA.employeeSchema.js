const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DAemployeeSchema = new mongoose.Schema({
    userInfo: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
    ,da_id:{
        type: String,
        required: true
    }

}, { timestamps: true })
const DAemployee = mongoose.model('DAemployee', DAemployeeSchema);

module.exports = DAemployee;