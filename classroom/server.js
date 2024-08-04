const express = require("express");
const app = express();

const users = require("./routes/users.js");
const posts = require("./routes/posts.js");
const session = require("express-session");     // use to make our session stateful
const flash = require("connect-flash");
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const sessionOptions = { 
    secret: "mysupersecretstring",    // this is the secret used to signed the session Id cookie
    resave: false,
    saveUninitialized: true,
};

app.use(session( sessionOptions ));    
// now session id is sent & stored in the browser for any kind of request in the form of cookie. 

app.use(flash());

app.use((req,res,next) =>{
    res.locals.successMsg =  req.flash("success");      // res.local property use to set local variables to use them in template rendering
    res.locals.errorMsg =  req.flash("error");
    next();
});

app.get("/register", (req,res) =>{
    let{ name = "anonymous" } = req.query;
    req.session.name = name;

    if(name === "anonymous"){
        req.flash("error", "user not registered");
    } else{
        req.flash("success", "user registered successfully!");    // here success is the key with a message
    }        
    console.dir(req.session);        // req.session is an object
    res.redirect("/hello"); 
});

app.get("/hello", (req,res) => {
    res.render("page.ejs", {name: req.session.name});
});

// app.get("/reqcount", (req,res) =>{
//     if( req.session.count ){        //req.session will track the single session if session same hoga then count check hoga
//         req.session.count++;        // req.session is an object isme humne count variable add kiya hai 
//     } else {
//         req.session.count = 1;
//     }

//     res.send(`You have sent the request ${req.session.count} times`);
// });

app.get("/test", (req,res) =>{
    res.send("test successful");
});

// const cookieParser = require("cookie-parser");      // use to parse(read) cookies

// app.use(cookieParser("secretcode"));      //here secretcode is just like a stamp

// app.get("/getsignedcookie", (req,res) =>{
//     res.cookie("made-In", "china", {signed: true});
//     res.send("signed cookie sent");
// });

// app.get("/verify", (req,res) =>{            
//     console.dir(req.signedCookies);       // will get only signed cookie here only if someone does not change the original value 
//     res.send("cookie verified");           
// });

// //sending cookies  -  in the form of name value pair
// app.get("/getCookies", (req,res) =>{
//   res.cookie("greet", "namaste");        // here greet is name and namaste is its value
//   res.cookie("madeIn", "India");           // agar ek baar cookie send krdi to website ke har page ke paas us cookie ki access hogi
//   res.send("sent you some cookies");
// });

// app.get("/greet", (req,res) =>{
//     let {name = "anonymous"} = req.cookies ;
//     res.send(`Hi, ${name}`); 
// });

// app.get("/", (req,res) =>{
//     console.dir(req.cookies);     // will get unsigned cookie here
//     res.send("Hi, I am root!");
// });

// app.use("/users", users);              // all the related paths are segregatted through express.Router
// app.use("/posts", posts);


app.listen(3000, () =>{
    console.log("server is listening to port 3000");
});
