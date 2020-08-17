var express = require("express"),
    router = express.Router(),
    Recipe = require("../models/recipe"),
    Comment = require("../models/comment"),
    middleware = require("../middleware");

var multer = require("multer");
var storage = multer.diskStorage({
    filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
    }
});
var imageFilter = function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Please only put in an image file'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter});

require('dotenv').config();
var cloudinary = require("cloudinary");
const recipe = require("../models/recipe");

cloudinary.config({ 
    cloud_name: 'dfehcpzdd', 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET
});

router.get("/", function(req, res) {
    Recipe.find({}, function(err, recipes) {
        if (err) {
            console.log(err);
        } else {
            res.render("recipes/index", {recipes: recipes, currentUser: req.user});
        }
    })
});

router.post("/", middleware.isLoggedIn, upload.single('image'), function(req, res) {
    cloudinary.v2.uploader.upload(req.file.path, function(err, result) {
        req.body.recipe.image = result.secure_url;
        req.body.recipe.imageId = result.public_id;
        req.body.recipe.author = {
            id: req.user._id,
            username: req.user.username
        };
        Recipe.create(req.body.recipe, function(err, recipe) {
            if (err) {
                req.flash("error", err.message);
                console.log(err);
                return res.redirect("back");
            }
            console.log(recipe + " newly created");
            res.redirect("/recipes/" + recipe.id);
        });
    });
});

router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("recipes/new");
});

router.get("/:id", function(req, res) {
    Recipe.findById(req.params.id).populate("comments").exec(function(err, recipe) {
        if(err || !recipe) {
            req.flash("error", "Recipe not found");
            res.redirect("back");
        } else {
            res.render("recipes/show", {recipe: recipe});
        }
    });
});

router.get("/:id/edit", middleware.verifyOwner, function(req, res) {
    Recipe.findById(req.params.id, function(err, recipe) {
        res.render("recipes/edit", {recipe: recipe});
    });
});

router.put("/:id", middleware.verifyOwner, upload.single("image"), function(req, res) {
    Recipe.findById(req.params.id, function(err, recipe) {
        if(err) {
            req.flash("error", err.message);
            return res.redirect("back");
        } else {
            if(req.file) {
                console.log(recipe.imageId)
                cloudinary.v2.uploader.destroy(recipe.imageId, function(err) {
                    if(err) {
                        req.flash("error", err.message);
                        // return res.redirect("back");
                    }
                    cloudinary.v2.uploader.upload(req.file.path, function(err, result) {
                        if(err) {
                            req.flash("error", err.message);
                            // return res.redirect("back");
                        }
                        console.log(result.public_id);
                        recipe.imageId = result.public_id;
                        recipe.image = result.secure_url;
                        recipe.save();
                    })
                });
            }
            Recipe.findByIdAndUpdate(req.params.id, req.body.recipe, function(err, recipe) {
                if(err) {
                    req.flash("error", err.message);
                    return res.redirect("back");
                } else {
                    return res.redirect("/recipes/" + req.params.id);
                }
            });
        }
    });
});

router.delete("/:id", middleware.verifyOwner, function(req, res) {
    Recipe.findByIdAndRemove(req.params.id, function(err, recipe) {
        if(err) {
            res.redirect("/recipes");
        } else {
            cloudinary.v2.uploader.destroy(recipe.imageId, function(err) {
                if(err) {
                    req.flash("error", err.message);
                }
            });
            recipe.comments.forEach((comment) => {
                Comment.findByIdAndRemove(comment, function(err, comment) {
                    if(err){
                        console.log(err);
                    }
                });
            });
            res.redirect("/recipes");
        }
    });
});
module.exports = router;
