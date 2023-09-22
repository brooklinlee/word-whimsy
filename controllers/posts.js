import { Profile } from "../models/profile.js"

function newPost(req, res) {
  res.render('posts/new', {
    title: 'New Whimsy Entry'
  })

}


export {
  newPost as new,
}