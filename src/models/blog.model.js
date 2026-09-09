const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const blogSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, "Title is required"],
    },
    content: {
      type: String,
      trim: true,
      required: [true, "Content is required"],
    },
    author: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: true,
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "category",
      required: [true, "Category is required"],
    },
    status: {
      type: String,
      trim: true,
      enum: ["published", "unpublished", "pending"],
    },
    blog_image: {
      type: String,
    },
    blog_public_id: {
      type: String,
    },
    likesCount: {
      type: Number,
      default: 0,
    },
    commentCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

const blogModel = mongoose.model("blog", blogSchema);
module.exports = blogModel;
