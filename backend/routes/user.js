const express = require('express')
const router = express.Router();

const User = require('../models/userSchema');
const userRole = require('../models/userRoleSchema');

router.post('/login', (req, res) =>{
    User.findOne({
        username: req.body.username,
        password: req.body.password
    })
    .then(User => res.json(User))
    .catch(err => res.status(400).json('err' + err));

    // res.send('sad')
});

router.post('/add-user', (req, res) => {
    const newUser = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        username: req.body.username,
        password: req.body.password,
        farmerInfo: req.body.farmerInfo,
        DAEmployeeInfo: req.body.DAEmployeeInfo

    })
    newUser.save()
    .then(() => res.json('user added'))
    .catch(err => res.status(400).json('' + err))
})

router.get('/view-all-users', (req, res) => {
    User.find()
    .populate('farmerInfo')
    .then((users) => res.json(users))
    .catch(err => res.status(400).json('' + err))
})


module.exports = router;