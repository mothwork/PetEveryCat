var express = require('express');
const { userNotFound } = require('../utils');
var router = express.Router();
const { User } = require('../db/models');

/* GET home page. */
router.get('/', function(req, res, next) {
  let user;
  if(res.locals.authenticated) {
    user = res.locals.user;
  } else {
    user = User.build();
  }
    res.render('index', { title: 'Pet Every Cat', user });
});

module.exports = router;
