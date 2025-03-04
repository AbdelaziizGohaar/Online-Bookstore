import express from "express";
import * as CartController from "../controllers/cart.js";
import { asyncWrapper } from "../helpers.js";
import CustomError from "../errors/customError.js";
import "express-async-errors";

const router = express.Router();

// Add item to cart
router.post("/", async (req, res) => {
  const [err, addedItem] = await asyncWrapper(CartController.addItem(req.body));
  if (err) throw new CustomError(err.message, 422);
  res.json(addedItem);
});

// Get all cart items
router.get("/", async (req, res) => {
  const [err, cartItems] = await asyncWrapper(CartController.getCartItems(req.query.userId));
  if (err) throw new CustomError(err.message, 404);
  res.json(cartItems);
});

// Update cart item quantity
router.patch("/:id", async (req, res) => {
  const [err, updatedItem] = await asyncWrapper(CartController.updateItem(req.params.id, req.body));
  if (err) throw new CustomError(err.message, 422);
  res.json(updatedItem);
});

// Remove item from cart
router.delete("/:id", async (req, res) => {
  const [err, deletedItem] = await asyncWrapper(CartController.removeItem(req.params.id));
  if (err) throw new CustomError(err.message, 404);
  res.json({ message: "Item removed successfully", deletedItem });
});

export default router;
