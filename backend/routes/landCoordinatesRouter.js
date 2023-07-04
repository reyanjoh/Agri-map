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

module.exports = router;