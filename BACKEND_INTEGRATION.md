# Backend API Integration Guide

Complete guide for setting up and using the REST API backend with the React Todo application.

## 📋 Table of Contents

1. [Setup](#setup)
2. [Running the Application](#running-the-application)
3. [API Endpoints](#api-endpoints)
4. [Frontend Integration](#frontend-integration)
5. [Troubleshooting](#troubleshooting)
6. [Production Deployment](#production-deployment)

## Setup

### Prerequisites

- Node.js 14+ installed
- npm or yarn package manager

### 1. Clone Repository

```bash
git clone https://github.com/ankit7610/ToDoList_ts.git
cd ToDoList_ts
git checkout backend-api
```

### 2. Install All Dependencies

```bash
# Install both frontend and backend dependencies
npm run setup
```

Or manually:

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 3. Configure Environment

#### Frontend (.env.local)

Create `.env.local` in the root directory:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```
REACT_APP_API_URL=http://localhost:5000/api
```

#### Backend (.env)

Create `.env` in the server directory:

```bash
cd server
cp .env.example .env
```

Edit `server/.env`:
```
PORT=5000
NODE_ENV=development
```

## Running the Application

### Option 1: Run Both Frontend and Backend Together

```bash
npm run dev
```

This starts both the React app and API server simultaneously using concurrently.

- Frontend: http://localhost:3000
- Backend: http://localhost:5000

### Option 2: Run Separately

**Terminal 1 - Frontend:**
```bash
npm start
```

**Terminal 2 - Backend:**
```bash
npm run server
```

### Option 3: Production Mode

**Frontend Build:**
```bash
npm run build
```

**Backend (Production):**
```bash
cd server
npm start
```

## API Endpoints

### Base URL
```
http://localhost:5000/api
```

### Complete List

| HTTP | Endpoint | Description |
|------|----------|-------------|
| GET | `/todos` | Get all todos |
| GET | `/todos/:id` | Get single todo |
| POST | `/todos` | Create new todo |
| PUT | `/todos/:id` | Update todo |
| DELETE | `/todos/:id` | Delete todo |
| DELETE | `/todos` | Delete all completed |
| GET | `/health` | Health check |

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for detailed API docs.

## Frontend Integration

### Using the API Hook

The `useApiTodos` hook provides all API methods:

```typescript
import { useApiTodos } from 'src/hooks';

function TodoApp() {
  const {
    isLoading,
    error,
    fetchTodos,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    clearCompleted
  } = useApiTodos();

  // Load todos on mount
  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  // Create todo
  const handleAdd = async (title: string) => {
    try {
      const newTodo = await createTodo(title);
      console.log('Created:', newTodo);
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  };

  // Toggle completion
  const handleToggle = async (id: string, completed: boolean) => {
    try {
      const updated = await toggleTodo(id, completed);
      console.log('Updated:', updated);
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  // Delete todo
  const handleDelete = async (id: string) => {
    try {
      await deleteTodo(id);
      console.log('Deleted');
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  return (
    <div>
      {error && <div className="error">{error}</div>}
      {isLoading && <div>Loading...</div>}
      {/* Your todo list UI */}
    </div>
  );
}
```

### Complete Example App

```typescript
import { useState, useEffect } from 'react';
import { useApiTodos } from 'src/hooks';

function CompleteApp() {
  const {
    isLoading,
    error,
    fetchTodos,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    clearCompleted
  } = useApiTodos();

  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');

  // Load todos on mount
  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      const data = await fetchTodos();
      setTodos(data);
    } catch (error) {
      console.error('Failed to load todos');
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    try {
      const newTodo = await createTodo(input);
      setTodos([...todos, newTodo]);
      setInput('');
    } catch (error) {
      console.error('Failed to create todo');
    }
  };

  const handleToggle = async (id: string) => {
    try {
      const todo = todos.find(t => t.id === id);
      if (todo) {
        const updated = await toggleTodo(id, todo.completed);
        setTodos(todos.map(t => t.id === id ? updated : t));
      }
    } catch (error) {
      console.error('Failed to toggle todo');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTodo(id);
      setTodos(todos.filter(t => t.id !== id));
    } catch (error) {
      console.error('Failed to delete todo');
    }
  };

  return (
    <div>
      <h1>My Todos</h1>

      {error && <div className="error">{error}</div>}
      {isLoading && <div>Loading...</div>}

      <form onSubmit={handleAdd}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Add a new todo..."
        />
        <button type="submit">Add</button>
      </form>

      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleToggle(todo.id)}
            />
            <span style={{
              textDecoration: todo.completed ? 'line-through' : 'none'
            }}>
              {todo.title}
            </span>
            <button onClick={() => handleDelete(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CompleteApp;
```

## Switching Between Storage Methods

### Using API (Remote)
```typescript
const { fetchTodos, createTodo, updateTodo, deleteTodo } = useApiTodos();
```

### Using IndexedDB (Local)
```typescript
const { todos, addTodo, toggleTodo, deleteTodo } = useIndexedDB();
```

### Using Context
```typescript
const { todos, addTodo, toggleTodo, deleteTodo } = useTodoContext();
```

## Troubleshooting

### Backend Server Won't Start

**Problem:** `Error: listen EADDRINUSE: address already in use :::5000`

**Solution:** Port 5000 is already in use. Change the port:

```bash
# Edit server/.env
PORT=5001
```

Then restart the server.

### CORS Errors

**Problem:** `Access to XMLHttpRequest blocked by CORS policy`

**Solution:** Ensure the backend is running and CORS is enabled (it is by default).

If using a different URL, update `.env.local`:

```
REACT_APP_API_URL=http://your-backend-url
```

### API Requests Timeout

**Problem:** Requests take too long or timeout

**Solution:** 
1. Check if backend is running: `curl http://localhost:5000/api/health`
2. Verify network connectivity
3. Check browser console for detailed errors

### Data Not Persisting

**Problem:** Todos disappear after server restart

**Reason:** Server uses in-memory storage (no database)

**Solution:** Replace in-memory storage with a database. See [server/README.md](./server/README.md#database) for options.

## Testing the API

### Using cURL

```bash
# Check server is running
curl http://localhost:5000/api/health

# Get all todos
curl http://localhost:5000/api/todos

# Create a todo
curl -X POST http://localhost:5000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "Buy groceries"}'

# Update a todo (replace UUID)
curl -X PUT http://localhost:5000/api/todos/UUID \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'

# Delete a todo
curl -X DELETE http://localhost:5000/api/todos/UUID
```

### Using Postman

1. Download [Postman](https://www.postman.com/downloads/)
2. Import collection or create requests manually
3. Set base URL: `http://localhost:5000/api`
4. Test each endpoint

### Using VS Code REST Client

Install the [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) extension.

Create `requests.http`:

```http
### Get all todos
GET http://localhost:5000/api/todos

### Create todo
POST http://localhost:5000/api/todos
Content-Type: application/json

{
  "title": "Buy groceries"
}

### Update todo
PUT http://localhost:5000/api/todos/UUID
Content-Type: application/json

{
  "completed": true
}

### Delete todo
DELETE http://localhost:5000/api/todos/UUID
```

## Production Deployment

### Deploying to Heroku

```bash
# Install Heroku CLI
# Create Procfile
echo "web: cd server && npm start" > Procfile

# Deploy
heroku create your-app-name
git push heroku backend-api:main
```

### Deploying to Vercel

```bash
# Frontend on Vercel
vercel --prod

# Backend on Vercel (requires serverless setup)
# See server/README.md for details
```

### Deploying to AWS/DigitalOcean

See server/README.md for deployment instructions.

### Environment Variables in Production

Set these on your hosting platform:

**Backend:**
- `PORT=5000` (or platform default)
- `NODE_ENV=production`
- Database credentials (if using DB)

**Frontend:**
- `REACT_APP_API_URL=https://your-api-domain.com`

## Files Changed

New and modified files in this branch:

```
server/                          # New backend directory
├── src/
│   └── server.js               # API server with all endpoints
├── package.json                # Backend dependencies
├── .env.example               # Environment template
└── README.md                   # Backend documentation

src/hooks/
├── useApiTodos.ts             # New API integration hook
└── index.ts                   # Updated exports

.env.local.example             # Frontend env template
API_DOCUMENTATION.md           # Complete API docs
BACKEND_INTEGRATION.md         # This file
package.json                   # Updated with dev scripts
```

## Next Steps

1. ✅ Backend API created with all CRUD endpoints
2. ✅ Frontend hook (`useApiTodos`) for API integration
3. ✅ Documentation complete
4. 📦 Ready for production deployment

To use the API in your app:

```typescript
import { useApiTodos } from 'src/hooks';
// Use the hook methods in your components
```

## Support

- See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for detailed API reference
- See [server/README.md](./server/README.md) for backend documentation
- Check troubleshooting section above for common issues

---

**Branch:** `backend-api`  
**Status:** Complete and ready for use  
**Last Updated:** December 20, 2025
