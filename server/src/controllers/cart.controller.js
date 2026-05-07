const Cart = require("../models/Cart");
const Product = require("../models/Product");

const recalcTotal = (items) =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0);

const populateCart = (cart) =>
  cart.populate("items.product", "name images price discountPrice stock slug");

exports.getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (cart) await populateCart(cart);
    res.json({ data: cart || { items: [], totalPrice: 0 } });
  } catch (err) { next(err); }
};

exports.addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const product = await Product.findById(productId);
    if (!product || !product.isActive)
      return res.status(404).json({ message: "Product not found" });
    if (product.stock < quantity)
      return res.status(400).json({ message: "Insufficient stock" });

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = new Cart({ user: req.user._id, items: [] });

    const price = product.discountPrice ?? product.price;
    const existingIdx = cart.items.findIndex(
      (i) => i.product.toString() === productId
    );

    if (existingIdx >= 0) {
      cart.items[existingIdx].quantity += +quantity;
    } else {
      cart.items.push({ product: productId, quantity: +quantity, price });
    }

    cart.totalPrice = recalcTotal(cart.items);
    await cart.save();
    await populateCart(cart);
    res.json({ data: cart });
  } catch (err) { next(err); }
};

exports.updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find(
      (i) => i.product.toString() === req.params.productId
    );
    if (!item) return res.status(404).json({ message: "Item not in cart" });

    if (+quantity <= 0) {
      cart.items = cart.items.filter(
        (i) => i.product.toString() !== req.params.productId
      );
    } else {
      item.quantity = +quantity;
    }

    cart.totalPrice = recalcTotal(cart.items);
    await cart.save();
    await populateCart(cart);
    res.json({ data: cart });
  } catch (err) { next(err); }
};

exports.removeCartItem = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (i) => i.product.toString() !== req.params.productId
    );
    cart.totalPrice = recalcTotal(cart.items);
    await cart.save();
    await populateCart(cart);
    res.json({ data: cart });
  } catch (err) { next(err); }
};

exports.clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOneAndUpdate(
      { user: req.user._id },
      { items: [], totalPrice: 0 },
      { new: true }
    );
    res.json({ data: cart || { items: [], totalPrice: 0 } });
  } catch (err) { next(err); }
};
