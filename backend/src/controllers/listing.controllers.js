import {Listing} from "../models/listing.model.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import {ApiError} from "../utils/ApiErrors.js"
import {asynchandler} from "../utils/asynchandler.js"

const createListing = asynchandler(async (req,res)=>{
    const {title,name,description,images,address,price,userRef} = req.body
    if(!title || ! name || !description || !images || !address || !price || !userRef){
        throw new ApiError(401,"all fields are required")
    }
    if(typeof(price)!=number){
        throw new ApiError(400,"price cannot be a letter")
    }
    const listing = await Listing.create({title,name,description,images,address,price,userRef})
    const listCreated = Listing.findById(listing._id)
    if(!listCreated){
        throw new ApiError(401,"error while creating the listing")
    }
    return res
    .status(200)
    .json(new ApiResponse(200,listCreated,"succesfully created"))
})

const getUserListing = asynchandler(async (req,res)=>{
    const listing = Listing.find(
        {userRef:req.params.id}
    )
    if(!listing){
        throw new ApiError(401, "no list found so far")
    }
    return res
    .status(200)
    .json(new ApiResponse(200,listing,"list fetched succesfully"))
})
const deleteListing = asynchandler(async (res,req)=>{
     const listing = await Listing.findById(req.params.id);
    if (!listing) {
        throw new ApiError(404, "Listing not found")
    }
    if (req.user.id !== listing.userRef) {
        throw new ApiError(401, "You are unauthorized to perform this action")
    }
    await Listing.findByIdAndDelete(req.params.id);
    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Listing deleted successfully"))


})

const updateListing = asynchandler(async (req, res) => {

    const listing = await Listing.findById(req.params.id);
    if (!listing) {
        throw new ApiError(404, "Listing couldn't be found")
    };

    if (req.user.id !== listing.userRef) {
        throw new ApiError(401, "Unauthorized to access this request of editing a listing")
    };

    const updatedListing = await Listing.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    )

    return res
        .status(200)
        .json(new ApiResponse(200, updatedListing, "Listing has been successfully updated"))

})

const getListingInfo = asynchandler(async (req, res) => {
    const listingDetails = await Listing.findById(req.params.id);
    if (!listingDetails) {
        throw new ApiError(404, "No listing found with that id")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, listingDetails, "Listing info fetched successfully"))
})

const getAllListings = asynchandler(async (req, res) => {

    try {
        const limit = parseInt(req.query.limit) || 8;
        const startIndex = parseInt(req.query.startIndex) || 0;

        let offer = req.query.offer;
        if (offer === undefined || offer === 'false') {
            offer = { $in: [true, false] }
        }

        let furnished = req.query.furnished;
        if (furnished === undefined || furnished === 'false') {
            furnished = { $in: [true, false] }
        }


        let parking = req.query.parking;
        if (parking === undefined || parking === 'false') {
            parking = { $in: [true, false] }
        }
        let type = req.query.type;
        if (type === undefined || type === 'all') {
            type = { $in: ["rent", "sell"] }
        }


        const searchTerm = req.query.searchTerm || "";
        const sort = req.query.sort || "createdAt";
        const order = req.query.order || "desc";

        const listings = await Listing.find(
            {
                name: {
                    $regex: searchTerm, /* regex will enable find everywhere in the data */
                    $options: 'i' /* ignores upper and lower case */
                },
                offer,
                furnished,
                parking,
                type
            }
        )
            .sort({ [sort]: order })
            .limit(limit)
            .skip(startIndex);


        return res
            .status(200)
            .json(new ApiResponse(200, listings, "Fetched"))

    } catch (error) {
        throw new ApiError(400, error.message)
    }


})
export { createListing, getUserListing, deleteListing, updateListing, getListingInfo, getAllListings }