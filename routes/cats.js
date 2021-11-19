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
        res.render('cats', { Title: 'Cats', cats })
    } catch (error) {
        //console.log(error)
        res.send(error)
    }

}))

router.get('/:id(\\d+)', requireAuth, csrfProtection, restoreUser, asyncHandler(async (req, res) => {
    
    const catId = req.params.id;
    const userId = res.locals.user.id
    const listsCatIsIn = await Cat.findOne({ include: CatList, where: { id: catId } });
    const listsUserHas = await CatList.findAll({ where: { userId } });
    const reviews = await Review.findAll({ include: User, where: { catId } });
    const cat = await Cat.findByPk(catId);
    console.log(cat);

    const listsCatisInId = listsCatIsIn.CatLists.map(list => list.id);

    const currentDefaultList = listsCatIsIn.CatLists.reduce((accum, list) => {
        if (listsUserHas.includes(list)) {
            return list;
        } else {
            return accum;
        }
    });

    const defaultLists = [];
    const customLists = [];
    const listsCatIsNotIn = [];

    listsUserHas.forEach(list => {
        if (list.canDelete) {
            customLists.push(list);
            if (!listsCatisInId.includes(list.id)) {
                listsCatIsNotIn.push(list);
            }
        } else {
            defaultLists.push(list);
        }
    });

    res.render("cat-info", { Title: `${cat.name}`, cat, reviews, csrfToken: req.csrfToken(), defaultLists, currentDefaultList, listsCatIsNotIn });
}));


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
    //let errors = [];
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
    //catId = catToUpdate.id

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
    //await db.CatList.destroy({where: {catId}})
    await db.CatsInList.destroy({ where: { catId } })
    await db.Review.destroy({ where: { catId } })
    await cat.destroy()

    res.json({ message: 'successful' })
})

// router.post(`/:id(\\d+)/addToCustomList`, csrfProtection, restoreUser, requireAuth, asyncHandler(async (req, res) => {
//     const { catListId } = req.body;
//     const catId = req.params.id;
//     const catList = await CatList.findByPk(catListId);

//     if (catList) {
//         checkPermissions(catList, res.locals.user);

//         const newCatinList = await CatsInList.build({ catId, catListId });
//         await newCatinList.save();
//     }
//     res.redirect(`/cats/${catId}`);
//     return
// }));


router.post(`/:id(\\d+)/addToCatList`, csrfProtection, restoreUser, requireAuth, asyncHandler(async (req, res) => {
    const id = req.params.id;
    const { catListId } = req.body;
    const listToAddTo = await CatList.findByPk(catListId);
    const catToAdd = await Cat.findByPk(id);

    if (listToAddTo.canDelete) {
        await CatsInList.create({catId: catToAdd.id, catListId: listToAddTo.id});
    } else {
        const listCatIsIn = await CatsInList.findOne({ where: {catId: catToAdd.id } });
        if (listCatIsIn) {
            await listCatIsIn.destroy();
        }
        await CatsInList.create({catId: catToAdd.id, catListId: listToAddTo.id});
    }
    res.redirect(`/cats/${id}`);
}));

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
