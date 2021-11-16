const express = require("express");
const router = express.Router();
const { csrfProtection, asyncHandler } = require('../utils')
const db = require('../db/models')
const { User, CatList, Cat, Review } = db

router.get('/', asyncHandler(async(req, res) => {
    const catLists = await CatList.findAll({ where: { userId: req.session.auth.userId }, include: Cat })
    res.render('cat-lists', { title: "My Cat Lists", catLists });
}))

const catListNotFound = catListId => {
    const error = new Error(`Cat List with ID ${catListId} could not be found`);
    error.title = "Cat List not found.";
    error.status = 404;
    return error;
};

router.get('/:id(\\d+)', asyncHandler(async(req, res, next) => {
    const catListId = req.params.id;
    const catList = await CatList.findByPk(catListId, { include: {
        model: Cat,
        include: Review
    } } );

    // Question: Do we want to include average reviews in the list?
    if (!catList || catList.userId !== req.session.auth.userId) {
        return next(catListNotFound(req.params.id));
    }
    else {
        res.render('cat-list', { title: catList.name, catList, userId: req.session.auth.userId })
    }
}));

router.delete('/:id(\\d+)', asyncHandler(async(req, res, next) => {
  const id = req.params.id;
  const catList = await CatList.findByPk(id);
  if (catList) {
    await catList.destroy();
    res.status = 204;
    return res.end();
  } else {
    return next(catListNotFound(req.params.id));
  }
}));

router.post('/', asyncHandler(async (req, res) => {
  const { name } = req.body;
  const userId = req.session.auth.userId;

  if (name) {
    const newCatList = await CatList.create({ name, userId });
    res.json(newCatList);
  }
}));

module.exports = router