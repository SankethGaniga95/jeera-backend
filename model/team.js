const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  team_name: String,
  created_at: Date,
});

const Team=mongoose.model('Team', teamSchema);

module.exports = {Team}
