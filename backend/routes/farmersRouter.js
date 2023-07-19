const express = require('express')
const router = express.Router();

const Farmer = require('../models/farmerSchema')
const Users = require('../models/userSchema')


router.get('/view-all', (req, res) => {
    Farmer.find()
    .populate('userInfo')
    .then(DAemployee => res.json(DAemployee))
    .catch(err => res.status(400).json('err' + err));
})


router.post('/add-farmer', (req, res) => {

    const user = Users.find({
        firstname : req.body.firstname,
        lastname: req.body.lastname
    })

    console.log(user);

    const newFarmer = new Farmer({

        userInfo: req.body.userInfo,
        address: req.body.address,
        phoneNumber: req.body.phoneNumber,
        totalHectaresOwned: req.body.totalHectaresOwned,
        DA_referenceNumber: req.body.DA_referenceNumber,
        proofOfOwnership: req.body.proofOfOwnership

    })

    newFarmer.save()
    .then(() => res.json('farmer added'))
    .catch(err => res.status(400).json('' + err))
})

router.delete('/delete-farmer/:_id', async (req, res) =>{

    Farmer.deleteOne(req.params)
    .then(result =>{
        console.log(result);
        res.status(200).json(result)
    })
    .catch(e => {
        console.log(e);
    })
})

module.exports = router;