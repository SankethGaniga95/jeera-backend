const mongoose = require('mongoose');


const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  due_date: Date,
  priority: {
    type: String,
    enum: ['High', 'Medium', 'Low'],
  },
  status: {
    type: String,
    enum: ['To Do', 'In Progress', 'Done'],
  },
  project_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
  },
  assignedTeamMembers:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model for team members
  },
});


const Task = mongoose.model('Task', taskSchema);

module.exports = {Task };