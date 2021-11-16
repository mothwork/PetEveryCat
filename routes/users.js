const express = require('express');
const router = express.Router();
const { csrfProtection, asyncHandler } = require('../utils')
const bcrypt = require('bcryptjs')
const { check, validationResult } = require('express-validator')
const db = require('../db/models')
const { User } = db
const { loginUser, logOutUser, } = require('../auth');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.get('/sign-up', csrfProtection, asyncHandler(async (req, res) => {
  const user = await User.build() // Does this need an await?
  res.render('sign-up', { Title: 'Sign Up', user, csrfToken: req.csrfToken() })
}));

const signupValidators = [
  check('firstName')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a value for First Name')
    .isLength({ max: 50 })
    .withMessage('First Name must not be longer than 50 characters'),
  check('lastName')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a value for Last Name')
    .isLength({ max: 50 })
    .withMessage('Last Name must not be longer than 50 characters'),
  check('username')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a value for Username')
    .isLength({ max: 50 })
    .withMessage('Username must not be longer than 50 characters')
    .custom((value) => {
      return User.findOne({ where: { username: value } })
        .then(user => {
          if (user) {
            return Promise.reject('The provided username is already in use');
          }
        });
    }),
  check('password')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a value for Password')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/, 'g')
    .withMessage('Password must contain at least 1 lowercase letter, uppercase letter, number, and special character (i.e. "!@#$%^&*")'),
  check('confirmPassword')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a value for Confirm Password')
    .custom((value, { req }) => {
      if (value !== req.body.password && req.body.password) {
        throw new Error('Password and Confirm Password do not match')
      } else {
        return true;
      };
    }),
  check('bio')
    .exists({ checkFalsy: true })
    .withMessage('You MUST provide a bio')
];

router.post('/sign-up', signupValidators, csrfProtection, asyncHandler(async (req, res) => {
  const { firstName, lastName, username, password, bio } = req.body;

  const user = await User.build({
    firstName, lastName, username, bio
  });

  const validatorErrors = validationResult(req);

  if (validatorErrors.isEmpty()) {
    const hashedPassword = await bcrypt.hash(password, 10);
    user.hashedPassword = hashedPassword;
    await user.save()
    // TO DO: log in user
    loginUser(req, res, user);
    return res.redirect('/');
  }
  const errors = validatorErrors.array().map(e => e.msg);
  res.render('sign-up', { title: 'Sign Up', user, csrfToken: req.csrfToken(), errors });
}))

router.get('/log-in', csrfProtection, (req, res) => {
  res.render('log-in', { Title: 'Log In', csrfToken: req.csrfToken() })
})

const loginValidators = [
  check('username')
    .exists({ checkFalsy: true })
    .withMessage('Please enter a Username'),
  check('password')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a value for Password')
]

router.post('/log-in', csrfProtection, loginValidators, asyncHandler(async (req, res) => {
  const { username,
    password
  } = req.body

  const validatorErrors = validationResult(req);
  const errors = []

  if (validatorErrors.isEmpty()){
    const user = await User.findOne({where: {username}})

    if (user){
      const isPassword = await bcrypt.compare(password, user.hashedPassword.toString())

      if (isPassword){
        //TODO Log user in
        loginUser(req, res, user);
        return res.redirect('/')
      }
    }
    errors.push('Invalid username or password')
  } else {
    errors = validatorErrors.array().map((e) => e.msg)
  }

  res.render('log-in', {Title: "Log In", csrfToken: req.csrfToken(), errors, username} )


}))


router.post('/log-out', (req,res) => {
  logOutUser(req, res);
  res.redirect('/')
})

module.exports = router;
