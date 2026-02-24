const { ObjectId } = require('mongodb');
const {getdb} = require('../utils/databaseUtil');

module.exports = class User {
  constructor({fname, lname, email, password, userType, _id}) {
    this.fname = fname;
    this.lname = lname;
    this.email = email;
    this.password = password;
    this.userType = userType;
    if (_id) {
    this._id = _id;
  }
}

  userSave() {
    const userdb = getdb();
    if(this._id) { //update  
      const updateFields = {
        fname : this.fname,
        lname : this.lname,
        email : this.email, 
        password : this.password,
        userType : this.userType
      };
      return userdb.collection('users').updateOne({_id: new ObjectId(String(this._id))}, {$set: updateFields});
    } else { //insert
      return userdb.collection("users").insertOne(this);
    }
  }

  // static userfetchAll() {
  //   const userdb = getdb();
  //   return userdb.collection('users').find().toArray()
  // }

static async findByEmail(email) {
  try {
    const db = getdb();
    return await db.collection("users").findOne({ email: email });
  } catch (err) {
    console.error("Error in findByEmail:", err);
    throw err;
  }
}
 
  // static userdeleteById(homeId) {
  //  const userdb= getdb();
  //  return userdb.collection('users').deleteOne({_id: new ObjectId(String(homeId))});
  // }
};
