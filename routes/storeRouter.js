// External Module
const params=require('body-parser');
const path=require('path');
const fs=require('fs');
const express = require("express");
const storeRouter = express.Router();

// Local Module
const homesController = require("../controllers/storeController");

storeRouter.get("/", homesController.getIndex);
storeRouter.get("/homes", homesController.getHomes);
storeRouter.get("/bookings", homesController.getBookings);
storeRouter.post("/book/:favId", homesController.postfavBookings);
storeRouter.post("/books/:homeId", homesController.postBookings);
storeRouter.get("/favourites", homesController.getFavouriteList);

storeRouter.get("/homes/:homeId", homesController.getHomeDetails);
storeRouter.post("/fav/:favId", homesController.postFavourite);
storeRouter.post("/host/fav-delete-home/:favid", homesController.postFavDeleteHome);
storeRouter.post("/host/book-delete-home/:bookId", homesController.postBookDeleteHome);

module.exports = storeRouter;