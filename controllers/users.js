
const User = require("../models/user.js");

module.exports.renderSignupForm = (req,res) =>{
    res.render("users/signup.ejs");
};

module.exports.signup = async(req,res) =>{
    try{
        let{ username, email, password } = req.body;
        const newUser = new User({username, email});       // {username: username , email: email}
    
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) =>{           // req.login() use to automatic login after signup 
            if(err){                                // login hote hi passport serializeUser ki help se user ki info req.user me save kra dega
                return next(err);
            }
            req.flash("success", "Welcome to Wanderlust!");
            res.redirect("/listings");
        });
        
    } catch(err){
        req.flash("error", err.message);          // err.message came from passport
        res.redirect("/signup");
    } 
};

module.exports.renderLoginForm = (req,res) =>{
    res.render("users/login.ejs");
};

module.exports.login =  async(req,res) =>{
    req.flash("success", "Welcome back to Wanderlust!");
    let redirectUrl = res.locals.redirectUrl || "/listings";    // || is used if req.locals.redirectUrl is undefined than "/listings" will get store in variable
    res.redirect(redirectUrl);           // by default passport reset the req.session automatically after login so thats why we save the original Url in res.locals
};

module.exports.logout =  (req,res,next) =>{
    req.logout((err) =>{                               // logout hote hi req.user se user ki info remove ho jayegi
        if(err){                                
            return next(err);
        }
        req.flash("success", "You are logged Out!");
        res.redirect("/listings");
    });
};
