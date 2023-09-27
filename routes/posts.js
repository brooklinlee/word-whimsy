import { Router } from 'express'
import * as postsCtrl from '../controllers/posts.js'
import { isLoggedIn } from '../middleware/middleware.js'

const router = Router()

router.get('/new', isLoggedIn, postsCtrl.new)
router.get('/', isLoggedIn, postsCtrl.index)
router.get('/:postId', isLoggedIn, postsCtrl.show)
router.get('/:postId/edit', isLoggedIn, postsCtrl.edit)
// router.put('/:postId/comments/:commentId', postsCtrl.editComment)
router.post('/', isLoggedIn, postsCtrl.create)
router.post('/:postId/comments', postsCtrl.createComment)
router.delete('/:postId', isLoggedIn, postsCtrl.delete)
router.delete('/:postId/comments/:commentId', postsCtrl.deleteComment)
router.put('/:postId', isLoggedIn, postsCtrl.update)

export {
  router
}