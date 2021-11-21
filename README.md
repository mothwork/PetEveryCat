# PetEveryCat


## About our PetEveryCat app:
    Our app lets us view, make lists,and review a bunch of different amazingly cute cats. We can add them to lists that we create, leave reviews on each of the cats, and update the status of the cat to pet, currently petting, or want to pet.

Site: https://aa-peteverycat.herokuapp.com/

Wiki docs: https://github.com/mothwork/PetEveryCat/wiki

## Technologies used:
    http-errors, express, cookie-parser, morgan, sequelize, session, express-session, SequelizeStore, pug, json

    This project uses express as the backend, and pug for rendering html. Data is stored in a postgres database, and the backend interfaces it through sequelize. Authentication is handled by session auth, so once users sign in, they can remain signed in until that auth expires.

## Features
### CatsLists
For CatsLists, we decided early on that it would take advantage of api routes to dynamically update upon creation, updating, and deletion.

### Cats
Individual cats have a "pet" status and ability to be added to a catlist. When you change the cat status, it updates that dropdown menu to show you which status it is in. When you add a cat to a catlist, it removes that list from the drop down menu so that it can only be added to cat lists that it isn't already in.


## Challenges
Early on, we faced a database challenge when we were trying to delete a cat. We would try to delete a cat and would keep getting errors. We eventually realized a cat had dependencies because they may have had a review or may be in a cat list. We were able to fix this by removing those dependencies and then we were able to delete the cat without issues.

The following code was used to resolve this issue.
```js
router.delete('/:id(\\d+)', requireAuth, async (req, res) => {
    const catId = req.params.id
    const cat = await db.Cat.findByPk(catId)
    checkPermissions(cat, res.locals.user)
    await db.CatsInList.destroy({ where: { catId } })
    await db.Review.destroy({ where: { catId } })
    await cat.destroy()

    res.json({ message: 'successful' })
})
```


