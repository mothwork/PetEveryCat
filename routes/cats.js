const express = require('express')
const { csrfProtection, asyncHandler } = require('../utils')
const db = require('../db/models')
const { Cat } = db
const { restoreUser } = require("../auth")

const router = express.Router()

router.get('/', restoreUser, asyncHandler(async (req, res) => {
    const cats = await Cat.findAll()
    res.render('cats', { Title: 'Cats', cats })
}))

router.get('/:id(\\d+)', restoreUser, asyncHandler(async (req, res) => {
    const catId = req.params.id
    const cat = await Cat.findByPk(catId, {include: {User}})
    //TODO add reviews
    res.render("cat-info", {Title: `${cat.name}`, cat}) //Does this work?
}))

