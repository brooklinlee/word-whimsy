import { Profile } from "../models/profile.js"
import { Post } from "../models/post.js"

function index(req, res) {
  Profile.find({})
  .then(profiles => {
    res.render('profiles/index', {
    profiles,
    title: 'All WW Writers',
    getRandomIcon: () => {
      const icons = ['✏️', '📃', '🍎', '📓', '📚', '🖋️']
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
    const isSelf = profile._id.equals(req.user.profile._id)
    res.render('profiles/show', {
      title: 'Profile'
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