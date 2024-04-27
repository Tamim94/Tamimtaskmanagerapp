const TasksService = require('./service');
const models = require('./../../models');
const { body, validationResult } = require('express-validator');

const Task = models.Task;
const User = models.User;
const tasksService = new TasksService({ Task, User });

function createTask(req, res) {
    const paramsValidation = [
        body('userId').notEmpty().withMessage('userId is required'),
        body('dueDate')
            .notEmpty().withMessage('dueDate is required')
            .isISO8601().withMessage('dueDate must be a valid ISO 8601 date'),
    ];

    Promise.all(paramsValidation.map((validation) => validation.run(req)))
        .then(async () => {
            const validationErr = validationResult(req);

            if (!validationErr.isEmpty()) {
                return res.status(400).send({
                    errors: validationErr.array(),
                });
            }

            const response = await tasksService.createTask(req.body);
            return res.status(201).send(response);

        })
        .catch((err) => {
            console.error(err);
            return res.status(500).send({
                message: 'Something went wrong',
            });
        });
}
function updateTask(req, res) {
    const { _id } = req.params;
    const { userId, ...taskData } = req.body;

    Promise.all([
        Task.findById(_id),
        User.findById(userId)
    ])
        .then(async ([task, user]) => {
            if (!task) {
                return res.status(404).send({ error: 'Task not found' });
            }

            if (!user) {
                return res.status(404).send({ error: 'User not found' });
            }

            // Check if the user owns the task (optional, depending on your business logic)
            if (!task.userId.equals(userId)) {
                return res.status(403).send({ error: 'You are not authorized to update this task' });
            }

            const updatedTask = await Task.findByIdAndUpdate(_id, taskData, { new: true });
            return res.status(200).send({ message: 'Task updated successfully', task: updatedTask });
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).send({ message: 'Something went wrong' });
        });
}

function deleteTask(req, res) {
    const { _id } = req.params;

    Task.findByIdAndDelete(_id)
        .then((task) => {
            if (!task) {
                return res.status(404).send({ error: 'Task not found' });
            }
            return res.status(200).send({ message: 'Task deleted successfully' });
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).send({ message: 'Something went wrong' });
        });
}
function listAllTask(req, res) {
    Task.find({})
        .then((tasks) => {
            return res.status(200).send({ tasks });
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).send({ message: 'Something went wrong' });
        });
}

module.exports = {
    createTask,
    updateTask,
    deleteTask,
    listAllTask,
};
