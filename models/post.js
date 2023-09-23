import mongoose from 'mongoose'

const Schema = mongoose.Schema



const commentSchema = new Schema({
  comment: String,
  author: { type: Schema.Types.ObjectId, ref: 'Profile' }
}, {
  timestamps: true
})

const postSchema = new Schema({
  date: {
    type: Date,
    default: Date.now
  },
  title: {
    type: String,
    default: 'Untitled'
  },
  content: {
    type: String,
    required: true
  },
  feelings: {
    type: String,
    enum: ['😄', '😢', '🥳', '😴', '😠', '😎']
  },
  comments: [commentSchema],
  public: {
    type: Boolean,
    // required: true
  },
  author: { type: Schema.Types.ObjectId, ref: 'Profile' },
}, {
  timestamps: true
})

const Post = mongoose.model('Post', postSchema)

export {
  Post
}