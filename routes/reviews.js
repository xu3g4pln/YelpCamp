const express = require("express");
const router = express.Router({ mergeParams: true });
const reviews = require("../controllers/reviews");
const { isLoggedIn, isReviewAuthor, validationReview } = require("../middleware");
const catchAsync = require("../utils/catchAsync");

router.post("/", isLoggedIn, validationReview, catchAsync(reviews.createReview));

router.delete("/:rid", isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;
