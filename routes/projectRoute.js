const express = require('express');
const router = express.Router();
const { Project } = require('../model/Project'); // Import your MongoDB models
const {ProjectUser}=require("../model/association")

// Create a new project (POST /project)
router.post('/project', async (req, res) => {
  try {
    const { name, description, start_date, end_date, project_manager_id, role } = req.body;

    const project = new Project({
      name,
      description,
      start_date,
      end_date,
      project_manager_id,
      role,
    });

    await project.save();

    res.status(201).json({ message: 'Project created successfully' });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ message: 'Failed to create project' });
  }
});

// Get all projects (GET /project)
router.get('/project', async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Failed to retrieve projects' });
  }
});

// Get projects by project_manager_id (GET /project/:user_id)
router.get('/project/:user_id', async (req, res) => {
  try {
    const userId = req.params.user_id;
    const projects = await Project.find({ project_manager_id: userId });
    res.status(200).json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Failed to retrieve projects' });
  }
});

// Update a project (PATCH /project/:id)
router.patch('/project/:id', async (req, res) => {
  try {
    const projectId = req.params.id;
    const updatedProjectData = req.body;

    await Project.findByIdAndUpdate(projectId, updatedProjectData);

    res.status(200).json({ message: 'Project updated successfully' });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ message: 'Failed to update project' });
  }
});

// Delete a project (DELETE /project/:id)
router.delete('/project/:id', async (req, res) => {
  try {
    const projectId = req.params.id;

    // Delete associated records in ProjectUser
    await ProjectUser.deleteMany({ project_id: projectId });

    // Then delete the project itself
    const deletedProject = await Project.findByIdAndDelete(projectId);

    if (deletedProject) {
      res.status(200).json({ message: 'Project and associated project_users deleted successfully' });
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ message: 'Failed to delete project' });
  }
});

// Create a new project user association (POST /project_users)
router.post('/project_users', async (req, res) => {
  try {
    const { project_id, user_id } = req.body;

    const projectUser = new ProjectUser({
      project_id,
      user_id,
    });

    await projectUser.save();

    res.status(201).json({ message: 'User associated with the project successfully' });
  } catch (error) {
    console.error('Error associating user with the project:', error);
    res.status(500).json({ message: 'Failed to associate user with the project' });
  }
});

// Get all project-user associations (GET /project_users)
router.get('/project_users', async (req, res) => {
  try {
    const projectUsers = await ProjectUser.find();
    res.status(200).json(projectUsers);
  } catch (error) {
    console.error('Error fetching project users:', error);
    res.status(500).json({ message: 'Failed to retrieve project users' });
  }
});

// Get project-user associations by user_id (GET /project_users/:user_id)
router.get('/project_users/:user_id', async (req, res) => {
  try {
    const userId = req.params.user_id;
    const projectUsers = await ProjectUser.find({ user_id: userId });
    res.status(200).json(projectUsers);
  } catch (error) {
    console.error('Error fetching project users:', error);
    res.status(500).json({ message: 'Failed to retrieve project users' });
  }
});

// Update a project-user association (PATCH /project_users/:project_id)
router.patch('/project_users/:project_id', async (req, res) => {
  try {
    const projectId = req.params.project_id;
    const { user_id } = req.body;

    await ProjectUser.findOneAndUpdate({ project_id: projectId }, { user_id });

    res.status(200).json({ message: 'Project users updated successfully' });
  } catch (error) {
    console.error('Error updating project users:', error);
    res.status(500).json({ message: 'Failed to update project users' });
  }
});

module.exports = router;
