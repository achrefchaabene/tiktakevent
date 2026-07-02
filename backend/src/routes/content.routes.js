import express from "express";
import Content from "../models/Content.js";
import { requireAdmin } from "../middlewares/auth.js";
import { slugify } from "../utils/slugify.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const filter = {};

    if (req.query.status === "all") {
      // Admin view: no status filter.
    } else if (req.query.status) {
      filter.status = req.query.status;
    } else {
      filter.status = "published";
    }

    if (req.query.category) {
      filter.category = req.query.category;
    }

    const contents = await Content.find(filter)
      .populate("category")
      .sort({ createdAt: -1 });

    res.json(contents);
  } catch (error) {
    next(error);
  }
});

router.get("/:slug", async (req, res, next) => {
  try {
    const content = await Content.findOne({ slug: req.params.slug }).populate("category");

    if (!content) {
      return res.status(404).json({ message: "Content not found" });
    }

    res.json(content);
  } catch (error) {
    next(error);
  }
});

router.post("/", requireAdmin, async (req, res, next) => {
  try {
    const { title, description, body, category, media, status } = req.body;
    const content = await Content.create({
      title,
      slug: slugify(title),
      description,
      body,
      category,
      media,
      status
    });

    res.status(201).json(content);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", requireAdmin, async (req, res, next) => {
  try {
    const { title, description, body, category, media, status } = req.body;
    const content = await Content.findByIdAndUpdate(
      req.params.id,
      {
        title,
        slug: slugify(title),
        description,
        body,
        category,
        media,
        status
      },
      { new: true, runValidators: true }
    );

    res.json(content);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", requireAdmin, async (req, res, next) => {
  try {
    await Content.findByIdAndDelete(req.params.id);
    res.json({ message: "Content deleted" });
  } catch (error) {
    next(error);
  }
});

export default router;
