const express = require('express')
const router = express.Router();

let DAAdmin = require('../models/DA.adminSchema');

router.get('/', (req, res) =>{
    DAAdmin.find()
    .then(DAAdmin => res.json(DAAdmin))
    .catch(err => res.status(400).json('err' + err));

    // res.send('sad')
});

router.post('/add', (req, res) =>{

    const newDAAdmin = new DAAdmin({
        username: req.body.username,
        password: req.body.password
    })

    newDAAdmin.save()
    .then(() => res.json('user added'))
    .catch(err => res.status(400).json('err' + err))

});




module.exports = router;