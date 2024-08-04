
const Listing = require("./models/listing.js");
const {listingSchema,reviewSchema} = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");
const Review = require("./models/review.js");

module.exports.isLoggedIn = (req,res,next) =>{
    if( !req.isAuthenticated()) {                // req.isAuthenticated() is a passport method
        req.session.redirectUrl = req.originalUrl;         // originalUrl is the path which we want to access after login
        // we did this to keep track of where the user wanted to go before being redirected to the login page
       
        req.flash("error", "You must be logged in to create listing!");
        return res.redirect("/login");
    } 
    next();
};

module.exports.saveRedirectUrl = (req,res,next) =>{
   if (req.session.redirectUrl){
    res.locals.redirectUrl =  req.session.redirectUrl;         // we did this because  passport reset the req.session automatically after login so thats why we save the original Url in res.locals
   }                                                           // res.locals is used to pass data to the view being rendered
   next();
};

module.exports.isOwner = async(req,res,next) =>{
    let{id} = req.params;
    let listing = await Listing.findById(id);
   if ( !listing.owner._id.equals(res.locals.currUser._id)){
    req.flash("error", "You are not the Owner of this listing");
    return res.redirect(`/listings/${id}`);             // return isliye kiya hai taki niche ke operations execute na ho 
   }
   next();
};

module.exports.validateListing = (req,res,next) =>{
    let {error} = listingSchema.validate(req.body);      // listingSchema will validate req.body
    console.log(error);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
};

module.exports.validateReview = (req,res,next) => {
    let {error} = reviewSchema.validate(req.body);
    console.log(error);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
};

module.exports.isReviewAuthor = async(req,res,next) =>{
    let{ id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
   if ( !review.author._id.equals(res.locals.currUser._id)){
    req.flash("error", "You are not the Author of this review");
    return res.redirect(`/listings/${id}`);             // return isliye kiya hai taki niche ke operations execute na ho 
   }
   next();
};