
import http from 'http';
import fs from 'fs';
import path from 'path';

const tasks = [];

const server = http.createServer((req, res) => {
    const { method, url } = req;

    if (method === 'GET' && url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<h1>Welcome to Employee Task Management</h1>');
    }

    else if (method === 'GET' && url === '/tasks') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(tasks));
    }

    else if (method === 'GET' && url === '/about') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Employee Task Management Application');
    }

    else if (method === 'GET' && url === '/home') {
        const filePath = path.join(process.cwd(), 'public', 'index.html');

        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, {
                    'Content-Type': 'text/plain'
                });
                res.end('Error reading HTML file');
                return;
            }

            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
    }

    else if (method === 'POST' && url === '/add-task') {
        let body = '';

        req.on('data', chunk => {
            body += chunk;
        });

        req.on('end', () => {
            try {
                const task = JSON.parse(body);

                if (typeof task !== 'object' || task === null || Array.isArray(task)) {
                    res.writeHead(400, {
                        'Content-Type': 'application/json'
                    });
                    res.end(JSON.stringify({
                        message: 'Task must be a JSON object'
                    }));
                    return;
                }

                const { id, taskName, assignedTo, status } = task;

                if (
                    id === undefined ||
                    id === null ||
                    !String(taskName ?? '').trim() ||
                    !String(assignedTo ?? '').trim() ||
                    !String(status ?? '').trim()
                ) {
                    res.writeHead(400, {
                        'Content-Type': 'application/json'
                    });
                    res.end(JSON.stringify({
                        message: 'All fields are required: id, taskName, assignedTo, status'
                    }));
                    return;
                }

                if (tasks.some(existingTask => existingTask.id === id)) {
                    res.writeHead(400, {
                        'Content-Type': 'application/json'
                    });
                    res.end(JSON.stringify({
                        message: 'Task ID already exists'
                    }));
                    return;
                }

                tasks.push({ id, taskName, assignedTo, status });

                res.writeHead(201, {
                    'Content-Type': 'application/json'
                });
                res.end(JSON.stringify({
                    message: 'Task added successfully',
                    task
                }));
            } catch {
                res.writeHead(400, {
                    'Content-Type': 'application/json'
                });
                res.end(JSON.stringify({
                    message: 'Invalid JSON format'
                }));
            }
        });
    }

    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 - Route Not Found');
    }
});

server.listen(3000, () => {
    console.log('HTTP Server running at http://localhost:3000');
});
