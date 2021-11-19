# PetEveryCat


About our PetEveryCat app:
    Our app lets us view,make lists,and review a bunch of different amazingly cute cats. We can add them to lists that we create, leave reviews on each of the cats, and update the status of the cat to pet, currently petting, or want to pet.

Site: https://aa-peteverycat.herokuapp.com/

Wiki docs: https://github.com/mothwork/PetEveryCat/wiki

Technologies used:
    http-errors, express, cookie-parser, morgan, sequelize, session, express-session, SequelizeStore, pug, json

We added CRUD features for making a cat, making a cat list to put said cat or cats made by other people, and reviews for each cat.

Early on, we faced a database challenge when we were trying to delete a cat. We would try to delete a cat and would keep getting errors. We eventually realized a cat had dependencies because they may have had a review or may be in a cat list. We were able to fix this by removing those dependencies and then we were able to delete the cat without issues.

router.delete('/:id(\\d+)', requireAuth, async (req, res) => {
    const catId = req.params.id
    const cat = await db.Cat.findByPk(catId)
    checkPermissions(cat, res.locals.user)
    await db.CatsInList.destroy({ where: { catId } })
    await db.Review.destroy({ where: { catId } })
    await cat.destroy()

    res.json({ message: 'successful' })
})

The code above was used to solve the challenge we were experiencing early on.
