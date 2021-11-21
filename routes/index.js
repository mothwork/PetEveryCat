var express = require('express');
const { userNotFound } = require('../utils');
var router = express.Router();
const { User } = require('../db/models');

/* GET home page. */
router.get('/', async (req, res, next) => {
  let user;
  if(res.locals.authenticated) {
    user = res.locals.user;
  } else {
    user = await User.build();
  }
    res.render('index', { title: 'Pet Every Cat', user });
});

module.exports = router;
