const UsersService = require('./service');
const { body, query, param, validationResult } = require('express-validator');
const models = require('./../../models');

const User = models.User;
const usersService = new UsersService({ User });

async function createUser(req, res) {
    const paramsValidation = [
        body('fullName').notEmpty().withMessage('Full name is required.'),
        body('job').notEmpty().withMessage('Job is required.'),
        body('role').notEmpty().withMessage('Role is required.'),
        body('email').notEmpty().withMessage('Email is required.'),
        body('password').notEmpty().withMessage('Password is required.'),
    ];

    Promise.all(paramsValidation.map(validation => validation.run(req)))
        .then(async () => {
            const validationErrors = validationResult(req);

            if (!validationErrors.isEmpty()) {
                return res.status(400).send({ errors: validationErrors.array() });
            }

            const response = await usersService.login(req.body);
            return res.send(response);
        })
        .catch((err) => {
            console.log('Something went wrong in createUser: ', err);
            return res.status(500).send({ message: 'Something went wrong' });
        });
}

function updateUser(req, res) {
    const paramsValidation = [param('_id').notEmpty().withMessage('User ID is required.')];

    Promise.all(paramsValidation.map(validation => validation.run(req)))
        .then(async () => {
            const validationErrors = validationResult(req);

            if (!validationErrors.isEmpty()) {
                return res.status(400).send({ errors: validationErrors.array() });
            }

            const response = await usersService.updateUser(req.params._id, req.body);
            return res.send(response);
        })
        .catch((err) => {
            return res.status(500).send({ message: 'Something went wrong' });
        });
}

function deleteUser(req, res) {
    const paramsValidation = [param('_id').notEmpty().withMessage('User ID is required')];

    Promise.all(paramsValidation.map(validation => validation.run(req)))
        .then(async () => {
            const validationErrors = validationResult(req);

            if (!validationErrors.isEmpty()) {
                return res.status(400).send({ errors: validationErrors.array() });
            }

            const response = await usersService.deleteUser(req.params._id);
            return res.send(response);
        })
        .catch((err) => {
            return res.status(500).send({ message: 'Something went wrong' });
        });
}

async function listAllUsers(req, res) {
    const paramsValidation = [
        query('page').optional().isInt().withMessage('Page must be an integer'),
        query('limit').optional().isInt().withMessage('Limit must be an integer'),
    ];

    Promise.all(paramsValidation.map(validation => validation.run(req)))
        .then(async () => {
            const validationErrors = validationResult(req);

            if (!validationErrors.isEmpty()) {
                return res.status(400).send({ errors: validationErrors.array() });
            }


            const response = await usersService.listAllUsers(req.query);
            return res.send(response);
        })
        .catch((err) => {
            return res.status(500).send({ message: 'List all user' });
        });
}
function login(req, res) {
    const paramsValidation = [
        body('email').notEmpty().withMessage('Email is required.'),
        body('password').notEmpty().withMessage('Password is required.'),
    ];

    Promise.all(paramsValidation.map(validation => validation.run(req)))
        .then(async () => {
            const validationErrors = validationResult(req);

            if (!validationErrors.isEmpty()) {
                return res.status(400).send({ errors: validationErrors.array() });
            }

            const response = await usersService.login(req.body);
            return res.send(response);
        })
        .catch((err) => {
            console.log('Something went wrong in logiNNN! ', err);
            return res.status(500).send({ message: 'Something went wrong' });
        });
}



module.exports = {
    createUser,
    updateUser,
    deleteUser,
    listAllUsers,
    login,
};