const mongoose = require('mongoose');

const landCoordinatesSchema = new mongoose.Schema({
    xAxis:{
        type: String,
        required: true
    },
    yAxis:{
        type: String,
        required: true
    },
    landOwner:[{
        type: Schema.Types.ObjectId,
        ref: 'Farmer'
    }]

})

const MortgagedSchema = new mongoose.Schema({
    location:[{
        type: Schema.Types.ObjectId,
        ref: 'LandCoordinates'
    }],
    landOwner:[{
        type: Schema.Types.ObjectId,
        ref: 'Farmer'
    }]

})


const LandCoordinates = mongoose.model('LandCoordinates', landCoordinatesSchema);
const Mortgaged = mongoose.model('Mortgaged', MortgagedSchema);


module.exports = {
    LandCoordinates,
    Mortgaged
}