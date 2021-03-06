const express = require('express');
const router = express.Router();
const { csrfProtection, asyncHandler } = require('../utils')
const bcrypt = require('bcryptjs')
const { check, validationResult } = require('express-validator')
const db = require('../db/models')
const { User, Cat, CatList, Review } = db
const { loginUser, logOutUser, restoreUser, } = require('../auth');
const { demoUser } = require('../config/index');
const { requireAuth } = require('../auth')

router.use(requireAuth)

router.get('/:id(\\d+)/edit', csrfProtection, asyncHandler(async(req, res) => {

    const userId = req.session.auth.userId;
    const reviewId = req.params.id;
    const review = await Review.findByPk(reviewId, { include: Cat });
    res.render('edit-review', { title: 'Edit Review', review, userId, csrfToken: req.csrfToken() })
}))

const reviewValidators = [
    check("rating")
      .exists({ checkFalsy: true })
      .withMessage("Please provide a rating")
      .matches(/^[0-9]+$/)
      .withMessage('Rating must be a number!')
      .custom(value => {
          if (value > 5 || value < 1) {
              throw new Error("Rating must be between 1 and 5")
          }
          else return true
      }),
    check("content")
      .exists({ checkFalsy: true })
      .withMessage("Please provide a review")
]

router.post('/:id(\\d+)/edit', reviewValidators, csrfProtection, asyncHandler(async (req, res) => {
    const validatorErrors = validationResult(req);
    const userId = req.session.auth.userId;
    const reviewId = req.params.id;
    const { content, rating } = req.body;
    const review = await Review.findByPk(reviewId, { include: Cat });

    if (validatorErrors.isEmpty()) {
        await review.update({
            rating,
            content
        });
        res.redirect(`/users/${userId}/reviews`);
    } else {
        const errors = validatorErrors.array().map(error => error.msg);
        res.render('edit-review', { title: "Edit Review", errors, userId, review, csrfToken: req.csrfToken() })
    }
}))



module.exports = router
