const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const farmerSchema = new mongoose.Schema({

    userInfo: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    address:{
        type: String,
        required: true
    },
    phoneNumber:{
        type: Number
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
