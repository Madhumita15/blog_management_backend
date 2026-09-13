const User = require("../models/user.model");
const httpStatusCode = require("../utils/httpstatuscode");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendMail");
const Otp = require("../models/otp.model");
const generateSecretKey = require("../utils/generateSecretKey");
const cloudinary = require("../config/cloudinaryConfig");

class UserController {
  async register(req, res) {
    try {
      const { name, email, phone, password } = req.body;
      console.log("request", req.file);
      const existingEmail = await User.findOne({ email: email });
      if (existingEmail) {
        if (req.file) {
          await cloudinary.uploader.destroy(existingEmail.profile_public_id);
        }

        return res.status(httpStatusCode.BAD_REQUEST).json({
          status: false,
          message: "User already exists",
        });
      }
      const salt = 10;
      const hashPassword = await bcryptjs.hash(password, salt);

      const newUser = new User({
        name: name,
        email: email,
        password: hashPassword,
        phone: phone,
      });
      if (req.file) {
        newUser.profile_image = req.file.path;
        newUser.profile_public_id = req.file.filename;
      }

      const user = await newUser.save();
      await sendEmail.verifyEmail(req, user);
      if (!user) {
        return res.status(httpStatusCode.BAD_REQUEST).json({
          status: false,
          message: "User not created",
        });
      } else {
        return res.status(httpStatusCode.CREATED).json({
          status: true,
          message: "User created successfully! Otp send to your email",
        });
      }
    } catch (error) {
      return res.status(httpStatusCode.SERVER_ERROR).json({
        status: false,
        message: error.message,
      });
    }
  }

  async verify(req, res) {
    try {
      const { otp, email } = req.body;
      const existingUser = await User.findOne({ email: email });
      if (!existingUser) {
        return res.status(httpStatusCode.NOT_FOUND).json({
          status: false,
          message: "User not found",
        });
      }
      if (existingUser.isVerified) {
        return res.status(httpStatusCode.BAD_REQUEST).json({
          status: false,
          message: "Email is already verified",
        });
      }

      const emailVerification = await Otp.findOne({
        userId: existingUser._id,
        otp: otp,
      });
      if (!emailVerification) {
        if (!existingUser.isVerified) {
          await sendEmail.verifyEmail(req, existingUser);
          return res.status(httpStatusCode.BAD_REQUEST).json({
            status: false,
            message: "Invalid otp, new otp send to your email",
          });
        }
        return res.status(httpStatusCode.BAD_REQUEST).json({
          status: false,
          message: "Invalid otp",
        });
      }
      const currentTime = new Date();
      const expirationTime =
        emailVerification.createdAt.getTime() + 15 * 60 * 1000;

      if (currentTime > expirationTime) {
        await sendEmail.verifyEmail(req, existingUser);
        return res.status(httpStatusCode.BAD_REQUEST).json({
          status: false,
          message: "otp expired, new otp send to your email",
        });
      }

      existingUser.isVerified = true;
      await existingUser.save();

      await Otp.deleteMany({ userId: existingUser._id });
      return res.status(httpStatusCode.OK).json({
        status: true,
        message: "Email verified successfully",
      });
    } catch (error) {
      return res.status(httpStatusCode.SERVER_ERROR).json({
        status: false,
        message: "Unable to verify email, please try again later",
      });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email: email });
      if (!user) {
        return res.status(httpStatusCode.NOT_FOUND).json({
          status: false,
          message: "User not found",
        });
      }

      if (!user.isVerified) {
        return res.status(httpStatusCode.BAD_REQUEST).json({
          status: false,
          message: "Please verify your email first",
        });
      }

      const isMatch = await bcryptjs.compare(password, user.password);
      if (!isMatch) {
        return res.status(httpStatusCode.BAD_REQUEST).json({
          status: false,
          message: "Invalid credentials",
        });
      }

      const accessToken = await jwt.sign(
        {
          id: user._id,
          role: user.role,
        },
        process.env.JWT_ACCESS_SECRET_KEY,
        { expiresIn: "1d" },
      );

      const refreshToken = await jwt.sign(
        {
          id: user._id,
          role: user.role,
        },
        process.env.JWT_REFRESH_SECRET_KEY,
        { expiresIn: "30d" },
      );

      let secretKey;

      if (user.role === "admin" || user.role === "writer") {
        secretKey = await generateSecretKey();
        const hashSecretKey = await bcryptjs.hash(secretKey, 10);
        user.secretKey = hashSecretKey;
      }

      user.refreshToken = refreshToken;
      await user.save();

      return res.status(httpStatusCode.OK).json({
        status: true,
        message: "Login Successfully!",
        accessToken: accessToken,
        refreshToken: refreshToken,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          image: user.profile_image,
        },
        secretKey: secretKey,
      });
    } catch (error) {
      return res.status(httpStatusCode.SERVER_ERROR).json({
        status: false,
        message: error.message,
      });
    }
  }

  async forgotPasswordLink(req, res) {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email: email });
      if (!user) {
        return res.status(httpStatusCode.NOT_FOUND).json({
          status: false,
          message: "Email doesn't exist",
        });
      }

      const secretKey = user._id + process.env.JWT_ACCESS_SECRET_KEY;
      const tokenLink = jwt.sign({ userId: user._id }, secretKey, {
        expiresIn: "20m",
      });

      const resetLink = `${process.env.FRONTEND_URL}/account/forgotPassword/${user._id}/${tokenLink}`;

      await sendEmail.forgotPassword(req, user, resetLink);

      return res.status(httpStatusCode.OK).json({
        status: true,
        message: "Password reset email sent, please check your email",
      });
    } catch (error) {
      return res.status(httpStatusCode.SERVER_ERROR).json({
        status: false,
        message: error.message,
      });
    }
  }

  async forgotPassword(req, res) {
    try {
      const { newPassword, confirmPassword } = req.body;
      const { id, token } = req.params;
      const user = await User.findById(id);
      if (!user) {
        return res.status(httpStatusCode.NOT_FOUND).json({
          status: false,
          message: "User not found",
        });
      }
      const secretKey = user._id + process.env.JWT_ACCESS_SECRET_KEY;
      jwt.verify(token, secretKey);
      if (!newPassword || !confirmPassword) {
        return res.status(httpStatusCode.BAD_REQUEST).json({
          status: false,
          message: "New password and current password is required",
        });
      }

      if (newPassword !== confirmPassword) {
        return res.status(httpStatusCode.BAD_REQUEST).json({
          status: false,
          message: "New password and current password is not match",
        });
      }
      const hashNewPassword = await bcryptjs.hash(newPassword, 10);

      await User.findByIdAndUpdate(id, { $set: { password: hashNewPassword } });
      return res.status(httpStatusCode.OK).json({
        status: true,
        message: "Password reset successfully!",
      });
    } catch (error) {
      return res.status(httpStatusCode.SERVER_ERROR).json({
        status: false,
        message: error.message,
      });
    }
  }

  async generaterefreshToken(req, res) {
    try {
      const refreshToken = req.headers.refreshToken;
      if (!refreshToken) {
        return res.status(httpStatusCode.UNAUTHORIZED).json({
          status: false,
          message: "Refresh token is not provided",
        });
      }

      const decode = jwt.verify(
        refreshToken,
        process.env.JWT_Refresh_SECRET_KEY,
      );
      const user = await User.findById(decode.id);

      if (!user) {
        return res.status(httpStatusCode.NOT_FOUND).json({
          status: false,
          message: "User not found",
        });
      }

      if (user.refreshToken !== refreshToken) {
        return res.status(httpStatusCode.UNAUTHORIZED).json({
          status: false,
          message: "Refresh token is invalid or revoked",
        });
      }

      const newAccessToken = jwt.sign(
        {
          id: user._id,
          role: user.role,
        },
        process.env.JWT_ACCESS_SECRET_KEY,
        { expiresIn: "1d" },
      );

      user.accessToken = newAccessToken;
      await user.save();
      return res.status(httpStatusCode.OK).json({
        status: true,
        message: "new accessToken generate successfully!",
        accessToken: newAccessToken,
      });
    } catch (error) {
      return res.status(httpStatusCode.UNAUTHORIZED).json({
        status: false,
        message: "Invalid or expire refresh token",
      });
    }
  }

  async logout(req, res) {
    try {
      const id = req.user._id;
      const user = await User.findById(id);
      if (!user) {
        return res.status(httpStatusCode.NOT_FOUND).json({
          status: false,
          message: "User not found",
        });
      }
      user.refreshToken = null;
      await user.save();
      return res.status(httpStatusCode.OK).json({
        status: true,
        message: "Logout successfully!",
      });
    } catch (error) {
      return res.status(httpStatusCode.SERVER_ERROR).json({
        status: false,
        message: error.message,
      });
    }
  }
}

module.exports = new UserController();
