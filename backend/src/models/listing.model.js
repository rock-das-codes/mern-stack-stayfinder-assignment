import  bcrypt  from "bcryptjs";
import mongoose from "mongoose"
import jwt from "jsonwebtoken"

var listingSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        
    
    },
    name:{
        type:String,
        required:true,
       
    },
    description:{
        type:String,
        required:true,

    },
    images:{
        type:Array ,
        required:true,
        default:"https://picsum.photos/200/300"
    },
    address:{
      type:String,
      required:true
    },
    price:{
        type:String,
        required:true
    },
     userRef: {
        type: String,
        required: true,
    },

},{timestamps:true})



export const Listing= mongoose.model('listing',listingSchema)