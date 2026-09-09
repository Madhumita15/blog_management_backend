const httpStatusCode = require("../utils/httpstatuscode");
const cloudinary = require('../config/cloudinaryConfig');

class Validation {
  static validate(schema) {
    return async (req, res, next) => {
      const { error, value } = schema.validate(req.body, {
        abortEarly: true,
        stripUnknown: false,
      });
      if (error) {
        try {
            console.log("validation error")
          if (req.file) {
            console.log(req.file.filename)
            await cloudinary.uploader.destroy(req.file.filename);
          }
        } catch (error) {
          console.log(error);
        }

        return res.status(httpStatusCode.BAD_REQUEST).json({
          status: false,
          errors: error.details.map((err) => ({
            field: err.path.join("."),
            error: err.message,
          })),
        });
      }

      req.body = value;
      next();
    };
  }
}

module.exports = Validation;
