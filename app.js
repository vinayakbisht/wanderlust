if(process.env.NODE_ENV != "production"){
    require('dotenv').config();                    // for Development phase
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");

const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const dbUrl = process.env.ATLASDB_URL;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));

app.use(express.urlencoded({extended: true}));             // use to parse urlencoded data comes through forms
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

main()
.then( () => console.log("Connected to DB"))
.catch( err => console.log(err));

async function main() {
    await mongoose.connect(dbUrl);
};

const store = MongoStore.create({            // now session related info stored in atlas Db 
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
      },
    touchAfter: 24 * 3600,                           //  you are saying to the session be updated only one time in a period of 24 hours, does not matter how many request's are made (with the exception of those that change something on the session data) 
});

store.on("error", (err) =>{
    console.log("Error in MONGO SESSION STORE", err);
});

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000 ,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true, 
    },
};


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));     // authenticate() generates a function that is used in passport'sLocalStrategy

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());            // serializeUser() Generates a function that is used by Passport to serialize users into the session
passport.deserializeUser(User.deserializeUser());       //  deserializeUser() Generates a function that is used by Passport to deserialize users into the session

app.get("/", (req,res) =>{
    res.redirect("/listings")
});

app.use( (req,res,next) =>{
    res.locals.successMsg = req.flash("success");       // now we can use this successMsg(array) with any ejs template even with boilerplate ejs template 
    res.locals.errorMsg  = req.flash("error");
    res.locals.currUser = req.user;               // we have used this in navbar.ejs template
    next();
});

// //demoUser 
// app.get("/demouser", async(req,res) =>{
//     let fakeUser = new User({
//         email: "student@gmail.com",
//         username: "rahul"
//     });

//    let registeredUser = await User.register(fakeUser,"helloworld");       // fakeUser is user & helloworld is the password
//     res.send(registeredUser);                         // this register method will save this fakeuser in the database 
// });

app.use("/listings", listingRouter);               // /listings(parent route) se match hoke listings wale routes use honge 
app.use("/listings/:id/reviews", reviewRouter);    //  /listings/:id/reviews(parent route) se match hoke reviews wale route use honge
app.use("/", userRouter);

app.all("*", (req,res,next) => {
    next(new ExpressError(404, "Page not found!"));
});

//error handling middleware
app.use((err,req,res,next) =>{
    let{statusCode = 500, message = "Some error occured" } = err;
    res.status(statusCode).render("error.ejs", {message});
});

app.listen(3030, () =>{
    console.log("Server is listening to port 3030");
});



