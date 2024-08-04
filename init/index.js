const mongoose = require("mongoose");
const initData = require("./data.js");         // require SampleData object inside initData
const Listing = require("../models/listing.js");        // require model to insert SampleData on it

main()
.then( () => console.log("Connected to DB"))
.catch( err => console.log(err));

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust')
};

const initDB = async () => {
   await Listing.deleteMany({});
   initData.data = initData.data.map( (obj) => ({...obj, owner: "668eb06ba00e8f21c7fb096d"}));
    await Listing.insertMany(initData.data);   // here data array is inside initdata variable
    console.log("data was initialized");
};

initDB();