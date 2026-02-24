// // Core Modules
// const { ObjectId } = require('mongodb');
// const {getdb} = require('../utils/databaseUtil');

// module.exports = class Favourite {

//    static favsave(data) {
//     const db = getdb();
//     return db.collection('favourites').insertOne(data);
//    }

//    static favfetchAll() {
//    const db = getdb();
//    return db.collection('favourites').find().toArray();
//   }

//   static findfav(homeId) {
//     const db = getdb();
//     return db.collection('homes').find({_id: new ObjectId(homeId)}).next();
//   }

//    static favdeleteById(homeId) {
//     const db = getdb();
//     return db.collection('favourites').deleteOne({_id: new ObjectId(homeId)});
//    }
// };



const { ObjectId } = require('mongodb');
const { getdb } = require('../utils/databaseUtil');

module.exports = class Favourite {

  static favsave(homeData, userId) {
    const db = getdb();
    
    const favDoc = {
      ...homeData,
      homeId: homeData._id ? new ObjectId(String(homeData._id)) : null, 
      userId: new ObjectId(String(userId)),
      addedAt: new Date()
    };
    
    if (favDoc._id) delete favDoc._id;
    return db.collection('favourites').insertOne(favDoc);
  }

 
  static favfetchAll(userId) {
    const db = getdb();
    return db.collection('favourites')
      .find({ userId: new ObjectId(String(userId)) })
      .toArray();
  }

  
  static findfav(homeId) {
    const db = getdb();
    return db.collection('homes').find({ _id: new ObjectId(String(homeId)) }).next();
  }

  
  static favdeleteById(favId, userId) {
    const db = getdb();
    return db.collection('favourites').deleteOne({
      _id: new ObjectId(String(favId)),
      userId: new ObjectId(String(userId))
    });
  }
};