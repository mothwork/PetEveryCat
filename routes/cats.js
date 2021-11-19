const express = require('express')
const { csrfProtection, asyncHandler } = require('../utils')
const db = require('../db/models')
const { Cat, User, CatsInList, Review, CatList } = db
const { restoreUser, requireAuth, checkPermissions } = require("../auth")
const { check, validationResult } = require('express-validator')
const e = require('express')

const router = express.Router()

router.get('/', requireAuth, restoreUser, asyncHandler(async (req, res) => {
    try {
        const cats = await Cat.findAll()
        res.render('cats', { title: 'Cats', cats })
    } catch (error) {
        res.send(error)
    }

}))

router.get('/:catId(\\d+)', requireAuth, csrfProtection, restoreUser, asyncHandler(async (req, res) => {
    const { catId } = req.params;
    const { userId } = req.session.auth;
    const reviews = await Review.findAll({ include: User, where: {catId} });
    const userLists = await CatList.findAll({ include: User, order: ['id'], where: { userId } })
    console.log(reviews);    const cat = await Cat.findByPk(catId);
    const catsInLists = await CatsInList.findAll({ where: {catId} });
    // console.log(catsInLists);
    const catsInListsIds = catsInLists.map(join => join.catListId);

    const defaultLists = [];
    for (let i = 0; i < 3; i++) {
    defaultLists.push(userLists.shift());
    };

    let currentDefaultList = defaultLists.reduce((accum, currentList) => {
        if (catsInListsIds.includes(currentList.id)) {
            return currentList;
        } else {
            return accum;
        }
    }, null);

    if (!currentDefaultList) {
        currentDefaultList = defaultLists[1];
    }

    const freeUserLists = userLists.filter(list => (!catsInListsIds.includes(list.id)));

    res.render('cat-info', {title: cat.name, csrfToken: req.csrfToken(), cat, freeUserLists, defaultLists, reviews, currentDefaultList});
}));

router.post(`/:id(\\d+)/addToCatList`, csrfProtection, requireAuth, asyncHandler(async (req, res) => {
    const { catListId, previousDefaultId } = req.body;
    const catId = req.params.id;
    // console.log(previousDefaultId);
    // const listToAddTo = CatList.findByPk(catListId);

    if (previousDefaultId) {
        const removeFromList = await CatsInList.findOne({ where: { catListId: previousDefaultId, catId } })
        if (removeFromList) {
            removeFromList.destroy();
        }
    }

    await CatsInList.create({ catId, catListId });
    res.redirect(`/cats/${catId}`);
}));


router.get('/new', csrfProtection, restoreUser, requireAuth, asyncHandler(async (req, res) => {
    const { userId } = req.session.auth
    const cat = await Cat.build();
    res.render('new-cat', { Title: 'New cat', csrfToken: req.csrfToken(), cat, userId });
}));

const catValidators = [
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
    const validatorErrors = validationResult(req);
    if (validatorErrors.isEmpty()) {

        await newCat.save();
        const cat = await Cat.findOne({ where: { name } });
        const catList = await CatList.findOne({where:{name:"Want to Pet", userId: res.locals.user.id}})
        await CatsInList.create({catId: cat.id, catListId: catList.id})
        res.redirect(`/cats/${cat.id}`);
    } else {
        const errors = validatorErrors.array().map(e => {
            return e.msg
        })
        res.render('new-cat', { Title: 'New Cat', newCat, errors, csrfToken: req.csrfToken() })

    }
}))

router.get('/edit/:id(\\d+)', csrfProtection, restoreUser, requireAuth, catValidators, asyncHandler(async (req, res) => {
    let catId = req.params.id;
    const cat = await db.Cat.findByPk(catId);
    catId = cat.id

    checkPermissions(cat, res.locals.user)

    res.render('cats-edit', { Title: 'Edit Cat', cat, catId, csrfToken: req.csrfToken() })
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

        res.render('cats-edit', { Title: 'Edit Cat', cat, catId, errors, csrfToken: req.csrfToken() });
    }
}))

router.delete('/:id(\\d+)', requireAuth, async (req, res) => {
    const catId = req.params.id
    const cat = await db.Cat.findByPk(catId)
    checkPermissions(cat, res.locals.user)
    await db.CatsInList.destroy({ where: { catId } })
    await db.Review.destroy({ where: { catId } })
    await cat.destroy()

    res.json({ message: 'successful' })
});


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
