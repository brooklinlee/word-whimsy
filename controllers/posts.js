import { Profile } from "../models/profile.js"
import { Post } from "../models/post.js"

function newPost(req, res) {
  res.render('posts/new', {
    title: 'New Whimsy Entry'
  })
}

function create(req, res) {
  req.body.public = !!req.body.public
  // req.body.owner = req.user.profile._id
  Post.create(req.body)
  .then(post => {
    res.redirect('/posts')
  })
  .catch(err => {
    console.log(err)
    console.log('❌❌❌')
    res.redirect('/')
  })
}

function index(req, res) {
  Post.find({})
  .then(posts => {
    res.render('posts/index', {
      posts,
      title: 'Whimsy Journal'
    })
  })
  .catch(err => {
    console.log(err)
    console.log('❌❌❌')
    res.redirect('/')
  })
}


export {
  newPost as new,
  create,
  index,
}