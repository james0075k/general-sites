const Product = require("../models/Product");

exports.getProducts = async (req, res, next) => {
  try {
    const { page = 1, limit = 12, category, search, sort = "-createdAt", featured } = req.query;
    const query = { isActive: true };
    if (category) query.category = category;
    if (featured === "true") query.isFeatured = true;
    if (search) query.name = { $regex: search, $options: "i" };

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate("category", "name slug")
      .sort(sort)
      .skip((+page - 1) * +limit)
      .limit(+limit);

    res.json({ data: products, total, page: +page, pages: Math.ceil(total / +limit) });
  } catch (err) { next(err); }
};

exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, isActive: true })
      .populate("category", "name slug");
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ data: product });
  } catch (err) { next(err); }
};

exports.createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ data: product });
  } catch (err) { next(err); }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ data: product });
  } catch (err) { next(err); }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch (err) { next(err); }
};
