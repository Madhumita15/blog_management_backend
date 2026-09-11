const Blog = require("../models/blog.model");
const httpStatusCode = require("../utils/httpstatuscode");
const cloudinary = require("../config/cloudinaryConfig");

class BlogController {
  async blogOperation(req, res) {
    switch (req.method) {
      case "POST": {
        const { title, content, category } = req.body;
        const newBlog = new Blog({
          title: title,
          author: req.user._id,
          content: content,
          category: category,
        });
        // console.log("req file", req.file);

        if (req.file) {
          newBlog.blog_image = req.file.path;
          newBlog.blog_public_id = req.file.filename;
        }
        if (req.user.role === "admin") {
          newBlog.status = "published";
        } else {
          newBlog.status = "pending";
        }
        const blog = await newBlog.save();
        if (!blog) {
          return res.status(httpStatusCode.BAD_REQUEST).json({
            status: false,
            message: "Blog is not created",
            data: null,
          });
        } else {
          return res.status(httpStatusCode.CREATED).json({
            status: false,
            message: "Blog created successfully!",
            data: blog,
          });
        }
      }

      case "GET": {
        const id = req.params.id;
        if (id) {
          const blog = await Blog.findById(id);
          if (!blog) {
            return res.status(httpStatusCode.NOT_FOUND).json({
              status: false,
              message: "Blog not found",
              data: null,
            });
          } else {
            return res.status(httpStatusCode.OK).json({
              status: true,
              message: "Blog get successfully!",
              data: blog,
            });
          }
        }
        if (!req.user) {
          const blogs = await Blog.aggregate([
            {
              $match: { status: "published" },
            },
            {
              $lookup: {
                from: "users",
                localField: "author",
                foreignField: "_id",
                as: "author",
              },
            },
            {
              $unwind: "$author",
            },
            {
              $lookup: {
                from: "categories",
                localField: "category",
                foreignField: "_id",
                as: "category",
              },
            },
            {
              $unwind: "$category",
            },
            
            {
              $project: {
                _id: 1,
                blog_image: 1,
                content: 1,
                status: 1,
                title: 1,
                likesCount: 1,
                createdAt: 1,
                updatedAt: 1,
                "author._id": 1,
                "author._id": 1,
                "author.name": 1,
                "author.email": 1,
                "category._id": 1,
                "category.name": 1,
              
              },
            }
            
          ]);
          if (!blogs || blogs.length === 0) {
            return res.status(httpStatusCode.OK).json({
              status: true,
              message: "Blogs not found",
              data: [],
            });
          } else {
            return res.status(httpStatusCode.OK).json({
              status: true,
              message: "All blogs gets successfully",
              data: blogs,
            });
          }
        }

        if (req.user.role === "admin") {
          const { status } = req.query;
          const filter = status ? { status: status } : {};

          const allBlog = await Blog.aggregate([
            {
              $match: filter,
            },
            {
              $lookup: {
                from: "users",
                localField: "author",
                foreignField: "_id",
                as: "author",
              },
            },
            {
              $unwind: "$author",
            },
            {
              $lookup: {
                from: "categories",
                localField: "category",
                foreignField: "_id",
                as: "category",
              },
            },
            {
              $unwind: "$category",
            },
            {
              $project: {
                _id: 1,
                blog_image: 1,
                content: 1,
                status: 1,
                title: 1,
                createdAt: 1,
                updatedAt: 1,
                "author._id": 1,
                "author.name": 1,
                "author.email": 1,
                "category._id": 1,
                "category.name": 1,
              }
            }
          ]);
          if (!allBlog || allBlog.length === 0) {
            return res.status(httpStatusCode.OK).json({
              status: true,
              message: "Blogs not found",
              data: [],
            });
          } else {
            return res.status(httpStatusCode.OK).json({
              status: true,
              message: "All Blogs gets successfully!",
              data: allBlog,
            });
          }
        }

        if (req.user.role === "writer") {
          const allBlog = await Blog.aggregate([
            {
              $match: { author: req.user._id },
            },
            {
              $lookup: {
                from: "users",
                localField: "author",
                foreignField: "_id",
                as: "author",
              },
            },
            {
              $unwind: "$author",
            },
            {
              $lookup: {
                from: "categories",
                localField: "category",
                foreignField: "_id",
                as: "category",
              },
            },
            {
              $unwind: "$category",
            },
            {
              $project: {
                _id: 1,
                blog_image: 1,
                content: 1,
                status: 1,
                title: 1,
                createdAt: 1,
                updatedAt: 1,
                "author._id": 1,
                "author._id": 1,
                "author.name": 1,
                "author.email": 1,
                "category._id": 1,
                "category.name": 1,
              },
            },
          ]);
          if (!allBlog || allBlog.length === 0) {
            return res.status(httpStatusCode.OK).json({
              status: true,
              message: "Blogs not found",
              data: [],
            });
          } else {
            return res.status(httpStatusCode.OK).json({
              status: true,
              message: "All Blogs gets successfully!",
              data: allBlog,
            });
          }
        }

        break;
      }

      case "PUT": {
        const { title, content, category } = req.body;
        const id = req.params.id;
        // console.log("put blog", req.body);
        const blogById = await Blog.findById(id);
        if (!blogById) {
          return res.status(httpStatusCode.NOT_FOUND).json({
            status: false,
            message: "Blog is not found",
          });
        }
        console.log("userid", req.user._id, "blogid", blogById.author);

        if (
          req.user.role === "writer" &&
          blogById.author.toString() !== req.user._id.toString()
        ) {
          return res.status(httpStatusCode.FORBIDDEN).json({
            status: false,
            message: "your are not be able to update this blog",
          });
        }

        let blog_image = blogById.blog_image;
        let blog_public_id = blogById.blog_public_id;

        if (req.file) {
          if (blog_image) {
            await cloudinary.uploader.destroy(blog_public_id);
          }
          blog_image = req.file.path;
          blog_public_id = req.file.filename;
        }

        blogById.title = title ?? blogById.title;
        blogById.content = content ?? blogById.content;
        blogById.category = category ?? blogById.category;
        blogById.blog_image = blog_image;
        blogById.blog_public_id = blog_public_id;

        const updatedBlog = await blogById.save();
        return res.status(httpStatusCode.OK).json({
          status: false,
          message: "Blog update successfully!",
          data: updatedBlog,
        });
      }

      case "PATCH": {
        const { status } = req.body;

        const id = req.params.id;
        if (req.user.role !== "admin") {
          return res.status(httpStatusCode.FORBIDDEN).json({
            status: false,
            message: "You are not be able to perform this operation",
          });
        }

        if (!["published", "unpublished"].includes(status)) {
          return res.status(httpStatusCode.BAD_REQUEST).json({
            status: false,
            message: "Invalid status, use published or unpublished",
          });
        }

        const blog = await Blog.findById(id);
        if (!blog) {
          return res.status(httpStatusCode.NOT_FOUND).json({
            status: false,
            message: "Blog not found",
            data: null,
          });
        }

        if (blog.status !== "pending") {
          return res.status(httpStatusCode.NOT_FOUND).json({
            status: false,
            message: "No pending blogs found",
            data: null,
          });
        }

        blog.status = status;
        const data = await blog.save();
        return res.status(httpStatusCode.OK).json({
          status: true,
          message: `Blog ${status} successfully!`,
          data: data,
        });
      }

      case "DELETE": {
        const id = req.params.id;
        const blogById = await Blog.findById(id);

        if (!blogById) {
          return res.status(httpStatusCode.NOT_FOUND).json({
            status: false,
            message: "Blog not found",
          });
        }

        if (
          req.user.role === "writer" &&
          blogById.author.toString() !== req.user._id.toString()
        ) {
          return res.status(httpStatusCode.FORBIDDEN).json({
            status: false,
            message: "your are not be able to update this blog",
          });
        }
        if (blogById.blog_public_id) {
          await cloudinary.uploader.destroy(blogById.blog_public_id);
        }

        await Blog.findByIdAndDelete(id);
        return res.status(httpStatusCode.OK).json({
          status: true,
          message: "Blog deleted successfully!",
        });
      }

      default:
        return res.status(httpStatusCode.METHOD_NOT_ALLOWED).json({
          status: false,
          message: "Method not allowed",
        });
    }
  }
}
module.exports = new BlogController();
