import { Profile } from "../models/profile.js"
import { Post } from "../models/post.js"

function newPost(req, res) {
  res.render('posts/new', {
    title: 'New Whimsy Entry',
    getRandomJournalPrompt: () => {
      const prompts = ['Write about a recent accomplishment that made you proud.',
      'Describe a place from your childhood that holds special memories.',
      'List three things you\'re grateful for today.',
      'Write a letter to your future self, five years from now.',
      'Reflect on a challenge you\'ve overcome and what you learned from it.',
      'Write about your favorite way to relax and unwind.',
      'Describe a goal you\'re working towards and why it\'s important to you.',
      'List five books or movies that have had a significant impact on you and explain why.',
      'Write about a person who has influenced your life in a positive way.',
      'Describe a recent act of kindness you witnessed or experienced.',
      'Write about a skill or hobby you\'d like to learn in the future.',
      'Reflect on a mistake you\'ve made and the lessons it taught you.',
      'Describe your ideal day from start to finish.',
      'List three things you can do to take better care of yourself.',
      'Write about a place you\'d love to visit someday and what you hope to experience there.' ]
      return prompts[Math.floor(Math.random() * prompts.length)]
    }
  })
}

function create(req, res) {
  req.body.author = req.user.profile._id
  req.body.public = !!req.body.public
  for (let key in req.body) {
    if (req.body[key] === '') delete req.body[key]
  }
  const newPost = new Post(req.body)
  newPost.save()
    .then(post => {
      Profile.findByIdAndUpdate(
        req.user.profile._id,
        { $push: { posts: post._id } },
        { new: true }
      )
        .then(updatedProfile => {
          res.redirect('/posts')
        })
        .catch(err => {
          console.log(err)
          res.redirect('/posts/new')
        })
    })
    .catch(err => {
      console.log(err)
      console.log('❌')
      res.redirect('/posts/new')
    })
}

// function create(req, res) {
//   req.body.author = req.user.profile._id
//   req.body.public = !!req.body.public
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
//     res.redirect('/posts/new')
//   })
// }

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
  for (let key in req.body) {
    if (req.body[key] === '') delete req.body[key]
  }
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
  .populate({
    path: 'comments',
    populate: {
    path: 'commentAuthor'
    }
  })
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

