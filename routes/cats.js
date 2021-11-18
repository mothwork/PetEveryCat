const express = require('express')
const { csrfProtection, asyncHandler } = require('../utils')
const db = require('../db/models')
const { Cat, User, CatsInList, Review, CatList } = db
const { restoreUser, requireAuth, checkPermissions } = require("../auth")
const { check, validationResult } = require('express-validator')
const e = require('express')
const review = require('../db/models/review')

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


router.get('/new', csrfProtection, restoreUser, requireAuth, asyncHandler(async(req, res) => {
    const { userId } = req.session.auth
    const cat = await Cat.build();
    res.render('new-cat', {Title: 'New cat', csrfToken: req.csrfToken(), cat, userId});
}));

const catValidators = [
    // TODO: when database constraints are determined
    check('name')
        .exists({checkFalsy: true})
        .withMessage('Please provide a name')
        .isLength({max: 50})
        .withMessage('Name must be less than 50 characters'),
    check('breed')
        .exists({checkFalsy: true})
        .withMessage('Please provide a breed')
        .isLength({max: 50})
        .withMessage('Breed must be less than 50 characters'),
    check('size')
        .exists({checkFalsy: true})
        .withMessage('Please provide a size')
        .isLength({max: 50})
        .withMessage('Size must be less than 50 characters'),
    check('friendly')
        .exists({checkFalsy: true})
        .withMessage('Please select an option for friendly'),
    check('coat')
        .exists({checkFalsy: true})
        .withMessage('Please provide the color of the cat\'s coat')
        .isLength({max: 50})
        .withMessage('Color of coat must be less than 50 characters'),
]

router.post('/new', csrfProtection, restoreUser, requireAuth, catValidators, asyncHandler(async(req, res) =>{
    const { name, breed, size, friendly, coat, userId, imgUrl } = req.body;
    const newCat = await Cat.build({
        name, breed, size, friendly, coat, userId, imgUrl
    })
    // const errors = [];
    const validatorErrors = validationResult(req);
    if(validatorErrors.isEmpty()) {
        await newCat.save();
        const cat = await Cat.findOne({ where: {name} });
        res.redirect(`/cats/${cat.id}`);
    } else {
        const errors = validatorErrors.array().map(e => {
           return e.msg
        })
        res.render('new-cat', {Title: 'New Cat', newCat, errors, csrfToken: req.csrfToken()})

    }
}))

router.get('/edit/:id(\\d+)', csrfProtection, restoreUser, requireAuth, catValidators, asyncHandler(async(req, res) => {
    const catId = req.params.id;
    const cat = await db.Cat.findByPk(catId);

    checkPermissions(cat, res.locals.user)

    res.render('cats-edit', {Title: 'Edit Cat', cat, csrfToken: req.csrfToken()})
}))

router.post('/edit/:id(\\d+)', csrfProtection, restoreUser, requireAuth, catValidators, asyncHandler(async(req, res) => {
    const catId = req.params.id;
    const catToUpdate = await db.Cat.findByPk(catId);

    checkPermissions(catToUpdate, res.locals.user)

    const { name, breed, size, friendly, coat, imgUrl } = req.body;

    const cat = { name, breed, size, friendly, coat, imgUrl }
    const validatorErrors = validationResult(req);
    if(validatorErrors.isEmpty()) {
        await catToUpdate.update(cat);
        res.redirect(`/cats/${catId}`);
    } else {
        const errors = validatorErrors.array().map(e => e.msg);
        res.render('cats-edit', {Title: 'Edit Cat', cat, errors, csrfToken: req.csrfToken()});
    }
}))

router.delete('/:id(\\d+)', requireAuth, async(req, res) => {
    const catId = req.params.id
    const cat = await db.Cat.findByPk(catId)
    checkPermissions(cat, res.locals.user)
    //await db.CatList.destroy({where: {catId}})
    await db.CatsInList.destroy({where: {catId}})
    await db.Review.destroy({where: {catId}})
    await cat.destroy()

    res.json({message: 'successful'})
})

router.post(`/:id/addToCatList`, restoreUser, requireAuth, asyncHandler( async (req, res) => {
    //TODO add csrf protection to individual cat route
    //get the user id
    const catId = req.params.id
    const userId = res.locals.user.id
    const lists = await CatList.findAll({where: {userId}})

    const {
        catList
    } = req.body

    let catListId
    for (let i = 0; i < lists.length; i++) {
        const list = lists[i];
        if (list.name === catList){
            catListId = list.id
        }
    }

    let toDeleteArr = []
    for (let i = 0; i < lists.length; i++) {
        const list = lists[i];
        if (list.id !== catListId) {
            toDeleteArr.push(list.id)
        }
    }
    //First we want to destroy any lists the cat is in?
    for (let i = 0; i < toDeleteArr.length; i++) {
        let id = toDeleteArr[i]
        await CatsInList.destroy({where:{
            catId: catId,
            catListId: id
        }})
    }
    
    await CatsInList.create({
        catListId,
        catId,
    })

    //await newCatInList.save()
    res.redirect('/catlists')

    //get the cat list associated with that id from the request

    //add the cat to the list they chose
    //check the other two lists, and remove the cat if it is found on those lists
}))

module.exports = router
