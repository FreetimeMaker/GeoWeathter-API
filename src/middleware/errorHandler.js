const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.status) {
    return res.status(err.status).json({
      message: err.message,
      error: process.env.NODE_ENV === 'development' ? err : {},
    });
  }

  res.status(500).json({
    message: 'Interner Serverfehler',
    error: process.env.NODE_ENV === 'development' ? err.message : {},
  });
};

module.exports = errorHandler;
