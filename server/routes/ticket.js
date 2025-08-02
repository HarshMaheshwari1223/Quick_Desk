import express from 'express'
import Ticket from '../models/Ticket.js'
import jwt from 'jsonwebtoken'

const router = express.Router()

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'Unauthorized' })
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET)
    next()
  } catch {
    res.status(403).json({ error: 'Invalid token' })
  }
}

router.post('/', auth, async (req, res) => {
  const ticket = new Ticket({ ...req.body, createdBy: req.user.id })
  await ticket.save()
  res.json(ticket)
})

router.get('/', auth, async (req, res) => {
  const filter = req.user.role === 'enduser' ? { createdBy: req.user.id } : {}
  const tickets = await Ticket.find(filter).populate('createdBy assignedTo')
  res.json(tickets)
})

router.patch('/:id', auth, async (req, res) => {
  const ticket = await Ticket.findByIdAndUpdate(req.params.id, req.body, { new: true })
  res.json(ticket)
})

router.post('/:id/comment', auth, async (req, res) => {
  const ticket = await Ticket.findById(req.params.id)
  ticket.comments.push({ message: req.body.message, author: req.user.id })
  await ticket.save()
  res.json(ticket)
})

export default router
