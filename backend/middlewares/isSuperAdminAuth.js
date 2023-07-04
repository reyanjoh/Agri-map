const DAemployee = require('../models/DA.employeeSchema');
const userRole = require('../models/userRoleSchema');


const isAdmin = (req, res, next) =>{
    console.log('sad');

    next()
}

module.exports = {
    isAdmin
}