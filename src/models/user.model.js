const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      trim: true,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      trim: true,
      required: [true, "Password is required"],
      unique: true,
    },
    phone: {
      type: String,
      trim: true,
      required: [true, "Phone is required"],
    },
    role: {
      type: String,
      trim: true,
      enum: ["user", "writer", "admin"],
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    secretKey: {
      type: String,
      default: null,
    },
    writerRequestStatus: {
      type: String,
      enum: ["none", "pending", "approved", "rejected"],
      default: "none",
    },
    profile_image: {
      type: String,
      default:
        "https://plus.unsplash.com/premium_photo-1739786996022-5ed5b56834e2?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y2FydG9vbiUyMGJveXxlbnwwfHwwfHx8MA%3D%3D",
    },
    profile_public_id: {
      type: String,
    },
    refreshToken: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const userModel = mongoose.model("user", userSchema);
module.exports = userModel;
