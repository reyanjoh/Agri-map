const express = require('express')
const router = express.Router();

const Farmer = require('../models/farmerSchema')

router.get('/view-all', (req, res) => {
    Farmer.find()
    // .populate('userRole')
    .then(DAemployee => res.json(DAemployee))
    .catch(err => res.status(400).json('err' + err));
})


router.post('/add-farmer', (req, res) => {
    const newFarmer = new Farmer({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        address: req.body.address,
        phoneNumber: req.body.phoneNumber,
        username: req.body.username,
        password: req.body.password,
        ownedLand: req.body.ownedLand,
        totalHectaresOwned: req.body.totalHectaresOwned,
        DA_referenceNumber: req.body.DA_referenceNumber,
        proofOfOwnership: req.body.proofOfOwnership

    })

    newFarmer.save()
    .then(() => res.json('farmer added'))
    .catch(err => res.status(400).json('' + err))
})

module.exports = router;