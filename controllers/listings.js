
const Listing = require("../models/listing.js");
const mbxGeocoding= require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req,res) =>{
    let allListings = await Listing.find();
    res.render("listings/index.ejs", {allListings});
};

module.exports.search = async (req,res) =>{
    let value = req.body.location;
    let allListings = await Listing.find( { $or: [ 
        {location: { $regex: value, $options: "i"}},          //$options: i makes the search case-insensitive
        {country: { $regex: value, $options: "i"}}             //$regex use to search for listings where the location field contains the value in the value variable as a substring
    ]
   });                        
    res.render("listings/index.ejs", {allListings});                                          
};

module.exports.filter = async(req,res) => {
    let{value} = req.query;
    let allListings = await Listing.find({category: value});
    res.render("listings/index.ejs", {allListings});
};

module.exports.renderNewForm = (req,res) =>{          
    res.render("listings/new.ejs");  
};

module.exports.showListing = async (req,res,next) =>{
    let{id} = req.params;
    const listing = await Listing.findById(id).populate( {path: "reviews", populate: {path: "author"}} ).populate("owner");    // nested populate is used here ,mtlb har ek listing ke liye uska review aa jaye , and har ek review ke liye uska author aa jaye
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    } else {
        res.render("listings/show.ejs",{listing});
    }   
};

module.exports.createListing = async (req,res) =>{
    // let{title,description,image,category,price,location,country} = req.body;  
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
        .send()

    let url = req.file.path;
    let filename = req.file.filename;

    const newListing =  new Listing(req.body.listing);    // listing is an object inside req.body
       newListing.owner = req.user._id;                    // req.user store the info of current user after login 
       newListing.image = { url, filename};

       newListing.geometry = response.body.features[0].geometry;
      
       await newListing.save();
       req.flash("success","New Listing Created!");
       res.redirect("/listings");
};

module.exports.renderEditForm = async (req,res) =>{
    let{id} = req.params;
   const listing = await Listing.findById(id);
   if(!listing){
    req.flash("error", "Listing you requested for does not exist!");
    res.redirect("/listings");
   } 
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/h_120,w_360");
    res.render("listings/edit.ejs", { listing, originalImageUrl });
}; 

module.exports.updateListing = async (req,res) =>{
    let{id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});    // here extracting the listing object
    
    if(typeof req.file !== "undefined") {    
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename};
    await listing.save();
    }
    
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req,res) =>{
    let{id} = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};