const Home = require("../models/home");
const Favourite = require("../models/favourite");
const fs = require('fs');
const path = require("path");

exports.getAddHome = (req, res, next) => {
  res.render("host/edit-home", {
    pageTitle: "Add Home to airbnb",
    currentPage: "edit-home",
    editing: false,
    isLoggedIn: req.isLoggedIn,
    user: req.session.user,
  });
};

exports.getEditHome = (req, res, next) => {
  const homeId = req.params.homeId;
  const editing = req.query.editing === 'true';

  Home.findById(homeId).then(home => {
    if (!home) {
      console.log("Home not found for editing.");
      return res.redirect("/host/host-home-list");
    }
      console.log(homeId, editing, home);
      res.render("host/edit-home", {
        home: home,
        pageTitle: "Edit your Home",
        currentPage: "host-homes",
        editing: editing,
        isLoggedIn: req.isLoggedIn,
        user: req.session.user,
    });
  });
};

exports.getHostHomes = (req, res, next) => {
  Home.fetchAll().then(registeredHomes =>{
    res.render("host/host-home-list", {
      registeredHomes: registeredHomes,
      pageTitle: "Host Homes List",
      currentPage: "host-homes",
      isLoggedIn: req.isLoggedIn,
      user: req.session.user,
    })
  });
};

exports.postAddHome = (req, res, next) => {
  let { houseName, price, location, rating, description } = req.body;
  console.log("HOMES ARE: ", req.body);
  console.log(req.file);

  if(!req.file) {
    console.log("Not Valid image");
    return res.status(422).send("NoT valid Image")
  }

  price = parseFloat(price) || 0;
  rating = parseFloat(rating) || 0;

  // Handle invalid numeric inputs
    if (isNaN(price)) price = 0;
    if (isNaN(rating)) rating = 0;

  const photo = req.file.path;

  const home = new Home(houseName, price, location, rating, photo, description);
  home.save().then(() => {
    console.log("Home saved successfully");
  });

  res.redirect("/host/host-home-list");
};

// exports.postEditHome = (req, res, next) => {
//   let { houseName, price, location, rating, description, id} = req.body;
  
//   price = parseFloat(price) || 0;
//   rating = parseFloat(rating) || 0;

//   // Handle invalid numeric inputs
//     if (isNaN(price)) price = 0;
//     if (isNaN(rating)) rating = 0;

//   // const photo = req.file.path;

//   const home = new Home(houseName, price, location, rating, description, id);

//   home._id = id;

//   if(req.file) {
//     photo = req.file.path;
//   }

//   home.save().then(result => {
//     console.log("Home successfully edited", result);
//   })

//   res.redirect("/host/host-home-list");
// };

exports.postEditHome = (req, res, next) => {
  let { houseName, price, location, rating, description, id } = req.body;

  price = parseFloat(price) || 0;
  rating = parseFloat(rating) || 0;

  if (isNaN(price)) price = 0;
  if (isNaN(rating)) rating = 0;

  Home.findById(id)
    .then(existingHome => {
      if (!existingHome) {
        console.log("Home not found for update:", id);
        return res.redirect("/host/host-home-list");
      }

    let photoPath = existingHome.photo;

      // ✔ If new photo uploaded → delete old photo
      if (req.file) {
        photoPath = req.file.path;

        const oldImagePath = path.join(__dirname, "..", existingHome.photo);

        // Delete old image safely
        if (fs.existsSync(oldImagePath)) {
          fs.unlink(oldImagePath, err => {
            if (err) console.log("Error deleting old image:", err);
            else console.log("Old image deleted:", oldImagePath);
          });
        }
      }

      const updatedHome = new Home(
        houseName,
        price,
        location,
        rating,
        photoPath,
        description,
        id
      );

      updatedHome._id = id;
      return updatedHome.save();
    })
    .then(result => {
      console.log("Home successfully edited", result);
      res.redirect("/host/host-home-list");
    })
    .catch(err => {
      console.error("Error updating home:", err);
      res.redirect("/host/host-home-list");
    });
};

exports.postDeleteHome = (req, res, next) => {
  const homeId = req.params.homeId;
  Home.deleteById(homeId).then(() => {
    res.redirect("/host/host-home-list");
  }).catch(error => {
    console.log("Error while deleteing", error);
  })
};

