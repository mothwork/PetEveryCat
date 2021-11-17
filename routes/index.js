var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("testing Hello")
  res.render('index', { title: 'Pet Every Cat' });
});

module.exports = router;
