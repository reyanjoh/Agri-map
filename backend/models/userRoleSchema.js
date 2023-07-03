const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const userRoleSchema = new mongoose.Schema({
    role: {
        type: String,
        default: 'ROLE.PUB'
        // required: true
    },
    da_employee :[{
        type: Schema.Types.ObjectId,
        ref: 'DAemployee'
    }],

}, { timestamps: true })
const userRole = mongoose.model('userRole', userRoleSchema);

module.exports = userRole;