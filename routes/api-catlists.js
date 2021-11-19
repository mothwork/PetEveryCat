const express = require("express");
const router = express.Router();
const { asyncHandler } = require('../utils')
const db = require('../db/models')
const { CatList, Cat, CatsInList } = db
const { requireAuth } = require('../auth');

router.get('/', requireAuth, asyncHandler(async (req, res) => {
    const catLists = await CatList.findAll({ order: [['id', "ASC"]], where: { userId: req.session.auth.userId }, include: Cat })
    res.json(catLists);
}))

const catListNotFound = catListId => {
    const error = new Error(`Cat List with ID ${catListId} could not be found`);
    error.title = "Cat List not found.";
    error.status = 404;
    return error;
};

router.delete('/:id(\\d+)', requireAuth, asyncHandler(async(req, res, next) => {
  const id = req.params.id;
  const catList = await CatList.findByPk(id);
  if (catList && catList.canDelete) {
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

router.post('/', requireAuth, asyncHandler(async (req, res) => {
  const { name } = req.body;
  const userId = req.session.auth.userId;

  if (name) {
    const newCatList = await CatList.create({ name, userId });
    res.json(newCatList);
  }
}));

router.put("/:id(\\d+)", requireAuth, asyncHandler(async (req, res, next) => {
    const id = req.params.id;
    const { name } = req.body;

    const catList = await CatList.findByPk(id);

    if (catList) {
      const updatedCatList = await catList.update({ name });

      res.json(updatedCatList);
    } else {
      next(catListNotFound(id));
    }
  })
);

module.exports = router