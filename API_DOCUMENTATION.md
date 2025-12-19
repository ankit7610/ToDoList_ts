# Todo API Documentation

Complete REST API documentation for the Todo Application backend.

## Setup

### Install Dependencies
```bash
cd server
npm install
```

### Start Server

**Development (with auto-reload):**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

Server will run on `http://localhost:5000`

## API Endpoints

### 1. Get All Todos

**Endpoint:** `GET /api/todos`

**Description:** Retrieve all todos

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Buy groceries",
      "completed": false,
      "createdAt": "2025-12-20T10:00:00.000Z"
    }
  ],
  "count": 1
}
```

**Status Codes:**
- `200` - Success

---

### 2. Get Single Todo

**Endpoint:** `GET /api/todos/:id`

**Description:** Retrieve a specific todo by ID

**Parameters:**
- `id` (string) - Todo ID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Buy groceries",
    "completed": false,
    "createdAt": "2025-12-20T10:00:00.000Z"
  }
}
```

**Status Codes:**
- `200` - Success
- `404` - Todo not found

---

### 3. Create Todo

**Endpoint:** `POST /api/todos`

**Description:** Create a new todo

**Request Body:**
```json
{
  "title": "Buy groceries"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Buy groceries",
    "completed": false,
    "createdAt": "2025-12-20T10:00:00.000Z"
  },
  "message": "Todo created successfully"
}
```

**Validation:**
- Title is required
- Must be a string
- Cannot be empty
- Max 500 characters

**Status Codes:**
- `201` - Created
- `400` - Bad request

---

### 4. Update Todo

**Endpoint:** `PUT /api/todos/:id`

**Description:** Update a todo (title and/or completion status)

**Parameters:**
- `id` (string) - Todo ID

**Request Body:**
```json
{
  "title": "Buy groceries and cook",
  "completed": true
}
```

You can update one or both fields. Omit fields you don't want to change.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Buy groceries and cook",
    "completed": true,
    "createdAt": "2025-12-20T10:00:00.000Z",
    "completedAt": "2025-12-20T11:30:00.000Z"
  },
  "message": "Todo updated successfully"
}
```

**Validation:**
- If updating title: must be string, non-empty, max 500 chars
- If updating completed: must be boolean

**Status Codes:**
- `200` - Success
- `400` - Bad request
- `404` - Todo not found

---

### 5. Delete Todo

**Endpoint:** `DELETE /api/todos/:id`

**Description:** Delete a specific todo

**Parameters:**
- `id` (string) - Todo ID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Buy groceries",
    "completed": false,
    "createdAt": "2025-12-20T10:00:00.000Z"
  },
  "message": "Todo deleted successfully"
}
```

**Status Codes:**
- `200` - Success
- `404` - Todo not found

---

### 6. Delete All Completed Todos

**Endpoint:** `DELETE /api/todos`

**Description:** Delete all completed todos (bulk delete)

**Response:**
```json
{
  "success": true,
  "deletedCount": 5,
  "message": "5 completed todos deleted"
}
```

**Status Codes:**
- `200` - Success

---

### 7. Health Check

**Endpoint:** `GET /api/health`

**Description:** Check API server status

**Response:**
```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2025-12-20T10:00:00.000Z"
}
```

**Status Codes:**
- `200` - Server is healthy

---

## Error Handling

All errors follow this format:

```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

**Common Error Messages:**
- `"Title is required and must be a string"`
- `"Title cannot be empty"`
- `"Title cannot exceed 500 characters"`
- `"Todo not found"`
- `"Internal server error"`

---

## cURL Examples

### Get All Todos
```bash
curl http://localhost:5000/api/todos
```

### Get Single Todo
```bash
curl http://localhost:5000/api/todos/uuid-here
```

### Create Todo
```bash
curl -X POST http://localhost:5000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "Buy groceries"}'
```

### Update Todo
```bash
curl -X PUT http://localhost:5000/api/todos/uuid-here \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'
```

### Delete Todo
```bash
curl -X DELETE http://localhost:5000/api/todos/uuid-here
```

### Delete All Completed
```bash
curl -X DELETE http://localhost:5000/api/todos
```

---

## Frontend Integration

Use the `useApiTodos` hook to integrate with the API:

```typescript
import { useApiTodos } from 'src/hooks/useApiTodos';

function App() {
  const { 
    isLoading, 
    error, 
    fetchTodos, 
    createTodo, 
    updateTodo, 
    deleteTodo, 
    toggleTodo 
  } = useApiTodos();

  // Load todos on mount
  useEffect(() => {
    fetchTodos();
  }, []);

  // Create
  const handleAdd = async (title: string) => {
    try {
      const newTodo = await createTodo(title);
      console.log('Created:', newTodo);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Update
  const handleToggle = async (id: string, completed: boolean) => {
    try {
      const updated = await updateTodo(id, { completed: !completed });
      console.log('Updated:', updated);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Delete
  const handleDelete = async (id: string) => {
    try {
      await deleteTodo(id);
      console.log('Deleted');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      {error && <div className="error">{error}</div>}
      {isLoading && <div>Loading...</div>}
      {/* Todo list UI */}
    </div>
  );
}
```

---

## Environment Variables

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

### Server (.env)
```
PORT=5000
NODE_ENV=development
```

---

## Features

✅ Full CRUD operations (Create, Read, Update, Delete)
✅ Input validation
✅ Error handling
✅ CORS enabled for frontend
✅ UUID-based todo IDs
✅ Timestamp tracking (createdAt, completedAt)
✅ Health check endpoint
✅ Bulk delete operation

---

## Database

Currently uses in-memory storage. To persist data, consider:
- MongoDB
- PostgreSQL
- SQLite
- Firebase Firestore

---

## CORS Configuration

The API allows requests from any origin. To restrict, modify `server/src/server.js`:

```javascript
app.use(cors({
  origin: 'http://localhost:3000' // Frontend URL only
}));
```

---

## Rate Limiting (Optional)

To add rate limiting, install `express-rate-limit`:

```bash
npm install express-rate-limit
```

Then add to server:

```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // 100 requests per window
});

app.use('/api/', limiter);
```
