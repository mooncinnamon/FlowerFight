const express = require('express');
const router = express.Router();

/*
    Todo : select Starting Member; (Room master)
    Todo : How to Turn member;
    Todo : betting System
 */
router.post('/start', function(req, res, next) {
    console.log('game','start');
    res.send('game starting');
});

router.post('/betting', function(req, res, next) {
    console.log('game','betting');
    res.send('game betting');
});


module.exports = router;
