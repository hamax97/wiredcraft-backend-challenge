export function handleError(err, res) {
  if (err instanceof Error) {
    res.status(400).json({
      error: err.message,
    });
  } else {
    res.status(400).json(err);
  }
};
