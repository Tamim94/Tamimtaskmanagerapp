class TasksService {
    constructor({ Task, User }) {
        this.Task = Task;
        this.User = User; // Inject the User model
    }

    async createTask(taskData) {
        const { userId } = taskData;
        const _user = await this.User.findById(userId);
        if (!_user) {
            return {
                error: 'User not found',
            };
        }

        const _task = await this.Task.create(taskData);
        _user.tasks.push(_task);
        await _user.save();

        return {
            message: 'Task created',
            task: _task,
        };
    }

    async updateTask(taskId, taskData) {
        const { userId } = taskData;
        const _user = await this.User.findById(userId);

        if (!_user) {
            return {
                error: 'User not found',
            };
        }

        const _task = await this.Task.findByIdAndUpdate(taskId, taskData, { new: true });

        if (_task) {
            return {
                message: 'Task updated successfully',
                task: _task,
            };
        }

        return {
            error: 'Task not found',
        };
    }
}

module.exports = TasksService;
