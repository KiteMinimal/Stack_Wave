
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config/config");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        trim: true,
        required: [true, "username is required"],
        unique: [true, "username is already taken"],
        minLength: "3",
        maxLength: "15",
    },
    email: {
        type: String,
        trim: true,
        required: [true, "email is required"],
        unique: [true, "email is already taken"],
        minLength: "3",
        maxLength: "15",
    },
    password: {
        type: String,
        select: false,
    },
    bio: {
        type: String,
        default: ""
    },
    avatar: {
        type: String,
        default: "https://cdn1.iconfinder.com/data/icons/user-pictures/100/unknown-512.png"
    },
    reputation: {
        type: Number,
        default: 0
    },
    bages: {
        type: [String],
        default: []
    }
})

userSchema.statics.hashPassword = async function(password){
    if(!password){
        throw new Error("Password is required")
    }
    return await bcrypt.hash(password,10)
}

userSchema.methods.comparePassword = async function(password){
    if(!password){
        throw new Error("Password is required")
    }
    return await bcrypt.compare(password,this.password)
}

userSchema.statics.verifyToken = function(token){
    if(!token){
        throw new Error("token is required")
    }

    return jwt.verify(token, config.JWT_SECRET)
}

userSchema.methods.generateToken = function(){
    return jwt.sign({
        _id: this._id,
        email: this.email
    }, config.JWT_SECRET, {expiresIn: config.JWT_EXPIARY})
}

const userModel = mongoose.model("User", userSchema)

module.exports = userModel
