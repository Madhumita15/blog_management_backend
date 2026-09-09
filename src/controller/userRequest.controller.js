const User = require("../models/user.model");
const httpStatusCode = require("../utils/httpstatuscode");
const sendEmail = require('../utils/sendMail')

class UserRequestController {
  async getProfile(req, res) {
    try {
      const id = req.user._id;
      const user = await User.findById(id);

      if (!user) {
        return res.status(httpStatusCode.NOT_FOUND).json({
          status: false,
          message: "Profile not found",
          data: null
        });
      } else {
        return res.status(httpStatusCode.OK).json({
          status: true,
          message: "Profile fetched successfully!",
          data: {
            name: user.name,
            email: user.email,
            phone: user.phone,
            profile_image: user.profile_image,
            role: user.role
          }
        });
      }
    } catch (error) {
      return res.status(httpStatusCode.SERVER_ERROR).json({
        status: false,
        message: error.message,
      });
    }
  }

  async userRequest(req, res) {
    try {
      const id = req.user._id;
      const user = await User.findById(id);
      if (!user) {
        return res.status(httpStatusCode.NOT_FOUND).json({
          status: false,
          message: "User not found",
        });
      }

      if (user.writerRequestStatus === "pending") {
        return res.status(httpStatusCode.BAD_REQUEST).json({
          status: false,
          message: "You already send request to become an writer",
        });
      }

      if (user.writerRequestStatus === "approved") {
        return res.status(httpStatusCode.BAD_REQUEST).json({
          status: false,
          message: "You are already a writer",
        });
      }

      user.writerRequestStatus = "pending";
      await user.save();
      return res.status(httpStatusCode.OK).json({
        status: true,
        message: "Request sends successfully!, waiting for admin approval",
      });
    } catch (error) {
      return res.status(httpStatusCode.SERVER_ERROR).json({
        status: false,
        message: error.message,
      });
    }
  }

  async getAllPendingRequest(req, res) {
    try {
      const user = await User.find({ writerRequestStatus: "pending" });
      if (!user || user.length === 0) {
        return res.status(httpStatusCode.OK).json({
          status: true,
          message: "No pending request",
          data: [],
        });
      } else {
        return res.status(httpStatusCode.OK).json({
          status: true,
          message: "All pending request gets successfully!",
          data: user,
        });
      }
    } catch (error) {
      return res.status(httpStatusCode.SERVER_ERROR).json({
        status: false,
        message: error.message,
      });
    }
  }

  async manageWriterRequest(req, res) {
    try {
      const id = req.params.id;
      const { action } = req.body;

      if (!["approved", "rejected"].includes(action)) {
        return res.status(httpStatusCode.BAD_REQUEST).json({
          status: false,
          message: "Invalid action, use approved or rejected",
        });
      }
      const user = await User.findById(id);
      if (!user) {
        return res.status(httpStatusCode.NOT_FOUND).json({
          status: false,
          message: "User not found",
        });
      }

      if (user.writerRequestStatus !== "pending") {
        return res.status(httpStatusCode.BAD_REQUEST).json({
          status: false,
          message: "No pending writer request found",
        });
      }

      if (action === "approved") {
        user.writerRequestStatus = action;
        user.role = "writer";
        await sendEmail.writerRequestApproved(req, user);
      } else if (action === "rejected") {
        user.writerRequestStatus = action;
        await sendEmail.writerRequestRejected(req, user);
      }
      await user.save();

      return res.status(httpStatusCode.OK).json({
        status: false,
        message: `Writer request ${action} successfully`,
      });
    } catch (error) {
      return res.status(httpStatusCode.SERVER_ERROR).json({
        status: false,
        message: error.message,
      });
    }
  }
}

module.exports = new UserRequestController();
