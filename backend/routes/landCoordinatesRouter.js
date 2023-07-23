const express = require('express')
const router = express.Router();

const {LandCoordinates} = require('../models/landAndMortgagedSchema')


router.post('/add-land', (req, res) => {
    const newLand = new LandCoordinates({
        xAxis: req.body.xAxis,
        yAxis: req.body.yAxis,
        landOwner: req.body.landOwner
    })

    newLand.save()
    .then(() => res.json('land coordinates added'))
    .catch(err => res.status(400).json('' + err))
})

router.get('/view-lands', (req, res) => {
    LandCoordinates.find()
    // .populate('landOwner')
    .then((LandCoordinates) => res.json(LandCoordinates))
    .catch(err => res.status(400).json('' + err))
})

router.get('/view-land/:_id', (req, res) => {

    console.log(req.params);
    LandCoordinates.findOne(req.params)
    // .populate('landOwner')
    // .populate('landCoordinates')
     .populate('userInfo')
    .then((LandCoordinates) => res.json(LandCoordinates))
    .catch(err => res.status(400).json('' + err))
})

module.exports = router;