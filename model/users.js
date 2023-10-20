const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  profile_picture: String,
  role: {
    type: String,
    enum: ['Admin', 'Project Manager', 'Team Member'],
  },
  password:String,
});


const User = mongoose.model('User', userSchema);


module.exports = { User};