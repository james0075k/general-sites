const User = require("../models/User");
const Order = require("../models/Order");
const Product = require("../models/Product");

exports.getDashboardStats = async (req, res, next) => {
  try {
    const [totalUsers, totalProducts, totalOrders, revenueResult, recentOrders] =
      await Promise.all([
        User.countDocuments(),
        Product.countDocuments({ isActive: true }),
        Order.countDocuments(),
        Order.aggregate([
          { $match: { paymentStatus: "paid" } },
          { $group: { _id: null, total: { $sum: "$total" } } },
        ]),
        Order.find().sort("-createdAt").limit(5).populate("user", "name email"),
      ]);

    res.json({
      data: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue: revenueResult[0]?.total || 0,
        recentOrders,
      },
    });
  } catch (err) { next(err); }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const total = await User.countDocuments();
    const users = await User.find()
      .select("-password")
      .sort("-createdAt")
      .skip((+page - 1) * +limit)
      .limit(+limit);
    res.json({ data: users, total, page: +page, pages: Math.ceil(total / +limit) });
  } catch (err) { next(err); }
};

exports.getAllOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const query = status ? { orderStatus: status } : {};
    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .sort("-createdAt")
      .skip((+page - 1) * +limit)
      .limit(+limit)
      .populate("user", "name email");
    res.json({ data: orders, total, page: +page, pages: Math.ceil(total / +limit) });
  } catch (err) { next(err); }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus, paymentStatus } = req.body;
    const update = {};
    if (orderStatus) update.orderStatus = orderStatus;
    if (paymentStatus) {
      update.paymentStatus = paymentStatus;
      if (paymentStatus === "paid") update.paidAt = new Date();
    }
    const order = await Order.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json({ data: order });
  } catch (err) { next(err); }
};

exports.toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    user.isActive = !user.isActive;
    await user.save();
    res.json({ data: user });
  } catch (err) { next(err); }
};
