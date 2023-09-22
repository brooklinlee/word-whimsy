import { Router } from 'express'
import * as postsCtrl from '../controllers/posts.js'
import { isLoggedIn } from '../middleware/middleware.js'

const router = Router()

router.get('/new', postsCtrl.new)
router.get('/', postsCtrl.index)
router.post('/', isLoggedIn, postsCtrl.create)


export {
  router
}