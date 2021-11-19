const express = require("express");
const router = express.Router();
const { csrfProtection, asyncHandler } = require('../utils')
const db = require('../db/models')
const { User, CatList, Cat, Review, CatsInList } = db

router.get('/', asyncHandler(async (req, res) => {
    const catLists = await CatList.findAll({ order: [['updatedAt']], where: { userId: req.session.auth.userId }, include: Cat })
    res.json(catLists);
}))

const catListNotFound = catListId => {
    const error = new Error(`Cat List with ID ${catListId} could not be found`);
    error.title = "Cat List not found.";
    error.status = 404;
    return error;
};

router.delete('/:id(\\d+)', asyncHandler(async(req, res, next) => {
  const id = req.params.id;
  const catList = await CatList.findByPk(id);
  if (catList && catList.canDelete) {
    console.log('HI!!!!!!!');
    const catInList = await CatsInList.findOne({ where: { catListId: catList.id } });
    if (catInList) {
      await catInList.destroy();
    }
    await catList.destroy();
    res.status = 204;
    return res.end();
  } else {
    return next(catListNotFound(req.params.id));
  }
}));

router.post('/', asyncHandler(async (req, res) => {
  const { name } = req.body;
  console.log(name);
  const userId = req.session.auth.userId;

  if (name) {
    const newCatList = await CatList.create({ name, userId });
    res.json(newCatList);
  }
}));

router.put(
  "/:id(\\d+)",
  // tweetValidators,
  // handleValidationErrors,
  asyncHandler(async (req, res, next) => {
    const id = req.params.id;
    const { name } = req.body;

    const catList = await CatList.findByPk(id);

    if (catList) {
      const updatedCatList = await catList.update({
        name
      });

      res.json(updatedCatList);
    } else {
      next(catListNotFound(id));
    }
  })
);

module.exports = router