const express = require("express"),
      app = express(),
      bodyParser = require("body-parser"),
      mongoose = require("mongoose"),
      passport = require("passport"),
      LocalStrategy = require("passport-local"),
      methodOverride = require("method-override"),
      User = require("./models/user"),
      Comment = require("./models/comment"),
      Recipe = require("./models/recipe"),
      flash = require("connect-flash"),
      seedDB = require("./seeds");

const commentRoutes = require("./routes/comments"),
      recipeRoutes = require("./routes/recipes"),
      indexRoutes = require("./routes/index");


app.locals.moment = require('moment');

mongoose.connect('mongodb://localhost:27017/recipe', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
  .then(() => console.log('Connected to DB'))
  .catch(error => console.log(error.message));

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
mongoose.set('useFindAndModify', false);
// seedDB();

app.use(require("express-session")({
    secret: "Haru is the cutest guinea pig in the world",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(indexRoutes);
app.use("/recipes", recipeRoutes);
app.use("/recipes/:id/comments", commentRoutes);

app.listen(3000, function() {
    console.log("yelp camp has started on port 3000");
});