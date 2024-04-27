const express = require('express');
const tasksController = require('./controller');
 
const router = express.Router();

router.post('/tasks', tasksController.createTask);
router.put('/tasks/:_id', tasksController.updateTask);
router.delete('/tasks/:_id', tasksController.deleteTask);
router.get('/tasks', tasksController.listAllTask);
 
module.exports = router;