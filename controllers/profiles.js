import { Profile } from "../models/profile.js"
import { Post } from "../models/post.js"

function index(req, res) {
  Profile.find({})
  .then(profiles => {
    res.render('profiles/index', {
    profiles,
    title: 'All Word Whimsy Authors'
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
}