import express from "express";
import * as ReviewsController from "../controllers/reviews.js";
import { asyncWrapper } from "../helpers/asyncWrapper.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const [err, retrievedReviews] = await asyncWrapper(
    ReviewsController.getReviews(req.query.bookId)
  );
  if (err) res.status(404).json({ error: err.message });
  res.json(retrievedReviews);
});

router.post("/", async (req, res) => {
  // console.log("test inside Router post api",req.body);
  const [err, addeddReviews] = await asyncWrapper(
    ReviewsController.addReview(req.body)
  );
  if (err) res.status(422).json({ error: err.message });
  res.json(addeddReviews);
});

router.patch("/:id", async (req, res) => {
  const [err, updatedReview] = await asyncWrapper(
    ReviewsController.updateReview(req.params.id, req.body)
  );
  if (err) res.status(404).json({ error: err.message });
  res.json(updatedReview);
});

router.delete("/:id", async (req, res) => {
  const [err, deletedReview] = await asyncWrapper(
    ReviewsController.deleteReview(req.params.id)
  );
  if (err) res.status(404).json({ error: err.message });
  res.json(deletedReview);
});

export default router;
