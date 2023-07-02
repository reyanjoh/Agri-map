const router = require('express').Router();
let DAAdmin = require('../models/userSchema');

router.route('/').get((res, req) =>{
    DAAdmin.find()
    .then(DAAdmin => res.json(DAAdmin))
    .catch(err => res.status(400).json('err' + err));
});

router.route('/add').post((res, req) =>{
    const username = req.body.username
    const password = req.body.password

    const newDAAdmin = new DAAdmin({
        username,
        password
    })

    newDAAdmin.save()
    .then(() => res.json('user added'))
    .catch(err => res.status(400).json('err' + err))

});




module.exports = router;