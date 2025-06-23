import jwt from "jsonwebtoken"



import { ApiError } from "../utils/ApiErrors.js";
import { asynchandler } from "../utils/asynchandler.js";
import { User } from "../models/user.models.js";

// This code block is a middleware function verifyJWT designed to authenticate requests by validating a JSON Web Token (JWT). It extracts the token, verifies it against a secret, and then fetches the corresponding user from the database, attaching the user object to the request for further processing.

export const verifyJWT = asynchandler(async (req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        if (!token) {
            throw new ApiError(401, "Unauthorized request")
        }

        const decodedTokenInfo = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decodedTokenInfo?._id).select("-password -refreshToken")

        if (!user) {
            throw new ApiError(401, "Invalid access token")
        }

        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }

})