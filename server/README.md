# Todo API Backend

Production-ready REST API backend for the Todo application built with Express.js and Node.js.

## Quick Start

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Configure Environment

Create a `.env` file:

```bash
cp .env.example .env
```

Edit `.env`:
```
PORT=5000
NODE_ENV=development
```

### 3. Start Server

**Development (with auto-reload):**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

Server will start on `http://localhost:5000`

## API Overview

### Base URL
```
http://localhost:5000/api
```

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/todos` | Get all todos |
| GET | `/todos/:id` | Get single todo |
| POST | `/todos` | Create new todo |
| PUT | `/todos/:id` | Update todo |
| DELETE | `/todos/:id` | Delete todo |
| DELETE | `/todos` | Delete all completed |
| GET | `/health` | Health check |

## Features

✅ **Full CRUD Operations**
- Create, Read, Update, Delete todos
- Bulk delete completed todos

✅ **Data Validation**
- Title validation (non-empty, 1-500 chars)
- Type checking
- Error responses

✅ **Structured Responses**
- Consistent JSON format
- Success/error indicators
- Metadata (timestamps, counts)

✅ **CORS Enabled**
- Accept requests from any origin
- Configurable for production

✅ **Error Handling**
- Proper HTTP status codes
- Descriptive error messages
- Input validation

✅ **Performance**
- Async/await support
- Efficient in-memory database
- Fast request processing

## Architecture

```
server/
├── src/
│   └── server.js          # Main server file
├── package.json           # Dependencies
├── .env.example          # Environment template
└── README.md             # This file
```

## Database

Currently uses **in-memory storage** (stored in server RAM).

**Data persists for** the duration of the server run.
**Data is lost** when server restarts.

### Upgrade to Persistent Storage

To add database persistence, install and integrate:

**MongoDB:**
```bash
npm install mongoose
```

**PostgreSQL:**
```bash
npm install pg
```

**SQLite:**
```bash
npm install sqlite3
```

## Environment Variables

```
PORT              // Server port (default: 5000)
NODE_ENV          // Environment (development/production)
CORS_ORIGIN       // Allowed origin (optional)
```

## Example Requests

### Create Todo
```bash
curl -X POST http://localhost:5000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "Buy groceries"}'
```

### Get All Todos
```bash
curl http://localhost:5000/api/todos
```

### Update Todo
```bash
curl -X PUT http://localhost:5000/api/todos/uuid \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'
```

### Delete Todo
```bash
curl -X DELETE http://localhost:5000/api/todos/uuid
```

## Testing

Test the API using:

1. **cURL** (command line)
2. **Postman** (GUI)
3. **VS Code Rest Client** extension
4. **Playwright tests** (from frontend)

See [API_DOCUMENTATION.md](../API_DOCUMENTATION.md) for detailed examples.

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { /* todo data */ },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message describing the issue"
}
```

## Deployment

### Heroku
```bash
heroku create your-app-name
git push heroku main
```

### Vercel
```bash
vercel --prod
```

### Docker
```bash
docker build -t todo-api .
docker run -p 5000:5000 todo-api
```

### PM2 (Production)
```bash
npm install -g pm2
pm2 start src/server.js --name "todo-api"
pm2 save
pm2 startup
```

## Monitoring

### Health Check
```bash
curl http://localhost:5000/api/health
```

### Logs
Server logs are printed to console:
- Startup message with ASCII art
- Request info (method, endpoint)
- Error messages

## Security Considerations

For production, add:

1. **Input Validation** (already included)
2. **Rate Limiting** - `express-rate-limit`
3. **CORS Restrictions** - limit origins
4. **HTTPS** - enforce SSL/TLS
5. **Authentication** - JWT/OAuth
6. **Database** - replace in-memory storage
7. **Environment Variables** - use .env for secrets
8. **Logging** - structured logs (Winston, Pino)

## Troubleshooting

### Port Already in Use
```bash
# Change port in .env
PORT=5001
```

### CORS Errors
Enable CORS in browser requests or configure origin in server.

### Data Loss on Restart
Server uses in-memory storage. Data is lost on restart. Implement database for persistence.

## Development Tips

1. **Use `npm run dev`** for development with auto-reload
2. **Check `/api/health`** to verify server is running
3. **Use Postman** to test endpoints easily
4. **Read logs** carefully for error messages
5. **Validate input** before sending requests

## API Integration (Frontend)

Use the `useApiTodos` hook in React:

```typescript
import { useApiTodos } from 'src/hooks';

function App() {
  const { fetchTodos, createTodo, updateTodo, deleteTodo } = useApiTodos();

  // Load on mount
  useEffect(() => {
    fetchTodos();
  }, []);

  // Use the methods
  const handleAdd = (title) => createTodo(title);
}
```

See [API_DOCUMENTATION.md](../API_DOCUMENTATION.md) for complete integration guide.

## Support

For issues or questions:
1. Check [API_DOCUMENTATION.md](../API_DOCUMENTATION.md)
2. Review error responses
3. Check server logs
4. Verify environment variables
5. Test with cURL first

## License

MIT
