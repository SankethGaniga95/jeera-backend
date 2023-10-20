const mongoose = require('mongoose');


const projectSchema = new mongoose.Schema({
    name: String,
    description: String,
    start_date: Date,
    end_date: Date,
    project_manager_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  });


const Project = mongoose.model('Project', projectSchema);





module.exports = {Project };