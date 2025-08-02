import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const router = express.Router()

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body
  const hashed = await bcrypt.hash(password, 10)
  const user = new User({ name, email, password: hashed })
  await user.save()
  res.json({ message: 'Registered successfully' })
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if (!user || !await bcrypt.compare(password, user.password)) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET)
  res.json({ token, role: user.role, userId: user._id })
})

export default router
