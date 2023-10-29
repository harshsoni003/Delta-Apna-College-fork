const mongoose = require('mongoose');
const Listing = require('../models/listing');
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressErrors');

const listingRouter = require("express").Router();
const {listingSchema} = require('../Schema.js')

const validateListing = (req,res,next) => {
    const result = listingSchema.validate({listing:req.body})
    if(result.error){
        throw new ExpressError(400,result.error)
    }
}

listingRouter.get('/', wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
}))

listingRouter.post('/', validateListing, wrapAsync(async (req, res,next) => {
    // if(!req.body.title && !req.body.description && !req.body.image && !req.body.price && !req.body.location && !req.body.country){}
    const newListing = new Listing(req.body)
    await newListing.save()
    res.redirect("/listings")
}))

listingRouter.get('/:id', wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    res.render("listings/place", { place:listing });
}))

listingRouter.get('/edit/:id', wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    res.render("listings/edit", { place:listing });
}))

listingRouter.patch('/:id', validateListing, wrapAsync(async (req, res) => {
    // try{
    //     await Listing.findByIdAndUpdate( req.params.id , {$set: req.body})
    //     res.redirect(`/listings`)
    // } catch(err){
    //     next(err)
    // }
    // if(!req.body.title || !req.body.description || !req.body.image || !req.body.price || !req.body.location || !req.body.country){
    //     throw new ExpressError(400,"Recieved No Updation Data")
    // }
    await Listing.findByIdAndUpdate( req.params.id , {$set: req.body})
    res.redirect(`/listings`)
}))

listingRouter.delete('/:id', wrapAsync(async (req, res) => {
    await Listing.findByIdAndDelete(req.params.id);
    res.redirect("/listings");
}))

listingRouter.get('/addNew/new', wrapAsync(async (req, res) => {
    res.render("listings/newListing")
}))

module.exports = listingRouter;