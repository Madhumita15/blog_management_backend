const mongoose = require('mongoose')
const Schema = mongoose.Schema

const otpSchema = new Schema({
    userId:{
        type: mongoose.Types.ObjectId,
        ref: "user",
        required: [true, "User id is required"]
    },
    otp: {
        type: String,
        required: [true, "OTP is required"]
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '15m'

    }
})

const otpModel = mongoose.model("otp", otpSchema)

module.exports = otpModel