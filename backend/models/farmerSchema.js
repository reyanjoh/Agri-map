const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const farmerSchema = new mongoose.Schema({
    firstname:{
        type: String,
        required: true
    },
    lastname:{
        type: String,
        required: true
    },
    address:{
        type: String,
        required: true
    },
    phoneNumber:{
        type: Number
    },
    username:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    ownedLand:[{
        type: Schema.Types.ObjectId,
        ref: 'LandCoordinates'
    }],
    totalHectaresOwned:{
        type: Number,
        required: true
    },
    DA_referenceNumber:{
        type: Number,
        required: true
    },
    proofOfOwnership:{
        type: String,
        required: true
    }

}, { timestamps: true });
const Farmer = mongoose.model('Farmer', farmerSchema);

module.exports = Farmer;
