const express = require('express')
const router = express.Router();

const {Mortgaged} = require('../models/landAndMortgagedSchema')


router.get('/view-mortgaged-land-info/:id', (req, res) =>{
    Mortgaged.findById(req.params.id).populate('location').populate('landOwner')
    // .populate('userRole')
    .then(DAemployee => res.json(DAemployee))
    .catch(err => res.status(400).json('err' + err));

    // res.send('sad')
});

router.post('/add-land', (req, res) => {
    const newMortgagedLand = new Mortgaged({
        name: req.body.name,
        phoneNumber:req.body.phoneNumber,
        hectares: req.body.hectares,
        location: req.body.location,
        landOwner: req.body.landOwner
    })

    newMortgagedLand.save()
    .then(() => res.json('newMortgagedLand land added'))
    .catch(err => res.status(400).json('' + err))
})

module.exports = router;