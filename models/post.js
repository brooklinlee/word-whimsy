import mongoose from 'mongoose'

const Schema = mongoose.Schema

const postSchema = new Schema({
  title: String,
  content: String,
  public: Boolean,
  author: { type: Schema.Types.ObjectId, ref: 'Profile' }
}, {
  timestamps: true
})

const Post = mongoose.model('Post', postSchema)

export {
  Post
}