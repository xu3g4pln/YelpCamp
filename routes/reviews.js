const express = require("express");
const router = express.Router({ mergeParams: true });
const Campground = require("../models/campground");
const Review = require("../models/review");
const { isLoggedIn, isReviewAuthor, validationReview } = require("../middleware");
const catchAsync = require("../utils/catchAsync");

router.post(
    "/",
    isLoggedIn,
    validationReview,
    catchAsync(async (req, res) => {
        const campground = await Campground.findById(req.params.id);
        const review = new Review(req.body.review);
        review.author = req.user._id;
        campground.reviews.push(review);
        await review.save();
        await campground.save();
        req.flash("success", "Created new review!");
        res.redirect(`/campgrounds/${campground.id}`);
    })
);

router.delete(
    "/:rid",
    isLoggedIn,
    isReviewAuthor,
    catchAsync(async (req, res) => {
        const { id: cid, rid } = req.params;
        await Campground.findByIdAndUpdate(cid, { $pull: { reviews: rid } });
        await Review.findByIdAndDelete(rid);
        req.flash("success", "Successfully deleted review!");
        res.redirect(`/campgrounds/${cid}`);
    })
);

module.exports = router;
