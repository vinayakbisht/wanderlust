
//validation for Listing schema with the help of joi 
const joi = require("joi");

module.exports.listingSchema = joi.object({    // we are defining a schema and it will validate the data comes 
    listing: joi.object({               // from the form in the the form of object 
        title: joi.string().required(),
        description: joi.string().required(),
        image: joi.string().allow("",null),
        price: joi.number().required().min(0),
        country: joi.string().required(),
        location: joi.string().required(),
        category: joi.string().required(),
    }).required()
});


//validation for review Schema with the help of joi
module.exports.reviewSchema = joi.object({
    review: joi.object({
        rating: joi.number().required().min(1).max(5),
        comment: joi.string().required(),
    }).required(),
});


