const mongoose = require('mongoose')
const { Schema, model } = mongoose

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: '',
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    }
  },
  {
    timestamps: true
  },
)

const Task = model('Task', taskSchema)

module.exports = Task