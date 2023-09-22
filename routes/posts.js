import { Router } from 'express'
import * as postsCtrl from '../controllers/posts.js'
import { isLoggedIn } from '../middleware/middleware.js'

const router = Router()

router.get('/new', postsCtrl.new)
router.get('/', postsCtrl.index)
router.get('/:postId', isLoggedIn, postsCtrl.show)
router.get('/:postId/edit', isLoggedIn, postsCtrl.edit)
router.post('/', isLoggedIn, postsCtrl.create)
router.delete('/:postId', isLoggedIn, postsCtrl.delete)
router.put('/:postId', postsCtrl.update)

export {
  router
}