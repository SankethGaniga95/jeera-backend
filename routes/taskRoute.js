const express = require('express');
const router = express.Router();
const { Task } = require('../model/Task'); // Import your MongoDB models
const { TaskAssignee }=require("../model/association")

// Create a new task (POST /task)
router.post('/task', async (req, res) => {
  try {
    const { title, description, due_date, priority, status,project_id, assignedTeamMembers, role } = req.body;

    const task = new Task({
      title,
      description,
      due_date,
      priority,
      status,
      project_id,
      assignedTeamMembers,
      role,
    });

    await task.save();

    res.status(201).json({ message: 'Task created successfully' });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Failed to create task' });
  }
});

// Get a specific task by ID (GET /tasks/:task_id)
router.get('/tasks/:task_id', async (req, res) => {
  try {
    const taskId = req.params.task_id;
    const task = await Task.findById(taskId);

    if (task) {
      res.status(200).json(task);
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ message: 'Failed to retrieve task' });
  }
});

// Get all tasks (GET /tasks)
router.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Failed to retrieve tasks' });
  }
});

// Update a task by ID (PATCH /tasks/:task_id)
router.patch('/tasks/:task_id', async (req, res) => {
  try {
    const taskId = req.params.task_id;
    const updatedTaskData = req.body;

    await Task.findByIdAndUpdate(taskId, updatedTaskData);

    res.status(200).json({ message: 'Task updated successfully' });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Failed to update task' });
  }
});

// Delete a task by ID (DELETE /tasks/:task_id)
router.delete('/tasks/:task_id', async (req, res) => {
  try {
    const taskId = req.params.task_id;
    
    // First, delete associated records in TaskAssignee
    await TaskAssignee.deleteMany({ task_id: taskId });

    // Then delete the task itself
    const deletedTask = await Task.findByIdAndDelete(taskId);

    if (deletedTask) {
      res.status(200).json({ message: 'Task and associated assignments deleted successfully' });
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Failed to delete task' });
  }
});

// Create a new task assignee (POST /task_assignees)
router.post('/task_assignees', async (req, res) => {
  try {
    const { task_id, user_id } = req.body;

    const taskAssignee = new TaskAssignee({
      task_id,
      user_id,
    });

    await taskAssignee.save();

    res.status(201).json({ message: 'Task associated with user successfully' });
  } catch (error) {
    console.error('Error associating task with user:', error);
    res.status(500).json({ message: 'Failed to associate task with user' });
  }
});

// Get task assignees for a specific task (GET /task_assignees/:task_id)
router.get('/task_assignees/:task_id', async (req, res) => {
  try {
    const taskId = req.params.task_id;
    const taskAssignees = await TaskAssignee.find({ task_id: taskId });
    res.status(200).json(taskAssignees);
  } catch (error) {
    console.error('Error fetching task assignees:', error);
    res.status(500).json({ message: 'Failed to fetch task assignees' });
  }
});

// Update task assignee for a specific task (PATCH /task_assignees/:task_id)
router.patch('/task_assignees/:task_id', async (req, res) => {
  try {
    const taskId = req.params.task_id;
    const { user_id } = req.body;

    await TaskAssignee.findOneAndUpdate({ task_id: taskId }, { user_id });

    res.status(200).json({ message: 'Task assignee updated successfully' });
  } catch (error) {
    console.error('Error updating task assignee:', error);
    res.status(500).json({ message: 'Failed to update task assignee' });
  }
});

module.exports = router;
