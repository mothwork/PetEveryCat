const express = require("express");
const router = express.Router();
const { csrfProtection, asyncHandler } = require('../utils')
const db = require('../db/models')
const { User, CatList, Cat, Review } = db

router.post('/', asyncHandler(async (req, res) => {
  const { rating, content, catId } = req.body
  const userId = req.session.auth.userId;

  if (rating && content) {
    const review = await Review.create({ rating, content, userId, catId });
    res.json(review);
  }
}));

router.delete('/:id(\\d+)', asyncHandler(async (req, res) => {
  console.log('Im in!');
  const id = req.params.id;
  const review = await Review.findByPk(id);
  if (review) {
    await review.destroy();
    res.status = 204;
    return res.send();
  }
}));




module.exports = router;