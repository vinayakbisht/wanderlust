
const express = require("express");
const router = express.Router({mergeParams: true});

const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer')                         // multer will parse the multipart/form-data comes from new.ejs form
const {storage} = require("../cloudConfig.js")
const upload = multer({ storage })                  // and then multer will save the files in cloudinary storage 

router.route("/")
  .get( wrapAsync(listingController.index))                    // index route
  .post( isLoggedIn, upload.single("listing[image]"), validateListing,           // create route  
  wrapAsync(listingController.createListing));    
 
// new route                                  // here new route is placed before show route,otherwise this new is considered as id
router.get("/new", isLoggedIn, listingController.renderNewForm);

//filter route
router.get("/filter", wrapAsync(listingController.filter));

//search route
router.post("/search", wrapAsync(listingController.search));

router.route("/:id")
  .get( wrapAsync(listingController.showListing))          // show route
  .put( isLoggedIn, isOwner, upload.single("listing[image]"), validateListing, wrapAsync(listingController.updateListing))    // update route
  .delete( isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));        // destroy route

// edit route
router.get("/:id/edit",isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;