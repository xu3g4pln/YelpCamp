const express = require("express");
const router = express.Router({ mergeParams: true });
const Campground = require("../models/campground");
const Review = require("../models/review");
const { reviewSchema } = require("../schemas");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");

const validationReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

router.post(
    "/",
    validationReview,
    catchAsync(async (req, res) => {
        const campground = await Campground.findById(req.params.id);
        const review = new Review(req.body.review);
        campground.reviews.push(review);
        await review.save();
        await campground.save();
        req.flash("success", "Created new review!");
        res.redirect(`/campgrounds/${campground.id}`);
    })
);

router.delete(
    "/:rid",
    catchAsync(async (req, res) => {
        const { id: cid, rid } = req.params;
        await Campground.findByIdAndUpdate(cid, { $pull: { reviews: rid } });
        await Review.findByIdAndDelete(rid);
        req.flash("success", "Successfully deleted review!");
        res.redirect(`/campgrounds/${cid}`);
    })
);

module.exports = router;
