const mongoose = require('mongoose');

const farmerSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    address:{
        type: String,
        required: true
    },
    phoneNumber:{
        type: Int
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
        type: Int,
        required: true
    },
    DA_referenceNumber:{
        type: Int,
        required: true
    },
    proofOfOwnership:{
        type: File,
        required: true
    }

}, { timestamps: true });
const Farmer = mongoose.model('Farmer', farmerSchema);

module.exports = Farmer;
