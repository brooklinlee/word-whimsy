import { Profile } from "../models/profile.js"
import { Post } from "../models/post.js"

function index(req, res) {
  Profile.find({})
  .populate({
    path: 'posts',
    model: 'Post', 
  })
  .then(profiles => {
    res.render('profiles/index', {
    profiles,
    title: 'All WW Writers',
    getRandomIcon: () => {
      const icons = ['✏️', '📃', '🍎', '📓', '📚', '🖋️', '📝', '🤓', '📖', '📕', '📙']
      return icons[Math.floor(Math.random() * icons.length)]
      }
    })
  })
  .catch(err => {
    console.log('❌')
    console.log(err)
    res.redirect('/')
  })
}

function show(req, res) {
  Profile.findById(req.params.profileId)
  .then(profile => {
    Post.find({author: req.params.profileId})
    .populate('author')
    .populate('comments')
    .populate('public')
    .then(posts => {
      const isSelf = profile._id.equals(req.user.profile._id)
      const hasPublicPosts = posts.some(post => post.public === true)
      res.render('profiles/show', {
      title: 'Profile',
      profile,
      posts,
      isSelf, 
      hasPublicPosts
      })
    })
    .catch(err => {
    console.log('❌')
    console.log(err)
    res.redirect('/')
    })
  })
  .catch(err => {
    console.log('❌')
    console.log(err)
    res.redirect('/')
  })
}

export {
  index,
  show,
}