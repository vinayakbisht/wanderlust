const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    title: {
       type: String,
       required: true,
    },
    description: String,
    image: {
       url: String,
       filename: String,
    },
       
    price: Number,
    location: String,
    country: String,
    reviews: [
      {
         type: Schema.Types.ObjectId,
         ref: "Review",                         // reference from Review model
      }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",                            // reference from User model
      },
    geometry: {
        type: {
           type: String, // Don't do `{ geometry: { type: String } }`
           enum: ['Point'], // 'geometry.type' must be 'Point'
           required: true
         },
         coordinates: {
           type: [Number],
           required: true
         }
      },
      category: {
         type: String,
         enum: [ "Trending","Rooms","Iconic cities","Mountains","Castles",
            "Amazing pools","Camping","Beach","Arctic","Treehouses","Farms" 
         ]     
      }
});

//post -mongoose middleware for listingSchema to handle deletion 
listingSchema.post("findOneAndDelete", async(delListing) =>{      // here deleted listing will store in this listing variable
      if(delListing.reviews.length){ 
         let res = await Review.deleteMany({_id:  {$in: delListing.reviews}});
         console.log(res);
      };   
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing; 
