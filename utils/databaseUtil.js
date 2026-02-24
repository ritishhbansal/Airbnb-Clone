const mongo = require('mongodb');

const MongoClient = mongo.MongoClient;

const Mongo_Url = "mongodb+srv://ritishhbansal:ritishbansal@airbnb.j0tresv.mongodb.net/?retryWrites=true&w=majority&appName=Airbnb";

let _db;

const mongoConnect = (callback) => {
  MongoClient.connect(Mongo_Url).then(client => {
  callback();
  _db = client.db('airbnb');
  }).catch(err => {
  console.log("Error while Connecting to Mongo: ", err);
  });
}

const getdb = () => {
  if (!_db) {
    throw new Error('Mongo not Connected');
  }
  return _db;
}

exports.mongoConnect = mongoConnect;
exports.getdb = getdb;