import { Profile } from "../models/profile.js"
import { Post } from "../models/post.js"

function newPost(req, res) {
  res.render('posts/new', {
    title: 'New Whimsy Entry'
  })
}

function create(req, res) {
  req.body.public = !!req.body.public
  Profile.findById(req.user.profile._id)
  .then(profile => {
    profile.posts.push(req.body)
    profile.save()
    .then(() => {
      res.redirect('/posts')
    })
    .catch(err => {
      console.log(err)
      console.log('❌❌❌')
      res.redirect('/')
    })
  })
  .catch(err => {
    console.log(err)
    console.log('❌❌❌')
    res.redirect('/')
  })
}
// function create(req, res) {
//   req.body.public = !!req.body.public
//   // req.body.owner = req.user.profile._id
//   for (let key in req.body) {
//     if (req.body[key] === '') delete req.body[key]
//   }
//   Post.create(req.body)
//   .then(post => {
//     res.redirect('/posts')
//   })
//   .catch(err => {
//     console.log(err)
//     console.log('❌❌❌')
//     res.redirect('/')
//   })
// }

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

function deletePost(req, res) {
  Post.findByIdAndDelete(req.params.postId)
  .then(post => {
    if (post.author.equals(req.user.profile._id)) {
      post.deleteOne()
      .then(() => {
        res.redirect('/posts')
      })
    } else {
      throw new Error('🚫 Not authorized 🚫')
    }
  })
  .catch(err => {
    console.log(err)
    res.redirect('/posts')
  })  
}

function edit(req, res) {

}

export {
  newPost as new,
  create,
  index,
  deletePost as delete,
  edit,
}