const { ObjectId } = require('mongodb');
const {getdb} = require('../utils/databaseUtil');
// const Favourite = require("./favourite.js");

// const homeDataPath = path.join(rootDir, "data", "homes.json");
// const favouriteDataPath = path.join(rootDir, "data", "favourite.json");

module.exports = class Home {
  constructor(houseName, price, location, rating, photo, description, _id) {
    this.houseName = houseName;
    this.price = price;
    this.location = location;
    this.rating = rating;
    this.photo = photo;
    this.description = description;
    if (_id) {
    this._id = _id;
  }
}

  save() {
    const db = getdb();
    if(this._id) { //update  
      const updateFields = {
        houseName : this.houseName,
        price : this.price,
        location : this.location, 
        rating : this.rating,
        photo : this.photo,
        description : this.description
      };
      return db.collection('homes').updateOne({_id: new ObjectId(String(this._id))}, {$set: updateFields});
    } else { //insert
      return db.collection("homes").insertOne(this);
    }
  }

  static fetchAll() {
    const db = getdb();
    return db.collection('homes').find().toArray()
  }

  static findById(homeId) {
    const db = getdb();
    return db.collection('homes').find({_id: new ObjectId(String(homeId))}).next()
  }
 
  static deleteById(homeId) {
   const db= getdb();
   return db.collection('homes').deleteOne({_id: new ObjectId(String(homeId))});
  }
};