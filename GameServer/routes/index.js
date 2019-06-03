var express = require('express');
var router = express.Router();
var path = require("path");

/* GET home page. */
router.get('/', function (req, res, next) {
    console.log('execute worker pid is' + process.pid);
    res.json('execute worker pid' + process.pid);
});

router.get('/lobby', (req, res, next) => {
    res.sendFile(path.join(__dirname + '../public/index.html'));
});

module.exports = router;
