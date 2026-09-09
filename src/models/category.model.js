const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Category name is required"],
    },
  },
  {
    timestamps: true,
  },
);
const categoryModel = mongoose.model("category", categorySchema)
module.exports = categoryModel;
