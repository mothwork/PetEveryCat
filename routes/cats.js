const express = require('express')
const { csrfProtection, asyncHandler } = require('../utils')
const db = require('../db/models')
const { Cat, User } = db
const { restoreUser } = require("../auth")
const { check, validationResult } = require('express-validator')

const router = express.Router()

router.get('/', restoreUser, asyncHandler(async (req, res) => {
    try {
        const cats = await Cat.findAll()
        res.render('cats', { Title: 'Cats', cats })
    } catch (error) {
        console.log(error)
        res.send(error)
    }

}))

router.get('/:id(\\d+)', restoreUser, asyncHandler(async (req, res) => {
    const id = req.params.id
    const cat = await Cat.findOne({where: {id}}, {include: {User}})
    //TODO add user link
    //TODO add reviews
    res.render("cat-info", {Title: `${cat.name}`, cat}) //Does this work?
}))

//Does not work due to sessionID error
router.get('/new', csrfProtection, restoreUser, asyncHandler(async(req, res) => {
    const { userId } = req.session.auth
    const cat = cat.build();
    res.render('new-cat', {Title: 'New cat', csrfToken: req.csrfToken(), cat, userId});
}));

const catValidators = [
    // TODO: when database constraints are determined
]

router.post('/new', csrfProtection, restoreUser, catValidators, asyncHandler(async(req, res) =>{
    const { name, breed, size, friendly, coat, userId, imgUrl } = req.body;
    const newCat = await Cat.build({
        name, breed, size, friendly, coat, userId, imgUrl
    })
    const errors = [];
    const validatorErrors = validationResult(req);
    if(validatorErrors.isEmpty()) {
        await newCat.save();
        const cat = await Cat.findOne({ where: {name} });
        res.redirect(`/cats/${cat.id}`);
    } else {
        const errors = validatorErrors.array().map(e => {
            e.msg
        })
        res.render('new-cat', {Title: 'New Cat', newCat, errors, csrfToken: req.csrfToken()})

    }
}))

module.exports = router
