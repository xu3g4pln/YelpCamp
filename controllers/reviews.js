const Campground = require("../models/campground");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash("success", "Created new review!");
    res.redirect(`/campgrounds/${campground.id}`);
};

module.exports.deleteReview = async (req, res) => {
    const { id: cid, rid } = req.params;
    await Campground.findByIdAndUpdate(cid, { $pull: { reviews: rid } });
    await Review.findByIdAndDelete(rid);
    req.flash("success", "Successfully deleted review!");
    res.redirect(`/campgrounds/${cid}`);
};
