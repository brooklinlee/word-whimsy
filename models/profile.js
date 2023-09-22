import mongoose from 'mongoose'

const Schema = mongoose.Schema


const commentSchema = new Schema({
  comment: String,
  author: { type: Schema.Types.ObjectId, ref: 'Profile' }
}, {
  timestamps: true
})

const postSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  feelings: String,
  comments: [commentSchema],
  public: {
    type: Boolean,
    required: true
  },
  author: { type: Schema.Types.ObjectId, ref: 'Profile' }
}, {
  timestamps: true
})


const profileSchema = new Schema({
  name: String,
  avatar: String,
  posts: [postSchema]
}, {
  timestamps: true
})

const Profile = mongoose.model('Profile', profileSchema)

export {
  Profile
}
