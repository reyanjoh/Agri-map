const express = require('express')
const router = express.Router();

const User = require('../models/userSchema');
const userRole = require('../models/userRoleSchema');
const Farmer = require('../models/farmerSchema');


router.post('/login', (req, res) =>{
    User.findOne({
        username: req.body.username,
        password: req.body.password
    })
    .then(User => {

        const userInfo = {
            username : User.username,
            password : User.password,
            userRole : User.userRole

        }
        

        res.json(userInfo)
    })
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
        DAEmployeeInfo: req.body.DAEmployeeInfo,
        userRole: req.body.userRole

    })
    newUser.save()
    .then((newUser) => res.json(newUser))
    .catch(err => res.status(400).json('' + err))
})

router.get('/view-all', (req, res) => {
    User.find()
    .populate('farmerInfo')
    .then((users) => res.json(users))
    .catch(err => res.status(400).json('' + err))
})


router.delete('/delete-user/:_id', async (req, res) =>{
    Farmer.deleteOne({ userInfo:req.params })
    .then(data =>{
        console.log(data);
    })
    
    // if(Farmer.findOne(req.params)){
        
    // }
    // console.log(req.params);
    User.deleteOne(req.params)
    .then(result =>{
        console.log(result);
        res.status(200).json(result)
    })
    .catch(e => {
        console.log(e);
    })
})


module.exports = router;