const express = require('express');
const router = express.Router();
const { csrfProtection, asyncHandler } = require('../utils')
const bcrypt = require('bcryptjs')
const { check, validationResult } = require('express-validators')
const db = require('../db/models')
const { User } = db

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.get('/sign-up', csrfProtection, asyncHandler(async (req, res) => {
  const user = await User.build() // Does this need an await?
  res.render('sign-up', {Title: 'Sign Up', user, csrfToken: req.csrfToken()})
}))


module.exports = router;
