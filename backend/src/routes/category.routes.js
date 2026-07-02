import express from "express";
import Category from "../models/Category.js";
import { requireAdmin } from "../middlewares/auth.js";
import { slugify } from "../utils/slugify.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json(categories);
  } catch (error) {
    next(error);
  }
});

router.post("/", requireAdmin, async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const category = await Category.create({
      name,
      slug: slugify(name),
      description
    });

    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", requireAdmin, async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      {
        name,
        slug: slugify(name),
        description
      },
      { new: true, runValidators: true }
    );

    res.json(category);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", requireAdmin, async (req, res, next) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: "Category deleted" });
  } catch (error) {
    next(error);
  }
});

export default router;

