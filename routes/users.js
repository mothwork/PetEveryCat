const express = require('express');
const router = express.Router();
const { csrfProtection, asyncHandler, userNotFound } = require('../utils')
const bcrypt = require('bcryptjs')
const { check, validationResult } = require('express-validator')
const db = require('../db/models')
const { User, Cat, CatList, Review } = db
const { loginUser, logOutUser, restoreUser, checkPermissions, requireAuth } = require('../auth');
const { demoUser } = require('../config/index');


/* GET users listing. */
router.get('/', asyncHandler(async (req, res, next) => {
  const users = await User.findAll();
  res.render('users', {title: 'Pet Every Cat Users', users});
}));

router.post('/demouser', asyncHandler(async(req, res) => {
  const username = demoUser;
  const demouser = await User.findOne({ where: { username } })
  loginUser(req, res, demouser);
  //res.redirect(`/users/${demouser.id}/cats`);
}));

router.get('/:id(\\d+)', csrfProtection, asyncHandler(async(req, res) => {
  const userId = req.params.id;
  const currentUser = res.locals.user.id
  const user = await User.findByPk(userId, {include: [Cat, Review]});
  res.render('user', {title: 'User Page', user, csrfToken: req.csrfToken(), currentUser});
}));

router.get('/:id(\\d+)/edit', csrfProtection, asyncHandler(async(req, res) => {
  const userId = parseInt(req.params.id, 10);
  if (userId === res.locals.user.id) {
    const user = await User.findByPk(userId, {include: [Cat, Review]});
    res.render('user-edit', {title: 'Edit User Page', user, csrfToken: req.csrfToken()});
  } else {
    res.redirect(`/users/${res.locals.user.id}`);
  }
}));

const editUserValidators = [
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
    check('bio')
    .exists({ checkFalsy: true })
    .withMessage('You MUST provide a bio')
]


router.post('/:id(\\d+)/edit', editUserValidators, csrfProtection, asyncHandler(async(req, res) => {
  console.log(req.body)
  const { firstName, lastName, bio } = req.body
  const userId = parseInt(req.params.id, 10);
  if (userId === res.locals.user.id) {
    const user = await User.findByPk(userId);
    const validatorErrors = validationResult(req);
    if(validatorErrors.isEmpty()) {
      const updatedUser = await user.update({
        firstName, lastName, bio
      });
      res.redirect(`/users/${user.id}`);
    } else {
      const errors = validatorErrors.array().map(e => e.msg)
      res.render('user-edit', {title: 'Edit User Page', user, csrfToken: req.csrfToken(), errors});
    }
  } else {
    res.redirect(`/users/${res.locals.user.id}`);
  }
}))

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
    await CatList.create({userId: user.id, name: "Pet", canDelete: false});
    await CatList.create({userId: user.id, name: "Want to Pet", canDelete: false});
    await CatList.create({userId: user.id, name: "Currently Petting", canDelete: false});
    // TO DO: log in user
    loginUser(req, res, user);
    return res.redirect(`/users/${user.id}`);
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
  let errors = []

  if (validatorErrors.isEmpty()) {
    const user = await User.findOne({ where: { username } })

    if (user) {
      const isPassword = await bcrypt.compare(password, user.hashedPassword.toString())

      if (isPassword) {
        //TODO Log user in
        loginUser(req, res, user);
        req.session.save(() => res.redirect(`/${user.id}/cats`))
        //return res.redirect(`/${user.id}/cats`)
      }
    }
    errors.push('Invalid username or password')
  } else {
    errors = validatorErrors.array().map((e) => e.msg)
  }

  res.render('log-in', { Title: "Log In", csrfToken: req.csrfToken(), errors, username })


}))



router.post('/log-out', (req, res) => {
  logOutUser(req, res)

  //res.redirect('/')
})

router.get('/:id(\\d+)',  csrfProtection, asyncHandler(async(req, res) => {
  const userId = req.params.id;
  const user = await User.findByPk(userId, {include: [Cat, Review]});
  res.render('user', {title: 'User Page', user, csrfToken: req.csrfToken()});
}));

router.get('/:id(\\d+)/cats', restoreUser, requireAuth, asyncHandler(async (req, res) => {

  const userId = res.locals.user.id
  console.log(res.locals.user.id, "LOCALS")

  if (parseInt(req.params.id, 10) !== userId) {
    console.log(userId)
    return res.redirect(`/`)
  }
  const cats = await Cat.findAll({where: {userId}})
  res.render('my-cats', {Title: 'My Cats', cats})
}))



router.get('/:id(\\d+)/reviews', asyncHandler(async (req, res, next) => {
  const userId = req.params.id;
  let title;
  let thisUser;
  if (userId == req.session.auth.userId) {
    title = 'My Reviews';
    thisUser = true;
  } else {
    const user = await User.findByPk(userId);
    if (user) {
      title = `${user.username}'s Reviews`
      thisUser = false;
    } else {
      return next(userNotFound(userId));
    }
  }
  const reviews = await Review.findAll({ include: Cat, where: { userId }});
  res.render('user-reviews', { title, reviews, thisUser });
}));

module.exports = router;
