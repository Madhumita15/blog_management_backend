const Joi = require("joi");

class CategorySchema {
  static categoryCreation = Joi.object({
    name: Joi.string()
      .trim()
      .pattern(/^[A-Za-z]+(?:\s+[A-Za-z]+)*$/)
      .required()
      .messages({
        "string.empty": "category name is required",
        "string.pattern.base": "category name can contain letters and spaces",
        "any.required": "category name is required",
      }),
  });
}
module.exports = CategorySchema;
