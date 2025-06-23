import { Router } from "express"
import {  createListing, getUserListing, deleteListing, updateListing, getListingInfo, getAllListings } from "../controllers/listing.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/create-listing").post(verifyJWT, createListing)
router.route("/user-listings/:id").get(verifyJWT, getUserListing)
router.route("/delete-listing/:id").post(verifyJWT, deleteListing)
router.route("/update-listing/:id").post(verifyJWT, updateListing)
router.route("/get-listing-info/:id").get(getListingInfo)
router.route("/get-listings").get(getAllListings)

export default router;