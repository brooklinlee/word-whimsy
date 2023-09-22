import { Router } from 'express'
import * as postsCtrl from '../controllers/posts.js'
import { isLoggedIn } from '../middleware/middleware.js'

const router = Router()

router.get('/new', postsCtrl.new)
router.get('/', postsCtrl.index)
router.get('/:postId/edit', isLoggedIn, postsCtrl.edit)
router.post('/', isLoggedIn, postsCtrl.create)
router.delete('/:postId', isLoggedIn, postsCtrl.delete)

export {
  router
}