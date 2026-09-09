const OTP = require("../models/otp.model");
const transporter = require("../config/mailConfig");

class SendEmail {
  static async verifyEmail(req, user) {
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const newOtp = new OTP({
      userId: user._id,
      otp: otp,
    });
    await newOtp.save();

    try {
      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: "otp- verify your account",
        html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Verify Your Email</title>
        </head>

        <body style="
          margin: 0;
          padding: 0;
          background-color: #f4f6f8;
          font-family: Arial, Helvetica, sans-serif;
          color: #333333;
        ">

          <div style="
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          ">

            <!-- Header -->
            <div style="
              background-color: #4f46e5;
              padding: 25px;
              text-align: center;
            ">
              <h1 style="
                margin: 0;
                color: #ffffff;
                font-size: 24px;
              ">
                Verify Your Email
              </h1>
            </div>

            <!-- Content -->
            <div style="padding: 35px;">

              <h2 style="
                margin-top: 0;
                color: #222222;
              ">
                Hello ${user.name},
              </h2>

              <p style="
                font-size: 16px;
                line-height: 1.6;
              ">
                Thank you for creating an account with us.
                Please use the verification code below to verify your email address.
              </p>

              <!-- OTP -->
              <div style="
                margin: 30px 0;
                text-align: center;
              ">

                <p style="
                  margin-bottom: 10px;
                  color: #555555;
                  font-size: 15px;
                ">
                  Your Verification Code
                </p>

                <div style="
                  display: inline-block;
                  padding: 15px 30px;
                  background-color: #f3f4f6;
                  border: 1px solid #e5e7eb;
                  border-radius: 8px;
                  font-size: 30px;
                  font-weight: bold;
                  letter-spacing: 8px;
                  color: #4f46e5;
                ">
                  ${otp}
                </div>

              </div>

              <p style="
                font-size: 15px;
                line-height: 1.6;
                color: #555555;
              ">
                This OTP is required to verify your account.
                Please do not share this code with anyone.
              </p>

              <p style="
                font-size: 15px;
                line-height: 1.6;
                color: #555555;
              ">
                If you did not create this account, you can safely ignore this email.
              </p>

              <p style="
                margin-top: 30px;
                font-size: 15px;
              ">
                Thank you,<br />
                <strong>Admin Team</strong>
              </p>

            </div>

            <!-- Footer -->
            <div style="
              background-color: #f8f9fa;
              padding: 20px;
              text-align: center;
              color: #888888;
              font-size: 12px;
            ">
              <p style="margin: 0;">
                This is an automated email. Please do not reply.
              </p>
            </div>

          </div>

        </body>
        </html>
      `,
      });
      return otp;
    } catch (error) {
      throw error;
    }
  }

  static async forgotPassword(req, user, resetLink) {
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: "Reset Your Password",
        html: `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Password Reset</title>
      </head>

      <body style="
        margin: 0;
        padding: 0;
        background-color: #f4f4f7;
        font-family: Arial, Helvetica, sans-serif;
      ">
        <div style="
          max-width: 600px;
          margin: 40px auto;
          background-color: #ffffff;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0,0,0,0.08);
        ">

          <!-- Header -->
          <div style="
            background-color: #6d28d9;
            padding: 25px;
            text-align: center;
          ">
            <h1 style="
              margin: 0;
              color: #ffffff;
              font-size: 26px;
            ">
              Password Reset
            </h1>
          </div>

          <!-- Content -->
          <div style="padding: 35px 30px;">

            <h2 style="
              margin-top: 0;
              color: #333333;
              font-size: 22px;
            ">
              Hello ${user.name},
            </h2>

            <p style="
              color: #555555;
              font-size: 16px;
              line-height: 1.6;
            ">
              We received a request to reset the password for your account.
            </p>

            <p style="
              color: #555555;
              font-size: 16px;
              line-height: 1.6;
            ">
              Click the button below to create a new password:
            </p>

            <!-- Button -->
            <div style="
              text-align: center;
              margin: 30px 0;
            ">
              <a
                href="${resetLink}"
                style="
                  display: inline-block;
                  padding: 14px 28px;
                  background-color: #6d28d9;
                  color: #ffffff;
                  text-decoration: none;
                  border-radius: 6px;
                  font-size: 16px;
                  font-weight: bold;
                "
              >
                Reset Password
              </a>
            </div>

            <p style="
              color: #777777;
              font-size: 14px;
              line-height: 1.6;
            ">
              This password reset link will expire soon for your security.
              If you did not request a password reset, you can safely ignore
              this email.
            </p>

            <hr style="
              border: none;
              border-top: 1px solid #eeeeee;
              margin: 25px 0;
            " />

            <p style="
              color: #999999;
              font-size: 12px;
              line-height: 1.5;
            ">
              If the button above doesn't work, copy and paste the following
              link into your browser:
            </p>

            <p style="
              word-break: break-all;
              font-size: 12px;
            ">
              <a
                href="${resetLink}"
                style="color: #6d28d9;"
              >
                ${resetLink}
              </a>
            </p>

          </div>

          <!-- Footer -->
          <div style="
            background-color: #f8f8f8;
            padding: 20px;
            text-align: center;
          ">
            <p style="
              margin: 0;
              color: #999999;
              font-size: 12px;
            ">
              © ${new Date().getFullYear()} Your App. All rights reserved.
            </p>
          </div>

        </div>
      </body>
    </html>
  `,
      });
    } catch (error) {
      throw error;
    }
  }

  static async writerRequestApproved(req, user) {
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: "Your Writer Request Has Been Approved",
        html: `
      <!DOCTYPE html>
      <html>
        <body style="
          margin: 0;
          padding: 0;
          background-color: #f4f4f7;
          font-family: Arial, Helvetica, sans-serif;
        ">
          <div style="
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            padding: 30px;
            border-radius: 10px;
          ">
            <h2 style="color: #6d28d9;">
              Congratulations, ${user.name}!
            </h2>

            <p style="color: #444; font-size: 16px; line-height: 1.6;">
              Your request to become a Writer has been approved.
            </p>

            <p style="color: #444; font-size: 16px; line-height: 1.6;">
              You are now registered as a <strong>Writer</strong> on our
              platform.
            </p>

            <p style="color: #444; font-size: 16px; line-height: 1.6;">
              Please log in using your existing email address and password
              to access your Writer account.
            </p>

            <p style="color: #777; font-size: 14px; margin-top: 30px;">
              Thank you for being part of our platform.
            </p>
          </div>
        </body>
      </html>
    `,
      });
    } catch (error) {
      throw error;
    }
  }

  static async writerRequestRejected(req, user) {
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: "Update on Your Writer Request",
        html: `
      <!DOCTYPE html>
      <html>
        <body style="
          margin: 0;
          padding: 0;
          background-color: #f4f4f7;
          font-family: Arial, Helvetica, sans-serif;
        ">
          <div style="
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            padding: 30px;
            border-radius: 10px;
          ">
            <h2 style="color: #333333;">
              Hello ${user.name},
            </h2>

            <p style="color: #444; font-size: 16px; line-height: 1.6;">
              Thank you for your interest in becoming a Writer on our
              platform.
            </p>

            <p style="color: #444; font-size: 16px; line-height: 1.6;">
              After reviewing your request, we are unable to approve your
              request to become a Writer at this time.
            </p>

            <p style="color: #777; font-size: 14px; margin-top: 30px;">
              You can continue using your existing account as a User.
            </p>
          </div>
        </body>
      </html>
    `,
      });
    } catch (error) {
      throw error;
    }
  }
}
module.exports = SendEmail;
