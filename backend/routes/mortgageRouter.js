const express = require('express')
const router = express.Router();

const {Mortgaged} = require('../models/landAndMortgagedSchema')

router.get('/view-all', (req, res) =>{
    Mortgaged.find()
    .populate('landOwner')
    .populate('coordinates')
    .then(mortgagedLands => {
        // console.log(mortgagedLands)
        res.json(mortgagedLands)
    })
    .catch(err => res.status(400).json('err' + err));

    // res.send('sad')
});


router.get('/view-mortgaged-land-info/:id', (req, res) =>{
    Mortgaged.findById(req.params.id).populate('location').populate('landOwner')
    // .populate('userRole')
    .then(mortgagedLand => res.json(mortgagedLand))
    .catch(err => res.status(400).json('err' + err));

    // res.send('sad')
});

router.post('/add-land', (req, res) => {
    const newMortgagedLand = new Mortgaged({
        mortgagedTo: req.body.mortgagedTo,
        phoneNumber:req.body.phoneNumber,
        hectares: req.body.hectares,
        location: req.body.location,
        landOwnerInString: req.body.landOwnerInString,
        coordinates: req.body.coordinates,
    })
    
    newMortgagedLand.save()
    .then((res) => {
        res.json(res)
    })
    .catch(err => res.status(400).json('' + err))
})

router.delete('/delete-mortgaged-land/:_id', async (req, res) =>{

    Mortgaged.deleteOne(req.params)
    .then(result =>{
        console.log(result);
        res.status(200).json(result)
    })
    .catch(e => {
        console.log(e);
    })
})

module.exports = router;