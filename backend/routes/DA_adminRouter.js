const express = require('express')
const router = express.Router();

const DAemployee = require('../models/DA.employeeSchema');
const userRole = require('../models/userRoleSchema');
const {isAdmin} = require('../middlewares/isSuperAdminAuth')


router.post('/login', (req, res) =>{
    DAemployee.findOne({
        username: req.body.username,
        password: req.body.password
    })
    // .populate('userRole')
    .then(DAemployee => res.json(DAemployee))
    .catch(err => res.status(400).json('err' + err));

    // res.send('sad')
});


router.get('/',isAdmin, (req, res) =>{
    DAemployee.find()
    // .populate('userRole')
    .then(DAemployee => res.json(DAemployee))
    .catch(err => res.status(400).json('err' + err));

    // res.send('sad')
});


router.post('/add', (req, res) =>{

    const newDAAdmin = new DAemployee({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        da_id: req.body.da_id,
        username: req.body.username,
        password: req.body.password,
        userRole: req.body.userRole
    })

    newDAAdmin.save()
    .then(() => res.json('user added'))
    .catch(err => res.status(400).json('' + err))

});


router.post('/add-role', (req, res) =>{

    const newUserRole = new userRole({
        role: req.body.role,
        da_employee: req.body.da_employee
    })

    newUserRole.save()
    .then(() => res.json('user Role added'))
    .catch(err => res.status(400).json('' + err))

});




module.exports = router;