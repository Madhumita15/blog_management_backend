const httpStatusCode = require("../utils/httpstatuscode");
const Category = require("../models/category.model");

class CategoryController {
  async categoryCreation(req, res) {
    switch (req.method) {
      case "POST": {
        const { name } = req.body;
        const newCategory = new Category({
          name: name,
        });
        const category = await newCategory.save();
        if (category) {
          return res.status(httpStatusCode.CREATED).json({
            status: true,
            message: "Category created Successfully!",
            data: newCategory,
          });
        } else {
          return res.status(httpStatusCode.BAD_REQUEST).json({
            status: false,
            message: "Category not created",
          });
        }
      }

      case "GET": {
        const category = await Category.find();
        if (!category || category.length === 0) {
          return res.status(httpStatusCode.OK).json({
            status: true,
            message: "Category not found",
            data: []
          });
        } else {
          return res.status(httpStatusCode.OK).json({
            status: false,
            message: "All category gets successfully!",
            data: category,
          });
        }
      }

      case "PUT": {
        const { name } = req.body;
        const id = req.params.id;

        const category = await Category.findByIdAndUpdate(
          id,
          { name },
          { new: true },
        );

        if (!category) {
          return res.status(httpStatusCode.NOT_FOUND).json({
            status: false,
            message: "Category not found",
          });
        } else {
          return res.status(httpStatusCode.OK).json({
            status: false,
            message: "Category updated successfully!",
            data: category,
          });
        }
      }

      case "DELETE": {
        const id = req.params.id;
        const category = await Category.findByIdAndDelete(id);
        if (!category) {
          return res.status(httpStatusCode.NOT_FOUND).json({
            status: false,
            message: "Category not found",
          });
        } else {
          return res.status(httpStatusCode.OK).json({
            status: true,
            message: "Category deleted successfully!",
          });
        }
      }

      default:
        return res.status(httpStatusCode.METHOD_NOT_ALLOWED).json({
          status: false,
          message: "Method not allowed",
        });
    }
  }
}
module.exports = new CategoryController();
