import { asynchandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiErrors.js"
import { User } from "../models/user.models.js";
import { uploadOnImagekit } from "../utils/Imagekit.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const registerUser = asynchandler(async (req,res)=>{
    const {email,username,password} = req.body;

    if(!email || !username || !password){
        throw new ApiError("All fileds are required!")
    };
    // if([email,ussername,password].some((entry)=>entry?.trim()==="")){
    //      throw new ApiError(400, "All fields are compulsory..");
    // }
    const existingUser =await User.findOne({
        $or:[{email},{username}]
    })
    if(existingUser){
        throw new ApiError(400,"user already exists")
    }
     const avatarLocalPath = req.files?.avatar[0]?.path;
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is compulsory")
    }
    const avatar = await uploadOnImagekit(avatarLocalPath)
     if (!avatar) {
        throw new ApiError(400, "Avatar file is compulsory")
    }
    const user = User.create({
        email:email,
        username:username.toLowerCase(),
        avatar: avatar.url,
        password,
     
    })
     const userCreated = await User.findById(user._id).select("-password -refreshToken");
    if (!userCreated) {
        throw new ApiError(500, "Something went wrong while registering the user..")
    }

    return res.status(201).json(
        new ApiResponse(200, userCreated, "User registered successfully..")
    )
})

const getRefreshTokenAndAccessToken = async (userid)=>{
    let user = await User.findById(userid)
    if(!user){
        throw new Error("No user found")
    }
    let accesToken = user.generatedAccessTokens()
    let refreshToken = user.generateRefreshToken()
    if(!refreshToken){
        user.refreshtoken = refreshToken
    }
    await user.save({ validateBeforeSave: false })
    return {refreshToken},{accesToken}
}

const login = async (req,res)=>{
   const {email,password} = req.body
   if(!email || !password){
    throw new ApiError("Email or Password is required")

   }
   const existingUser = await User.findOne({email})
   if(!existingUser){
    throw new ApiError("Sorry, no registered user found. Please register.")
   }
   const passwordValidity =await existingUser.isPasswordcorrect(password)
   if(!passwordValidity){
    throw new ApiError("Password donot match!")
   }
   const {refreshToken,accesToken}= await getRefreshTokenAndAccessToken(existingUser._id)

   const opts={
    httpOnly:true,
    secure:true
   }
   const loggedinUser = await User.findById(existingUser._id).select("-password -refreshtoken")

   return res
   .status(200)
   .cookie("accessToken",accesToken,opts)
   .cookie("refreshToken", refreshToken, opts)
   .json(new ApiResponse(
            200,
           
            { user: loggedInUser, accessToken },
            "User logged-in successfully"
        ))
}
const logout = asynchandler (async (req,res)=>{
    await User.findByIdAndUpdate(
       req.user._id, {
       $set:{
         refreshtoken : undefined
       }

    },
    {
        new:true  //returns modified document after changes
    }

)

const opts={
  httpOnly:true,
  secure:true
}
return res
.status(200)
.clearCookie("accessToken",opts)
.clearCookie("refreshToken",opts)
.json(new ApiResposne(200,{},"logged out successfully"))
}
)


const refreshAccessToken= asynchandler(async (req,res)=>{
    const incomingrefreshToken = req.body.refreshToken || req.cookies.refreshToken
    if(!incomingrefreshToken){
        throw new ApiError("Please Login again")
    }
    try {
        const checkRefreshToken = jwt.sign(incomingrefreshToken,process.env.REFRESH_TOKEN)
        if(!checkRefreshToken){
            throw new ApiError("NO valid refresh Token found")

        }
        const user = User.findById(checkRefreshToken._id)
        if(!user){
            throw new ApiError(401,"No user found")
        }
        if(incomingrefreshToken != user.refreshToken){
            throw new Error("Refresh token expired or already user")
        }
        const {accessToken, refreshToken}= getRefreshTokenAndAccessToken(user._id)
        const opts={
        httpOnly:true,
        secure:true
        }
        return res
        .status(200)
        .cookie("refreshToken",refreshToken,opts)
        .cookie("accessToken",accessToken,opts)
        .json(new ApiResponse(200,user,"AccesToken Refreshed Successfully"))

        
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
        
    }
    
})

const changePassword = asynchandler(async (req,res)=>{
    const {oldPassword,newPassword}= req.body
    try {
        const user = await User.findById(req.user?._id)
        const isPassword = await user.isPasswordcorrect(oldPassword)
        if(!isPassword){
            throw new ApiError("password incorrect")
        }
        user.password = newPassword
        await user.save({validateBeforeSave:false})

        return res
        .staus(200)
        .json(new ApiResponse(200,{},"PASSWORD changed succesfully"))
    } catch (error) {
       throw new ApiError(401, error?.message || "Something went wrong")
    }
})

const getCurrentUser= asynchandler(async (req,res)=>{
    return res
    .status(200)
    .json(new ApiResponse(200,req.user,"current user fetched successfully"))
})

const updateAccountDetails = asynchandler(async (req,res)=>{
    const {username,email}= req.body
    try {
        if(!username || ! email){
            throw new ApiError(400,"username or email is required")
        }
        const user = await User.findByIdAndUpdate(
            req.user?._id,
            {
                $set:{
                    username,
                    email
                }
            },
            {new:true}
        ).select("-password")

        return res
        .status(200)
        .json(new ApiResponse(200,{user},"updated successfully"))
    } catch (error) {
        
    }
})

const updateUserAvatar = asynchandler(async (req,res)=>{
    const localAvaFilePath = req.files?.avatar[0]?.path;
    if(!localAvaFilePath){
        throw new ApiError(400,"no file choosen")
    }
    const file = await uploadOnImagekit(localAvaFilePath)
    
    if(!file.url){
        throw new ApiError(400,"imagekit error")
    }
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                avatar : file.url 
            }
        },
        {new:true}
    ).select("-password")
    return res
    .status(200)
    .json(new ApiResponse(200,user,"updated succesfully"))
    
})


const deleteUser = asynchandler(async (req,res)=>{
    await User.findIdAndDelete(
        req.user?._id,
        {
            $set:{
              refreshToken:undefined
            }
        },
        {
            new:true
        }
    )

    const opts={
        httpOnly:true,
        secure:true
    }
    return res
    .status(200)
     .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User deleted successfully.."))
})

const getUserInfo = asynchandler(async (req, res) => {
    const userId = req.params.id;
    const user = await User.findById(userId).select("-password -refreshToken")
    if (!user) {
        throw new ApiError(404, "User credentials not found for given userId");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, user, "Details of the user fetched successfully"))
})

export { registerUser, login, logout, refreshAccessToken, changePassword, getCurrentUser, updateAccountDetails, updateUserAvatar, deleteUser, getUserInfo }