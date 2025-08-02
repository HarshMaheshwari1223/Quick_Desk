import mongoose from 'mongoose'

const commentSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  message: String,
  createdAt: { type: Date, default: Date.now }
})

const ticketSchema = new mongoose.Schema({
  subject: String,
  description: String,
  category: String,
  status: { type: String, enum: ['open', 'in-progress', 'resolved', 'closed'], default: 'open' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  attachment: String,
  comments: [commentSchema],
  upvotes: [{ type: mongoose.Schema.Types.ObjectId }],
  downvotes: [{ type: mongoose.Schema.Types.ObjectId }]
}, { timestamps: true })

export default mongoose.model('Ticket', ticketSchema)
