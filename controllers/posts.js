import { Profile } from "../models/profile.js"
import { Post } from "../models/post.js"

function newPost(req, res) {
  res.render('posts/new', {
    title: 'New Whimsy Entry'
  })
}

function create(req, res) {
  req.body.public = !!req.body.public
  req.body.author = req.user.profile._id
  for (let key in req.body) {
    if (req.body[key] === '') delete req.body[key]
  }
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

function edit(req,res) {
  Post.findById(req.params.postId)
  .then(post => {
    if(post.author.equals(req.user.profile._id)) {
      res.render('posts/edit', {
        post: post,
        title: 'Edit Whimsy Entry'
      })
    } else {
      res.redirect('/posts')
    }
  })
  .catch(err => {
    console.log(err)
    console.log('❌❌❌')
    res.redirect('/')
  })
}

function update(req, res) {
  Post.findByIdAndUpdate(req.params.postId)
  .populate('author')
  .then(post => {
    // if(post.author.equals(req.user.profile._id)) {
      req.body.public = !!req.body.public
      post.updateOne(req.body)
      .then(() => {
        res.redirect(`/posts`)
      })
    // }  else {
    //   throw new Error('🚫 Not authorized 🚫')
    // }
  })
  .catch(err => {
    console.log('❌')
    console.log(err)
    res.redirect('/')
  })
}

function show(req, res) {
  Post.findById(req.params.postId)
  .then(post => {
    // const isSelf = post.author._id.equals(req.user.profile._id)
    res.render('posts/show', {
    title: `${post.title}`,
    post
    // isSelf
    })
  })
  .catch(err => {
    console.log('❌')
    console.log(err)
    res.redirect('/')
  })
}

export {
  newPost as new,
  create,
  index,
  deletePost as delete,
  edit,
  update,
  show,
}