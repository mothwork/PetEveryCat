const express = require('express')
const { csrfProtection, asyncHandler } = require('../utils')
const db = require('../db/models')
const { Cat, User, CatsInList, Review, CatList } = db
const { restoreUser, requireAuth, checkPermissions } = require("../auth")
const { check, validationResult } = require('express-validator')
const e = require('express')

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

router.get('/:id(\\d+)', csrfProtection, restoreUser, asyncHandler(async (req, res) => {
    const id = req.params.id
    const catId = id
    const userId = res.locals.user.id
    const cat = await Cat.findOne({ where: { id } }, { include: { User } })
    const lists = await CatList.findAll({ where: { userId } })
    const listsCatIsIn = await CatsInList.findAll({ where: { catId }, })    //


    // const notDefaultList = lists.filter(async list => {
    //     const catInList = await CatsInList.findOne({where:{catId, catListId:list.id}})
    //     //console.log(catInList)
    //     console.log(list.canDelete)
    //     console.log(catInList)
    //     console.log(list.canDelete === true && !catInList)
    //     return list.canDelete === true && catInList !== null
    // });

    const notDefaultList = []
    lists.forEach(async (list)=>{
        const catInList = await CatsInList.findOne({where:{catId, catListId:list.id}})
        console.log(catInList)
        if (list.canDelete === true && catInList === null) {
            notDefaultList.push(list)
        }
    })

    console.log(notDefaultList)

    const reviews = await Review.findAll({ include: User, where: { catId } })

    let catListId
    let catListVal

    for (let i = 0; i < lists.length; i++) {
        const listEntry = lists[i];
        for (let j = 0; j < listsCatIsIn.length; j++) {
            const catsInListEntry = listsCatIsIn[j];
            if (listEntry.id === catsInListEntry.catListId) {
                catListId = listEntry.name
                catListVal = listEntry.name
                break
            }

        }
    }
    if (!catListId) {
        catListId = "Want to Pet?"
        catListVal = "Want to Pet"
    }


    res.render("cat-info", { Title: `${cat.name}`, cat, catListId, catListVal, reviews, csrfToken: req.csrfToken(), notDefaultList }) //Does this work?
}))


router.get('/new', csrfProtection, restoreUser, requireAuth, asyncHandler(async (req, res) => {
    const { userId } = req.session.auth
    const cat = await Cat.build();
    res.render('new-cat', { Title: 'New cat', csrfToken: req.csrfToken(), cat, userId });
}));

const catValidators = [
    // TODO: when database constraints are determined
    check('name')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a name')
        .isLength({ max: 50 })
        .withMessage('Name must be less than 50 characters'),
    check('breed')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a breed')
        .isLength({ max: 50 })
        .withMessage('Breed must be less than 50 characters'),
    check('size')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a size')
        .isLength({ max: 50 })
        .withMessage('Size must be less than 50 characters'),
    check('friendly')
        .exists({ checkFalsy: true })
        .withMessage('Please select an option for friendly'),
    check('coat')
        .exists({ checkFalsy: true })
        .withMessage('Please provide the color of the cat\'s coat')
        .isLength({ max: 50 })
        .withMessage('Color of coat must be less than 50 characters'),
]

router.post('/new', csrfProtection, restoreUser, requireAuth, catValidators, asyncHandler(async (req, res) => {
    const { name, breed, size, friendly, coat, userId, imgUrl } = req.body;
    const newCat = await Cat.build({
        name, breed, size, friendly, coat, userId, imgUrl
    })
    // const errors = [];
    const validatorErrors = validationResult(req);
    if (validatorErrors.isEmpty()) {
        await newCat.save();
        const cat = await Cat.findOne({ where: { name } });
        res.redirect(`/cats/${cat.id}`);
    } else {
        const errors = validatorErrors.array().map(e => {
            return e.msg
        })
        res.render('new-cat', { Title: 'New Cat', newCat, errors, csrfToken: req.csrfToken() })

    }
}))

router.get('/edit/:id(\\d+)', csrfProtection, restoreUser, requireAuth, catValidators, asyncHandler(async (req, res) => {
    const catId = req.params.id;
    const cat = await db.Cat.findByPk(catId);

    checkPermissions(cat, res.locals.user)

    res.render('cats-edit', { Title: 'Edit Cat', cat, csrfToken: req.csrfToken() })
}))

router.post('/edit/:id(\\d+)', csrfProtection, restoreUser, requireAuth, catValidators, asyncHandler(async (req, res) => {
    const catId = req.params.id;
    const catToUpdate = await db.Cat.findByPk(catId);

    checkPermissions(catToUpdate, res.locals.user)

    const { name, breed, size, friendly, coat, imgUrl } = req.body;

    const cat = { name, breed, size, friendly, coat, imgUrl }
    const validatorErrors = validationResult(req);
    if (validatorErrors.isEmpty()) {
        await catToUpdate.update(cat);
        res.redirect(`/cats/${catId}`);
    } else {
        const errors = validatorErrors.array().map(e => e.msg);
        res.render('cats-edit', { Title: 'Edit Cat', cat, errors, csrfToken: req.csrfToken() });
    }
}))

router.delete('/:id(\\d+)', requireAuth, async (req, res) => {
    const catId = req.params.id
    const cat = await db.Cat.findByPk(catId)
    checkPermissions(cat, res.locals.user)
    //await db.CatList.destroy({where: {catId}})
    await db.CatsInList.destroy({ where: { catId } })
    await db.Review.destroy({ where: { catId } })
    await cat.destroy()

    res.json({ message: 'successful' })
})

router.post(`/:id(\\d+)/addToCustomList`, csrfProtection, restoreUser, requireAuth, asyncHandler(async (req, res) => {
    const { catListId } = req.body;
    const catId = req.params.id;
    const catList = await CatList.findByPk(catListId);

    checkPermissions(catList, res.locals.user);

    const newCatinList = await CatsInList.build({ catId, catListId });
    await newCatinList.save();

    res.redirect(`/cats/${catId}`);
}));


router.post(`/:id(\\d+)/addToCatList`, csrfProtection, restoreUser, requireAuth, asyncHandler(async (req, res) => {
    //TODO add csrf protection to individual cat route

    const catId = req.params.id
    const userId = res.locals.user.id
    //All users lists
    const lists = await CatList.findAll({ where: { userId } })

    const {
        catList
    } = req.body

    //Finding the list the user the selected
    let catListId
    for (let i = 0; i < lists.length; i++) {
        const list = lists[i];
        if (list.name === catList) {
            catListId = list.id
        }
    }
    //Finds the lists that the cat is in
    let toDeleteArr = []
    const selectedList = await CatList.findByPk(catId)
    if (!selectedList.canDelete) {

        for (let i = 0; i < lists.length; i++) {
            const list = lists[i];
            if (list.id !== catListId && !list.canDelete) {
                toDeleteArr.push(list.id)
            }
        }
    }

    for (let i = 0; i < toDeleteArr.length; i++) {
        let id = toDeleteArr[i]
        await CatsInList.destroy({
            where: {
                catId: catId,
                catListId: id
            }
        })
    }

    await CatsInList.create({
        catListId,
        catId,
    })

    res.redirect(`/cats/${catId}`)

}))
router.get('/:id(\\d+)/reviews/new', requireAuth, csrfProtection, asyncHandler(async (req, res) => {

    const catId = req.params.id;
    const userId = req.session.auth.userId;
    const review = await Review.findOne({ where: { userId, catId } });
    if (!review) {
        const review = await Review.build();
        res.render('review-new', { title: "Create New Review", review, catId, csrfToken: req.csrfToken() });
    } else {
        res.redirect(`/reviews/${review.id}/edit`);
    }
}));

const reviewValidators = [
    check("rating")
        .exists({ checkFalsy: true })
        .withMessage("Please provide a rating")
        .custom(value => {
            if (value > 5 || value < 1) {
                throw new Error("Rating must be between 1 and 5")
            }
            else return true
        }),
    check("content")
        .exists({ checkFalsy: true })
        .withMessage("Please provide a review")
];

router.post('/:id(\\d+)/reviews/new', requireAuth, reviewValidators, csrfProtection, asyncHandler(async (req, res) => {
    const validatorErrors = validationResult(req);
    const { rating, content } = req.body;

    if (validatorErrors.isEmpty()) {
        const review = await Review.create({ rating, content, catId: req.params.id, userId: req.session.auth.userId });
        res.redirect(`/cats/${req.params.id}`);
    } else {
        const errors = validatorErrors.array().map(err => err.msg);
        res.render('review-new', { title: "Create New Review", review: { rating, content }, errors, csrfToken: req.csrfToken() });
    }
}));

module.exports = router
