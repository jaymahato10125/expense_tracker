import express from 'express'
import { authRequired } from '../middleware/auth.js'
import User from '../models/User.js'

const router = express.Router()

router.get('/me', authRequired, async (req, res) => {
  const user = await User.findById(req.user.id).select('_id name email createdAt')
  res.json({ user })
})

export default router
