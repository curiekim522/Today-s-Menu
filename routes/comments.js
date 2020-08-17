const express = require("express"),
    Recipe = require("../models/recipe"),
    Comment = require("../models/comment"),
    middleware = require("../middleware");
var router = require("./recipes");
    router = express.Router({mergeParams: true});

router.get("/new", middleware.isLoggedIn, function(req, res) {
    Recipe.findById(req.params.id, function(err, recipe) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", {recipe: recipe})
        }
    });
});

router.post("/", middleware.isLoggedIn, function(req, res) {
    Recipe.findById(req.params.id, function(err, recipe){
        if(err) {
            res.redirect("/recipes");
        } else {
            Comment.create(req.body.comment, function(err, comment) {
                if(err) {
                    console.log(err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    recipe.comments.push(comment);
                    recipe.save();
                    res.redirect("/recipes/"+ recipe._id);
                }
            });
        }
    });
});

router.get("/:commentId/edit", middleware.verifyCommentOwner, function(req, res) {
    Recipe.findById(req.params.id, function(err, recipe) {
        if (err || !recipe) {
            req.flash("error", "Recipe not found");
            return res.redirect("back");
        }
        Comment.findById(req.params.commentId, function(err, comment) {
            if(err) {
                res.redirect("back");
            } else {
                res.render("comments/edit", {campId:req.params.id, comment: comment});
            }
        });
    });
});

router.put("/:commentId", middleware.verifyCommentOwner, function(req, res) {
    Comment.findByIdAndUpdate(req.params.commentId, req.body.comment, function(err, comment) {
        if(err) {
            res.redirect("back");
        } else {
            res.redirect("/recipes/" + req.params.id);
        }
    });
});

router.delete("/:commentId", middleware.verifyCommentOwner, function(req, res) {
    Comment.findByIdAndRemove(req.params.commentId, function(err) {
        if(err) {
            res.redirect("back");
        } else {
            res.redirect("/recipes/"+req.params.id);
        }
    })
});



module.exports = router;