const Home = require("../models/home");
const Favourite = require("../models/favourite");
const Bookings = require("../models/booking")
const { ObjectId } = require('mongodb');

exports.getIndex = (req, res, next) => {
  Home.fetchAll().then(registeredHomes => {
     res.render("store/home", {
      registeredHomes: registeredHomes,
      pageTitle: "Home",
      currentPage: "home",
      isLoggedIn: req.isLoggedIn,
      user: req.user
    })
  });
};

exports.getHomes = (req, res, next) => {
  Home.fetchAll().then(registeredHomes =>
    res.render("store/home-list", {
      registeredHomes: registeredHomes,
      pageTitle: "Homes List",
      currentPage: "Home",
      isLoggedIn: req.isLoggedIn,
      user: req.session.user
    })
  );
};

exports.getHomeDetails = (req, res, next) => {
  const homeId = req.params.homeId;
  const user = req.session && req.session.user;
  if (!user || !user._id) {
    return res.redirect('/login');
  }

  Home.findById(homeId)
    .then(home => {
      if (!home) {
        console.log("Home not found for id:", homeId);
        return res.redirect("/");
      }
      res.render("store/home-detail", {
        home: home,
        pageTitle: "Home-Details",
        currentPage: "Home",
        isLoggedIn: req.isLoggedIn,
        user: req.session.user,
      });
    })
    .catch(err => {
      console.log("Error fetching home details:", err);
      res.redirect('/homes');
    });
};


// exports.getHomeDetails = (req, res, next) => {
//    const homeId = req.params.favId;
//   const user = req.session && req.session.user;
//   if (!user || !user._id) {
//     return res.redirect('/login');
//   }
//  Home.findById(homeId).then(home => {
//   if(!home) {
//     console.log("Home-not Found")
//     res.redirect("/homes");
//   } else{
//     res.render("store/home-detail", {
//       home: home,
//     pageTitle: "Home-Details",
//     currentPage: "Home",
//     isLoggedIn: req.isLoggedIn,
//     user: req.session.user,
//    })
//   }
//  })
// };

exports.postFavourite = (req, res, next) => {
  const homeId = req.params.favId;
  const user = req.session && req.session.user;
  if (!user || !user._id) {
    return res.redirect('/login');
  }

  Favourite.findfav(homeId)
    .then(home => {
      if (!home) {
        console.log("Home not found for favouriting:", homeId);
        return res.redirect('/homes');
      }
      return Favourite.favsave(home, user._id);
    })
    .then(result => {
      console.log("Home successfully added to favourites", result.insertedId);
      res.redirect('/favourites');
    })
    .catch(err => {
      console.log("Error while adding to favourites", err);
      res.redirect('/homes');
    });
};

exports.getFavouriteList = (req, res, next) => {
  const user = req.session && req.session.user;
  if (!user || !user._id) {
    return res.redirect('/login');
  }

  Favourite.favfetchAll(user._id)
    .then(favourites => {
      res.render("store/favourite-list", {
        favouriteHomes: favourites,
        pageTitle: "My Favourites",
        currentpage: "favourites",
        isLoggedIn: req.isLoggedIn,
        user: req.session.user,
      });
    })
    .catch(err => {
      console.log("Error fetching favourites", err);
      res.redirect('/homes');
    });
};

exports.postFavDeleteHome = (req, res, next) => {
  const favId = req.params.favid; 
  const user = req.session && req.session.user;
  if (!user || !user._id) {
    return res.redirect('/login');
  }

  Favourite.favdeleteById(favId, user._id)
    .then(result => {
      if (result.deletedCount === 0) {
        console.log("No favourite deleted — maybe wrong id or not owned by user", favId);
      }
      res.redirect("/favourites");
    })
    .catch(err => {
      console.log('Error in deletion', err);
      res.redirect("/favourites");
    });
};


exports.getBookings = (req, res, next) => {
  const homeId = req.params.bookId;
  const user = req.session && req.session.user;
  if (!user || !user._id) {
    return res.redirect('/login');
  }
  Bookings.bookfetchAll(user._id)
    .then(bookings => {
      res.render("store/booking", {
       bookedHomes: bookings,
        pageTitle: "My Bookings",
        currentpage: "bookings",
        isLoggedIn: req.isLoggedIn,
        user: req.session.user,
      });
    })
    .catch(err => {
      console.log("Error fetching bookings", err);
      res.redirect('/');
    });
};


// patch for postBookings in controllers/storeController.js
exports.postfavBookings = (req, res, next) => {
  const homeId = req.params.favId;
  const user = req.session && req.session.user;
  if (!user || !user._id) {
    return res.redirect('/login');
  }

  Bookings.findbook(homeId)
    .then(home => {
      if (!home) {
        // stop the chain and let catch handle the response
        console.log("Home not found for booking:", homeId);
        const err = new Error('HOME_NOT_FOUND');
        err.code = 'HOME_NOT_FOUND';
        throw err;
      }
      // return the promise from booksave so the next .then gets the result
      return Bookings.booksave(home, user._id);
    })
    .then(result => {
      // be defensive about result shape
      const id = (result && (result.homeId || result.insertedId || result._id)) || 'unknown';
      console.log("Home successfully added to bookings", id);
      return res.redirect('/bookings');
    })
    .catch(err => {
      // single place to handle all errors/responses
      if (err && err.code === 'HOME_NOT_FOUND') {
        return res.redirect('/'); // home not found -> send user back home
      }
      console.log("Error while adding to bookings", err);
      return res.redirect('/'); // other errors -> generic fallback
    });
};

exports.postBookings = (req, res, next) => {
  const homeId = req.params.homeId;
  const user = req.session && req.session.user;
  if (!user || !user._id) {
    return res.redirect('/login');
  }

  Bookings.findhomebook(homeId)
    .then(home => {
      if (!home) {
        // stop the chain and let catch handle the response
        console.log("Home not found for booking:", homeId);
        const err = new Error('HOME_NOT_FOUND');
        err.code = 'HOME_NOT_FOUND';
        throw err;
      }
      // return the promise from booksave so the next .then gets the result
      return Bookings.booksave(home, user._id);
    })
    .then(result => {
      // be defensive about result shape
      const id = (result && (result.homeId || result.insertedId || result._id)) || 'unknown';
      console.log("Home successfully added to bookings", id);
      return res.redirect('/bookings');
    })
    .catch(err => {
      // single place to handle all errors/responses
      if (err && err.code === 'HOME_NOT_FOUND') {
        return res.redirect('/'); // home not found -> send user back home
      }
      console.log("Error while adding to bookings", err);
      return res.redirect('/'); // other errors -> generic fallback
    });
};



// exports.postBookings = (req, res, next) => {
//   const homeId = req.params.bookId;
//   const user = req.session && req.session.user;
//   if (!user || !user._id) {
//     return res.redirect('/login');
//   }

//   Bookings.findbook(homeId)
//     .then(home => {
//       if (!home) {
//         console.log("Home not found for booking:", homeId);
//         return res.redirect('/');
//       }
//       return Bookings.booksave(home, user._id);
//     })
//     .then(result => {
//       console.log("Home successfully added to bookings", result.homeId);
//       res.redirect('/bookings');
//     })
//     .catch(err => {
//       console.log("Error while adding to bookings", err);
//       res.redirect('/');
//     });
// };


exports.postBookDeleteHome = (req, res, next) => {
  const bookId = req.params.bookid || req.params.bookId || req.body.bookId;
  const user = req.session && req.session.user;
  if (!user || !user._id) {
    return res.redirect('/login');
  }

  if (!bookId) {
    console.log('postBookDeleteHome: missing bookId in request (params/body)', {
      params: req.params,
      body: req.body
    });
    return res.redirect('/bookings');
  }

 const { ObjectId } = require('mongodb');
  if (!ObjectId.isValid(String(bookId))) {
    console.log('postBookDeleteHome: invalid bookId format:', bookId);
    return res.redirect('/bookings');
  }

  Bookings.bookdeleteById(bookId, user._id)
    .then(result => {
      if (result.deletedCount === 0) {
        console.log("No booking deleted — maybe wrong id or not owned by user", bookId);
      } else {
        console.log("Booking deleted:", bookId);
      }
      res.redirect("/bookings");
    })
    .catch(err => {
      console.log('Error in deletion', err);
      res.redirect("/bookings");
    });
};
