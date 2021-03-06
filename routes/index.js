var express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    User = require("../models/user");

router.get("/", function(req, res) {
    res.render("landing");
});


router.get("/register", function(req, res) {
    res.render("register");
});

router.post("/register", function(req, res) {
    User.register(new User({username:req.body.username}), req.body.password, function(err, user) {
        if(err) {
            req.flash("error", err.message);
            return res.redirect("register");
        }
        passport.authenticate("local")(req, res, function() {
            res.redirect("/recipes");
        });
    });
});

router.get("/login", function(req, res) {
    res.render("login");
});

router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/recipes",
        failureRedirect: "/login",
        failureFlash: true
    }), function(req, res) {
});


router.get("/logout", function(req, res){
    req.flash("success", "Logged You Out");
    req.logout();
    res.redirect("/recipes");
});


module.exports = router;