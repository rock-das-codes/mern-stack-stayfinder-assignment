import bcrypt  from "bcryptjs";
import mongoose from "mongoose"
import jwt from "jsonwebtoken"

var userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        lowercase:true,
        unique:true,
        trim:true, //to cut of trailing spaces if any
    
    },
    email:{
        type:String,
        required:true,
        lowercase:true,
        unique:true,
        trim:true
    },
    password:{
        type:String,
        required:true,

    },
    avatar:{
        type:String,
        default:"https://picsum.photos/200/300"
    },
    role:{
      type:String,
      enum:["user","host"],
      default:"user"
    },
    refreshtoken:{
        type:String
    }
},{timestamps:true})


userSchema.pre("save",async function(next){
 if(this.isModified("password")){
    this.password = await bcrypt.hash(this.password,10)
 }
 next()
})
userSchema.methods.isPasswordcorrect=async function(password){
     return await bcrypt.compare(password,this.password)
}

userSchema.methods.generatedAccessTokens = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    );
};

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        { _id: this._id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );
};

export const User= mongoose.model('user',userSchema)