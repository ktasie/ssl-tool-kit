export default (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `${req.originalUrl} cannot be found`,
  });
};
