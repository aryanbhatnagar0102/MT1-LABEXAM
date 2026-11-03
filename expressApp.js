
import express from 'express';

const app = express();

app.use(express.json());

const tasks = [
    {
        id: 1,
        taskName: 'Develop Login Page',
        assignedTo: 'Rahul Sharma',
        status: 'Pending',
        priority: 'High'
    },
    {
        id: 2,
        taskName: 'Design Dashboard',
        assignedTo: 'Amit Kumar',
        status: 'In Progress',
        priority: 'Medium'
    },
    {
        id: 3,
        taskName: 'Test REST API',
        assignedTo: 'Priya Singh',
        status: 'Completed',
        priority: 'Low'
    }
];

// GET: Retrieve all tasks
app.get('/tasks', (req, res) => {
    res.status(200).json(tasks);
});

// GET: Retrieve a task by ID
app.get('/tasks/:id', (req, res) => {
    const id = Number(req.params.id);
    const task = tasks.find(task => task.id === id);

    if (!task) {
        return res.status(404).json({
            message: 'Task not found'
        });
    }

    res.status(200).json(task);
});

// POST: Add a new task
app.post('/tasks', (req, res) => {
    const { id, taskName, assignedTo, status, priority } = req.body;

    if (
        !Number.isInteger(id) ||
        id <= 0 ||
        typeof taskName !== 'string' ||
        !taskName.trim() ||
        typeof assignedTo !== 'string' ||
        !assignedTo.trim() ||
        typeof status !== 'string' ||
        !status.trim() ||
        typeof priority !== 'string' ||
        !priority.trim()
    ) {
        return res.status(400).json({
            message: 'All fields are required: id, taskName, assignedTo, status, priority'
        });
    }

    if (tasks.some(task => task.id === id)) {
        return res.status(400).json({
            message: 'Task ID already exists'
        });
    }

    const newTask = {
        id,
        taskName: taskName.trim(),
        assignedTo: assignedTo.trim(),
        status: status.trim(),
        priority: priority.trim()
    };

    tasks.push(newTask);

    res.status(201).json({
        message: 'Task added successfully',
        task: newTask
    });
});

// PUT: Update a task by ID
app.put('/tasks/:id', (req, res) => {
    const id = Number(req.params.id);
    const task = tasks.find(task => task.id === id);

    if (!task) {
        return res.status(404).json({
            message: 'Task not found'
        });
    }

    const { taskName, assignedTo, status, priority } = req.body;

    if (
        typeof taskName !== 'string' ||
        !taskName.trim() ||
        typeof assignedTo !== 'string' ||
        !assignedTo.trim() ||
        typeof status !== 'string' ||
        !status.trim() ||
        typeof priority !== 'string' ||
        !priority.trim()
    ) {
        return res.status(400).json({
            message: 'Provide valid taskName, assignedTo, status and priority'
        });
    }

    task.taskName = taskName.trim();
    task.assignedTo = assignedTo.trim();
    task.status = status.trim();
    task.priority = priority.trim();

    res.status(200).json({
        message: 'Task updated successfully',
        task
    });
});

// DELETE: Delete a task by ID
app.delete('/tasks/:id', (req, res) => {
    const id = Number(req.params.id);
    const index = tasks.findIndex(task => task.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: 'Task not found'
        });
    }

    const deletedTask = tasks.splice(index, 1)[0];

    res.status(200).json({
        message: 'Task deleted successfully',
        task: deletedTask
    });
});

// Handle invalid JSON
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({
            message: 'Invalid JSON format'
        });
    }

    next(err);
});

// Handle invalid routes
app.use((req, res) => {
    res.status(404).json({
        message: 'Route not found'
    });
});

app.listen(4000, () => {
    console.log('Express Server running at http://localhost:4000');
});
