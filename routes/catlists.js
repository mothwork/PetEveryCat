const express = require("express");
const router = express.Router();
const { csrfProtection, asyncHandler } = require('../utils')
const db = require('../db/models')
const { User, CatList, Cat, Review } = db

router.get('/', asyncHandler(async(req, res) => {
    const catLists = await CatList.findAll({ where: { userId: req.session.auth.userId }, include: Cat })
    res.render('cat-lists', { title: "My Cat Lists", catLists });
}));

module.exports = router