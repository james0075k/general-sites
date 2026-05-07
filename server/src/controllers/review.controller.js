exports.getProductReviews = async (req, res, next) => {
  try {
    res.json({ message: "getProductReviews — not yet implemented", data: [] });
  } catch (err) { next(err); }
};

exports.createReview = async (req, res, next) => {
  try {
    res.status(201).json({ message: "createReview — not yet implemented" });
  } catch (err) { next(err); }
};

exports.updateReview = async (req, res, next) => {
  try {
    res.json({ message: "updateReview — not yet implemented" });
  } catch (err) { next(err); }
};

exports.deleteReview = async (req, res, next) => {
  try {
    res.json({ message: "deleteReview — not yet implemented" });
  } catch (err) { next(err); }
};
