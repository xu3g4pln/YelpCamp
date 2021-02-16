const express = require("express");
const router = express.Router();
const campgrounds = require("../controllers/campgrounds");
const { isLoggedIn, validationCampground, isAuthor } = require("../middleware");
const catchAsync = require("../utils/catchAsync");

router
    .route("/")
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, validationCampground, catchAsync(campgrounds.createCampground));

router.get("/new", isLoggedIn, campgrounds.renderNewCampground);

router
    .route("/:id")
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, validationCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditCampground));

module.exports = router;
