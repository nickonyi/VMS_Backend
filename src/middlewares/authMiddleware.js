export const ensureAuth = (req, res, next) => {
  if (req.session.auth) {
    return next();
  }

  return res.status(401).json({
    message: "Authentication required.",
  });
};
