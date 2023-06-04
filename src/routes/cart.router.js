import { Router } from "express";
import CartModel from "../dao/models/cart.model.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const carts = await CartModel.find().lean().exec();
    res.render("carts", { carts });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error retrieving carts" });
  }
});

router.get("/:id", async (req, res) => {
    const id = req.params.id;
  
    try {
      const carts = await CartModel.find().lean().exec();
      const cart = carts.find((c) => c._id.toString() === id);
      res.render("carts", { carts, cart });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Error retrieving cart details" });
    }
  });
  
router.post("/carts/:id", async (req, res) => {
  try {
    const newCart = await CartModel.create({});
    res.json({ status: "Success", newCart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error creating cart" });
  }
});

router.delete("/:cid/product/:pid", async (req, res) => {
  const cartID = req.params.cid;
  const productID = req.params.pid;

  try {
    const cart = await CartModel.findById(cartID);
    if (!cart) {
      return res.status(404).json({ status: "error", error: "Cart Not Found" });
    }

    cart.products = cart.products.filter((product) => product.id !== productID);
    await cart.save();

    res.json({ status: "Success", cart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error deleting product from cart" });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  const cartID = req.params.cid;
  const productID = req.params.pid;
  const quantity = req.body.quantity || 1;

  try {
    const cart = await CartModel.findById(cartID);
    if (!cart) {
      return res.status(404).json({ status: "error", error: "Cart Not Found" });
    }

    const productIndex = cart.products.findIndex((p) => p.id == productID);
    if (productIndex >= 0) {
      cart.products[productIndex].quantity += quantity;
    } else {
      cart.products.push({ id: productID, quantity });
    }

    await cart.save();

    res.json({ status: "Success", cart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error adding product to cart" });
  }
});

export default router;
