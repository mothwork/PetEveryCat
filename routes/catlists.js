const express = require("express");
const router = express.Router();
const { csrfProtection, asyncHandler } = require('../utils');
const db = require('../db/models');
const { requireAuth } = require('../auth');
const { User, CatList, Cat, Review, CatsInList } = db
const { catListNotFound } = require('../utils')

router.get('/', requireAuth, asyncHandler(async(req, res) => {
    const catLists = await CatList.findAll({ where: { userId: req.session.auth.userId }, include: Cat })
    res.render('cat-lists', { title: "My Cat Lists", catLists });
}));


router.get('/:id(\\d+)', requireAuth,  asyncHandler(async (req, res, next) => {
    const catListId = req.params.id;
    const catList = await CatList.findByPk(catListId, {
        include: {
            model: Cat,
            include: Review
        }
    });

    // Question: Do we want to include average reviews in the list?
    if (!catList || catList.userId !== req.session.auth.userId) {
        return next(catListNotFound(req.params.id));
    }
    else {
        res.render('cat-list', { title: catList.name, catList, userId: req.session.auth.userId })
    }
}));

// router.delete('/:id(\\d+)', requireAuth, asyncHandler(async(req, res, next) => {
//   const catId = req.params.id;
//   const catList = await CatList.findByPk(id);
//   const catsInList = CatsInList.findOne( { where: { catListId: catList.id }});
//   console.log("HI");
//   console.log(catsInList);
//   if (catList && catList.canDelete) {
//     try {
//       await CatsInList.destroy({ where: { catListId: catList.id } });
//       await catList.destroy();
//     } catch (e) {
//       console.log(e);
//       next(e);
//     }
//     res.status = 204;
//     return res.end();
//   } else {
//     return next(catListNotFound(req.params.id));
//   }
// }));

router.post('/', requireAuth, asyncHandler(async (req, res) => {
  const { name } = req.body;
  const userId = req.session.auth.userId;

  if (name) {
    const newCatList = await CatList.create({ name, userId });
    res.json(newCatList);
  }
}));





module.exports = router
