const csrf = require('csurf')

const csrfProtection = csrf({cookie: true})

const asyncHandler = (handler) => (req, res, next) => handler(req, res, next).catch(next);


const catListNotFound = catListId => {
  const error = new Error(`Cat List with ID ${catListId} could not be found`);
  error.title = "Cat List not found.";
  error.status = 404;
  return error;
};

const reviewNotFound = reviewId => {
  const error = new Error(`Review with ID ${reviewId} could not be found`);
  error.title = "Review not found.";
  error.status = 404;
  return error;
};

const userNotFound = userId => {
  const error = new Error(`User with ID ${userId} could not be found`);
  error.title = "User not found.";
  error.status = 404;
  return error;
};

module.exports = {
  csrfProtection, 
  asyncHandler, 
  catListNotFound,
  reviewNotFound,
  userNotFound
 }
