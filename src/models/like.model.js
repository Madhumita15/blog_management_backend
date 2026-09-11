const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const likeSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    blogId: {
        type: Schema.Types.ObjectId,
        ref: "blog"
    }


},
{
    timestamps: true
})
likeSchema.index({blogId: 1, userId: 1}, {unique: true})

const likeModel = mongoose.model("like", likeSchema)
module.exports = likeModel