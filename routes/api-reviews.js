const express = require("express");
const router = express.Router();
const { asyncHandler, reviewNotFound } = require('../utils')
const { requireAuth } = require('../auth');
const db = require('../db/models')
const { Review } = db

router.post('/', requireAuth, asyncHandler(async (req, res) => {
  const { rating, content, catId } = req.body
  const userId = req.session.auth.userId;

  if (rating && content) {
    const review = await Review.create({ rating, content, userId, catId });
    res.json(review);
  }
}));

router.delete('/:id(\\d+)', requireAuth, asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const review = await Review.findByPk(id);
  if (review) {
    await review.destroy();
    res.status = 204;
    return res.send();
  } else {
    next(reviewNotFound(id));
  }
}));




module.exports = router;