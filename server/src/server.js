import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory database (will persist during server runtime)
let todos = [
  {
    id: uuidv4(),
    title: 'Welcome to Todo API',
    completed: false,
    createdAt: new Date(),
  },
  {
    id: uuidv4(),
    title: 'Build REST API endpoints',
    completed: true,
    createdAt: new Date(Date.now() - 86400000),
  },
];

// ========================
// GET - Retrieve all todos
// ========================
app.get('/api/todos', (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: todos,
      count: todos.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// ===================================
// GET - Retrieve todo by ID
// ===================================
app.get('/api/todos/:id', (req, res) => {
  try {
    const { id } = req.params;
    const todo = todos.find((t) => t.id === id);

    if (!todo) {
      return res.status(404).json({
        success: false,
        error: 'Todo not found',
      });
    }

    res.status(200).json({
      success: true,
      data: todo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// ===================================
// POST - Create new todo
// ===================================
app.post('/api/todos', (req, res) => {
  try {
    const { title } = req.body;

    // Validation
    if (!title || typeof title !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Title is required and must be a string',
      });
    }

    if (title.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Title cannot be empty',
      });
    }

    if (title.length > 500) {
      return res.status(400).json({
        success: false,
        error: 'Title cannot exceed 500 characters',
      });
    }

    // Create new todo
    const newTodo = {
      id: uuidv4(),
      title: title.trim(),
      completed: false,
      createdAt: new Date(),
    };

    todos.push(newTodo);

    res.status(201).json({
      success: true,
      data: newTodo,
      message: 'Todo created successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// ===================================
// PUT - Update todo by ID
// ===================================
app.put('/api/todos/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { title, completed } = req.body;

    // Find todo
    const todoIndex = todos.findIndex((t) => t.id === id);
    if (todoIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Todo not found',
      });
    }

    const todo = todos[todoIndex];

    // Update title if provided
    if (title !== undefined) {
      if (typeof title !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'Title must be a string',
        });
      }

      if (title.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Title cannot be empty',
        });
      }

      if (title.length > 500) {
        return res.status(400).json({
          success: false,
          error: 'Title cannot exceed 500 characters',
        });
      }

      todo.title = title.trim();
    }

    // Update completed status if provided
    if (completed !== undefined) {
      if (typeof completed !== 'boolean') {
        return res.status(400).json({
          success: false,
          error: 'Completed must be a boolean',
        });
      }

      todo.completed = completed;

      // Add completedAt timestamp when marking as complete
      if (completed && !todo.completedAt) {
        todo.completedAt = new Date();
      } else if (!completed && todo.completedAt) {
        delete todo.completedAt;
      }
    }

    res.status(200).json({
      success: true,
      data: todo,
      message: 'Todo updated successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// ===================================
// DELETE - Remove todo by ID
// ===================================
app.delete('/api/todos/:id', (req, res) => {
  try {
    const { id } = req.params;

    // Find todo
    const todoIndex = todos.findIndex((t) => t.id === id);
    if (todoIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Todo not found',
      });
    }

    // Remove todo
    const deletedTodo = todos.splice(todoIndex, 1)[0];

    res.status(200).json({
      success: true,
      data: deletedTodo,
      message: 'Todo deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// ===================================
// DELETE - Remove all completed todos
// ===================================
app.delete('/api/todos', (req, res) => {
  try {
    const initialCount = todos.length;
    todos = todos.filter((t) => !t.completed);
    const deletedCount = initialCount - todos.length;

    res.status(200).json({
      success: true,
      deletedCount,
      message: `${deletedCount} completed todos deleted`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// ===================================
// GET - Health check
// ===================================
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    timestamp: new Date(),
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║      Todo API Server Running 🚀        ║
╚════════════════════════════════════════╝

🌐 Server: http://localhost:${PORT}
📝 API Docs: http://localhost:${PORT}/api/docs

Endpoints:
  GET    /api/todos           - Get all todos
  GET    /api/todos/:id       - Get todo by ID
  POST   /api/todos           - Create todo
  PUT    /api/todos/:id       - Update todo
  DELETE /api/todos/:id       - Delete todo
  DELETE /api/todos           - Delete all completed
  GET    /api/health          - Health check
  `);
});
