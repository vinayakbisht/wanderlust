
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

module.exports.createReview = async(req,res) =>{ 
    let {id} = req.params;
    let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    
    await newReview.save();
    await listing.save();            // changes in Listing model that's why we have to save

    req.flash("success","New Review Created!");
    res.redirect(`/listings/${id}`);
};


module.exports.destroyReview = async(req,res) =>{
    let{id,reviewId} = req.params;
    
    await Review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});    // jiski reviewId match hogi wo review pull (remove) ho jayega reviews aray se
    
    req.flash("success","Review Deleted!");
    res.redirect(`/listings/${id}`);
};