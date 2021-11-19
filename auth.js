const db = require('./db/models');

const loginUser = (req, res, user) => {
  req.session.auth = {
    userId: user.id
  };
  req.session.save(() => {res.redirect(`/users/${user.id}/cats`)})
  return
};

const restoreUser = async (req, res, next) => {
  console.log(req.session.auth)
  if (req.session.auth) {
    const { userId } = req.session.auth;
    try {
      const user = await db.User.findByPk(userId);
      if (user) {
        res.locals.authenticated = true;
        res.locals.user = user
        return next();
      }
    } catch (e) {
      res.locals.authenticated = false;
      return next(e);
    }
  } else {
    res.locals.authenticated = false;
    return next();
  }
};

const logOutUser = async (req, res) => {
  //await req.session.destroy()
  delete req.session.auth
  req.session.save(() => {res.redirect('/')})
}

const requireAuth = (req, res, next) => {
  if (!res.locals.authenticated) {
    return res.redirect('/users/log-in')
  }
  return next()
}

const checkPermissions = (resource, currentUser) => {
  if (resource.userId !== currentUser.id) {
    const err = new Error('Unauthorized Operation')
    err.status = 403;
    throw err
  }

}


module.exports = { loginUser, restoreUser, logOutUser, requireAuth, checkPermissions };
