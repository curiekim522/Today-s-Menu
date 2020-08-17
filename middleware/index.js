var Recipe = require("../models/recipe"),
    Comment = require("../models/comment");
var middlewareObj = {};

middlewareObj.verifyOwner = function(req, res, next) {
    if (req.isAuthenticated()) {
        Recipe.findById(req.params.id, function(err, recipe) {
            if (err || !recipe) {
                req.flash("error", "Recipe not found");
                res.redirect("/recipes");
            }
            if (recipe.author.id.equals(req.user._id)) {
                next();
            } else {
                req.flash("error", "You do not have permission to do that");
                res.redirect("back");
            }
        });
    } else {
        req.flash("err", "You need to be logged in to do that");
        res.redirect("back");
    }
};

middlewareObj.verifyCommentOwner = function (req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.commentId, function(err, comment) {
            if (err) {
                req.flash("error", "Comment not found");
                res.redirect("/recipes");
            }
            if (comment.author.id.equals(req.user._id)) {
                next();
            } else {
                res.redirect("back");
            }
        });
    } else {
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function(req, res,next) {
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
};


module.exports = middlewareObj;