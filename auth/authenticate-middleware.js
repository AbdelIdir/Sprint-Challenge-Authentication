/* 
  complete the middleware code to check if the user is logged in
  before granting access to the next middleware/route handler
*/

module.exports = function restricted(req, res, next) {
  const { user_name, password } = req.headers;

  if (req.session && req.session.user) {
    next();
  } else {
    res.status(401).json({ message: "You are not authorized " });
    console.log(req.session.user);
  }
};

