
const express = require("express");
const router = express.Router();              // creates a new router object

//posts 
//index route
router.get("/", (req,res) => {
    res.send("get for posts");
});

//show route
router.get("/:id", (req,res) =>{
    res.send("get for post id");
});

//post route
router.post("/", (req,res) =>{
    res.send("post new post");
});

//delete route
router.delete("/:id", (req,res) =>{
    res.send("delete for post id");
});

module.exports = router;