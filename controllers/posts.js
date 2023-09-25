import { Profile } from "../models/profile.js"
import { Post } from "../models/post.js"

function newPost(req, res) {
  res.render('posts/new', {
    title: 'New Whimsy Entry'
  })
}

// function formatDate(date) {
//   const today = new Date()
//   const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
//   const day = today.getDate()
//   const month = today.getMonth()
//   const year = today.getFullYear()
//   const formattedDate = `${months[month]} ${day}, ${year}`
//   return formattedDate
// }

function create(req, res) {
  req.body.author = req.user.profile._id
  req.body.public = !!req.body.public
  for (let key in req.body) {
    if (req.body[key] === '') delete req.body[key]
  }
  Post.create(req.body)
  .then(post => {
    // post.date = formatDate(post.date)
    res.redirect('/posts')
  })
  .catch(err => {
    console.log(err)
    console.log('❌❌❌')
    res.redirect('/posts/new')
  })
}

function index(req, res) {
  Post.find({author: req.user.profile._id})
  .populate('author')
  .then(posts => {
    const isSelf = posts.some(post => post.author._id.equals(req.user.profile._id))
    res.render('posts/index', {
      posts,
      title: 'Whimsy Journal',
      isSelf
    })
  })
  .catch(err => {
    console.log('❌❌❌')
    console.log(err)
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
  req.body.public = !!req.body.public
  Post.findByIdAndUpdate(req.params.postId, req.body, {new: true})
  .then(post => {
    if(post.author.equals(req.user.profile._id)) {
      post.updateOne(req.body)
      .then(() => {
        res.redirect(`/posts`)
      })
    }  else {
      throw new Error('🚫 Not authorized 🚫')
    }
  })
  .catch(err => {
    console.log('❌')
    console.log(err)
    res.redirect('/')
  })
}

function show(req, res) {
  Post.findById(req.params.postId)
  .populate('author')
  .populate('comments')
  .then(post => {
    const isSelf = post.author._id.equals(req.user.profile._id);
    const comments = post.comments
    const userProfileId = req.user.profile._id
    res.render('posts/show', {
    title: `${post.title}`,
    post,
    isSelf,
    comments,
    userProfileId
    })
  })
  .catch(err => {
    console.log('❌')
    console.log(err)
    res.redirect('/')
  })
}

function createComment(req, res) {
  console.log(req.body)
  Post.findById(req.params.postId)
  .then(post => {
    // const isAuthor = post.comments.commentAuthor.euqals(req.user.profile._id)
    req.body.commentAuthor = req.user.profile._id
    post.comments.push(req.body)
    post.save()
    .then(() => {
      res.redirect(`/posts/${post._id}`)
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

function deleteComment(req, res) {
  Post.findById(req.params.postId)
  .populate('author')
  .populate('comments')
  .then(post => {
    const commentToDelete = post.comments.id(req.params.commentId)
    if (
      req.user.profile._id.equals(commentToDelete.commentAuthor) || 
      req.user.profile._id.equals(post.author._id)) {
        commentToDelete.deleteOne()
        post.save()
        .then(() => {
          res.redirect(`/posts/${post._id}`)
        })
      } else {
        throw new Error('🚫 Not authorized 🚫')
      }
    })
  .catch(err => {
    console.log('❌❌')
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
  createComment,
  deleteComment,
}

