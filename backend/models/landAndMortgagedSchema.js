const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const landCoordinatesSchema = new mongoose.Schema({
    xAxis:{
        type: Number,
        required: true
    },
    yAxis:{
        type: Number,
        required: true
    },
    landOwner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }

}, { timestamps: true })

const MortgagedSchema = new mongoose.Schema({
    
    mortgagedTo: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    hectares: {
        type: Number,
        required: true
    },
    location:{
        type: String,
        required: true
    },
    coordinates:[{
        type: Schema.Types.ObjectId,
        ref: 'LandCoordinates'
    }],
    landOwner:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    landOwnerInString:{
        type: String,
        required: true
    }

}, { timestamps: true })


const LandCoordinates = mongoose.model('LandCoordinates', landCoordinatesSchema);
const Mortgaged = mongoose.model('Mortgage', MortgagedSchema);


module.exports = {
    LandCoordinates,
    Mortgaged
}