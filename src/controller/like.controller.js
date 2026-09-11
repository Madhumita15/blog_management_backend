const Like = require("../models/like.model");
const httpStatusCode = require("../utils/httpstatuscode");
const Blog = require("../models/blog.model");

class LikeController {
  async createLikeUnlike(req, res) {
    try {
      const { blogId } = req.body;
      const userId = req.user._id;
      const blogById = await Blog.findById(blogId);

      if (!blogById) {
        return res.status(httpStatusCode.BAD_REQUEST).json({
          status: false,
          message: "Blog not found",
        });
      }

      const existingLike = await Like.findOne({
        userId: userId,
        blogId: blogId,
      });
      if (existingLike) {
        await Like.findByIdAndDelete(existingLike._id);
        blogById.likesCount -= 1;
        await blogById.save();

        return res.status(httpStatusCode.OK).json({
          status: true,
          message: "you unliked this post",
        });
      }

      const newLike = new Like({
        userId: userId,
        blogId: blogId,
      });
      const likeData = await newLike.save();
      blogById.likesCount += 1;
      await blogById.save();

      return res.status(httpStatusCode.CREATED).json({
        status: true,
        message: "You liked this post",
        data: likeData,
      });
    } catch (error) {
      return res.status(httpStatusCode.SERVER_ERROR).json({
        status: false,
        message: error.message,
      });
    }
  }

  async getMyLike(req, res) {
    try {
      const id = req.user._id;
      const likeData = await Like.find({ userId: id });
      if (!likeData) {
        return res.status(httpStatusCode.OK).json({
          status: true,
          message: "Like not found",
          data: []
        });
      } else {
        return res.status(httpStatusCode.OK).json({
          status: true,
          message: "Like fetched successfully!",
          data: likeData
        });
      }
    } catch (error) {
      return res.status(httpStatusCode.SERVER_ERROR).json({
        status: false,
        message: error.message,
      });
    }
  }
}
module.exports = new LikeController();
