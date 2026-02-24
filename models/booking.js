const { ObjectId } = require('mongodb');
const { getdb } = require('../utils/databaseUtil');

module.exports = class Bookings {

  static booksave(homeData, userId) {
    const db = getdb();
    
    const bookDoc = {
      ...homeData,
      homeId: homeData._id ? new ObjectId(String(homeData._id)) : null, 
      userId: new ObjectId(String(userId)),
      addedAt: new Date()
    };
    
    if (bookDoc._id) delete bookDoc._id;
    return db.collection('bookings').insertOne(bookDoc);
  }

 
  static bookfetchAll(userId) {
    const db = getdb();
    return db.collection('bookings')
      .find({ userId: new ObjectId(String(userId)) })
      .toArray();
  }

  
  static findbook(homeId) {
    const db = getdb();
    return db.collection('favourites').find({ _id: new ObjectId(String(homeId)) }).next();
  }

  static findhomebook(homeId) {
    const db = getdb();
    return db.collection('homes').find({ _id: new ObjectId(String(homeId)) }).next();
  }

  
static bookdeleteById(bookId, userId) {
    const db = getdb();

    // Validate inputs first
    if (!bookId || !ObjectId.isValid(String(bookId))) {
      // Return a resolved promise with deletedCount 0 so callers can handle normally
      console.log('Bookings.bookdeleteById: invalid bookId:', bookId);
      return Promise.resolve({ deletedCount: 0 });
    }
    if (!userId || !ObjectId.isValid(String(userId))) {
      console.log('Bookings.bookdeleteById: invalid userId:', userId);
      return Promise.resolve({ deletedCount: 0 });
    }

    const query = {
      _id: new ObjectId(String(bookId)),
      userId: new ObjectId(String(userId))
    };

    return db.collection('bookings').deleteOne(query);
  }
};












// exports.postBookDeleteHome = (req, res, next) => {

//   const bookId = req.params.bookid || req.params.bookId || req.body.bookId;
//   const user = req.session && req.session.user;
//   if (!user || !user._id) {
//     return res.redirect('/login');
//   }

//   if (!bookId) {
//     console.log('postBookDeleteHome: missing bookId in request (params/body)', {
//       params: req.params,
//       body: req.body
//     });
//     return res.redirect('/bookings');
//   }

//   const { ObjectId } = require('mongodb');
//   if (!ObjectId.isValid(String(bookId))) {
//     console.log('postBookDeleteHome: invalid bookId format:', bookId);
//     return res.redirect('/bookings');
//   }

//   Bookings.bookdeleteById(bookId, user._id)
//     .then(result => {
//       if (result.deletedCount === 0) {
//         console.log("No booking deleted — maybe wrong id or not owned by user", bookId);
//       } else {
//         console.log("Booking deleted:", bookId);
//       }
//       res.redirect("/bookings");
//     })
//     .catch(err => {
//       console.log('Error in deletion', err);
//       res.redirect("/bookings");
//     });
// };

