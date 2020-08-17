// var mongoose = require("mongoose"),
//     Recipe = require("./models/recipe"),
//     Comment = require("./models/comment");


// var data = [
//     {
//         name: "Mountain Camp",
//         image: "https://images.unsplash.com/photo-1471115853179-bb1d604434e0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1400&q=60",
//         description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
//     },
//     {
//         name: "Dark Camp",
//         image: "https://images.unsplash.com/photo-1487730116645-74489c95b41b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1400&q=60",
//         description: "Enjoy the night scenary and campfire"
//     },
//     {
//         name: "Mountain Camp II",
//         image: "https://images.unsplash.com/photo-1492648272180-61e45a8d98a7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1400&q=60",
//         description: "Camp on top of the mountain and enjoy the thrills"
//     }
// ];

// function seedDB() {
//     Campground.deleteMany({});
//     Comment.deleteMany({});
//     Campground.deleteMany({}, function(err) {
//         if (err) {
//             console.log(err);
//         } else {
//             data.forEach(function(seed) {
//                 Campground.create(seed, function(err, campground) {
//                     if (err) {
//                         console.log(err);
//                     } else {
//                         Comment.create({
//                             text: "Too high up in the mountain; dangerous",
//                             author: "Me"
//                         }, function(err, comment) {
//                             if (err) {
//                                 console.log(err);
//                             } else {
//                                 campground.comments.push(comment);
//                                 campground.save();
//                             };
//                         });
//                     };
//                 });
//             });
//         };
//     });
// };

// module.exports = seedDB;