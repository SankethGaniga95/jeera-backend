const express = require("express");
const router = express.Router();
const { Team } = require("../model/team"); 
const {TeamMember} =require("../model/association")
const {User}=require("../model/users")
// Create a new team
router.post("/team", async (req, res) => {
  try {
    const { team_name } = req.body;
    console.log(team_name)
    const team = await Team.create({ team_name });
    res.status(201).json({ message: 'Team created successfully' });
  } catch (error) {
    console.error('Error creating team:', error);
    res.status(500).json({ message: 'Failed to create team' });
  }
});

// Get all teams
router.get('/team', async (req, res) => {
  try {
    const teams = await Team.find();
    res.status(200).json(teams);
  } catch (error) {
    console.error('Error fetching teams:', error);
    res.status(500).json({ message: 'Failed to fetch teams' });
  }
});

// Get team members
router.get('/team-members', async (req, res) => {
  try {
    const teamMembers = await User.find({ role: 'Team Member' });
    if (teamMembers.length === 0) {
      res.status(404).json({ message: 'No team members found' });
    } else {
      res.status(200).json({ teamMembers });
    }
  } catch (error) {
    console.error('Error retrieving team members:', error);
    res.status(500).json({ message: 'Failed to retrieve team members' });
  }
});

// Update team name
router.patch('/team/:team_id', async (req, res) => {
  try {
    const teamId = req.params.team_id;
    const { team_name } = req.body;
    await Team.updateOne({ _id: teamId }, { team_name });
    res.status(200).json({ message: 'Team name updated successfully' });
  } catch (error) {
    console.error('Error updating team name:', error);
    res.status(500).json({ message: 'Failed to update team name' });
  }
});

// Delete a team and its members
router.delete('/team/:team_id', async (req, res) => {
  try {
    const teamId = req.params.team_id;
    await TeamMember.deleteMany({ team_id: teamId });
    await Team.deleteOne({ _id: teamId });
    res.status(200).json({ message: 'Team and its members deleted successfully' });
  } catch (error) {
    console.error('Error deleting team and its members:', error);
    res.status(500).json({ message: 'Failed to delete team and its members' });
  }
});

// Assign a user to a team
router.post('/team_members', async (req, res) => {
  try {
    const { team_name, user_name } = req.body;

    // Query your MongoDB to find the corresponding team_id and user_id
    const team = await Team.findOne({ team_name: team_name });
    const user = await User.findOne({ name: user_name });

    if (!team || !user) {
      res.status(404).json({ message: 'Team or user not found' });
      return;
    }

    // Create a new TeamMember document and save it to MongoDB
    const teamMember = new TeamMember({
      team_id: team._id,
      user_id: user._id,
    });

    await teamMember.save();
    res.status(201).json({ message: 'User assigned to the team successfully' });
  } catch (error) {
    console.error('Error assigning user to the team:', error);
    res.status(500).json({ message: 'Failed to assign user to the team' });
  }
});


// Get team members by team_id
router.get('/team_members/:team_id', async (req, res) => {
  try {
    const team_id = req.params.team_id;
    const teamMembers = await TeamMember.find({ team_id });
    if (teamMembers.length === 0) {
      res.status(200).json({ team_members: [] });
    } else {
      const memberIds = teamMembers.map((member) => member.user_id);
      const users = await User.find({ _id: { $in: memberIds } });
      res.status(200).json(users);
    }
  } catch (error) {
    console.error('Error retrieving team members:', error);
    res.status(500).json({ message: 'Failed to retrieve team members' });
  }
});

router.get('/team_members', async (req, res) => {
  try {
    const teamMembers = await TeamMember.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'user_id',
          foreignField: '_id',
          as: 'user_data'
        }
      },
      {
        $unwind: '$user_data'
      }
    ]);
    
    res.status(200).json({ results: teamMembers });
  } catch (error) {
    console.error('Error retrieving team members with user names:', error);
    res.status(500).json({ message: 'Failed to retrieve team members with user names' });
  }
});

// Update team member
router.patch('/team_members/:team_id', async (req, res) => {
  try {
    const teamId = req.params.team_id;
    const { new_member_id, user_id } = req.body;
    await TeamMember.updateOne({ team_id, user_id }, { user_id: new_member_id });
    res.status(200).json({ message: 'Team member updated successfully' });
  } catch (error) {
    console.error('Error updating team member:', error);
    res.status(500).json({ message: 'Failed to update team member' });
  }
});

// Delete a team member
router.delete('/team_members/:team_id/:user_id', async (req, res) => {
  try {
    const teamId = req.params.team_id;
    const userId = req.params.user_id;
    await TeamMember.deleteOne({ team_id: teamId, user_id: userId });
    res.status(200).json({ message: 'Team member deleted successfully' });
  } catch (error) {
    console.error('Error deleting team member:', error);
    res.status(500).json({ message: 'Failed to delete team member' });
  }
});

module.exports = router;
