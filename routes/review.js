
const express = require("express");
const router = express.Router({mergeParams: true});

const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js")
const reviewController = require("../controllers/reviews.js");

//Reviews
//post route
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));        //  /listings/:id/reviews   this is the common part that's why removed  
  

//reviews delete route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));


module.exports = router;