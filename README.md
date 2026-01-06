# ✨ Advanced Todo App

A feature-rich, modern todo list application built with React and TypeScript, featuring a unique neumorphic design with neon accents.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

## 🎯 Features

### Core Features
- ✅ **Add, Edit, and Delete Todos** - Full CRUD operations
- 🔥 **Priority System** - High, Medium, Low with color-coded badges
- 🏷️ **Categories/Tags** - Organize tasks (Work, Personal, Shopping, etc.)
- 📝 **Notes** - Add detailed descriptions to tasks
- 📅 **Due Dates** - Set deadlines with overdue indicators
- ✔️ **Task Completion** - Mark tasks as complete with animated strikethrough
- 💾 **Persistent Storage** - IndexedDB for reliable data persistence

### Advanced Features
- 🔍 **Search & Filter** - Real-time search across titles and notes
- 📊 **Statistics Dashboard** - Track completion rate and task breakdown
- 🔔 **Browser Notifications** - Alerts for due and overdue tasks
- 🌓 **Dark/Light Mode** - System-aware theme switching
- 📱 **Responsive Design** - Works on all devices
- ⚡ **Keyboard Shortcuts** - Quick actions for power users
- 🎨 **Unique UI** - Neumorphic design with neon glow effects

### UI/UX Highlights
- **Neumorphism** - Soft 3D elements with depth
- **Neon Accents** - Vibrant cyan, purple, and pink highlights
- **Smooth Animations** - Micro-interactions throughout
- **Glassmorphism** - Translucent backgrounds with blur
- **Particle Effects** - Animated floating background particles

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ankit7610/ToDoList_ts.git
   cd ToDoList_ts
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd server && npm install && cd ..
   ```

3. **Set up environment** (optional)
   ```bash
   cp .env.local.example .env
   ```

### Running the App

**Development mode** (runs both frontend and backend):
```bash
npm run dev
```

**Frontend only**:
```bash
npm start
```

**Backend only**:
```bash
npm run server
```

The app will open at [http://localhost:3000](http://localhost:3000)  
Backend API runs at [http://localhost:5001](http://localhost:5001)

### Building for Production

```bash
npm run build
```

## 📁 Project Structure

```
ToDoList_ts/
├── src/
│   ├── components/
│   │   ├── TodoInput.tsx          # Enhanced input with advanced options
│   │   ├── TodoItem.tsx           # Todo item with priority/category/notes
│   │   ├── TodoList.tsx           # List container
│   │   ├── TodoFilters.tsx        # Search and filter controls
│   │   ├── TodoStats.tsx          # Statistics dashboard
│   │   ├── PriorityBadge.tsx      # Priority indicator
│   │   ├── CategoryBadge.tsx      # Category tag
│   │   └── ThemeSwitcher.tsx      # Dark/light mode toggle
│   ├── types/
│   │   ├── index.ts               # TypeScript interfaces
│   │   └── constants.ts           # Priority/category definitions
│   ├── utils/
│   │   ├── db.ts                  # IndexedDB operations
│   │   ├── filters.ts             # Search and filter logic
│   │   ├── notifications.ts       # Browser notifications
│   │   └── stats.ts               # Statistics calculations
│   ├── App.tsx                    # Main application
│   └── index.css                  # Global styles & design system
├── server/
│   └── src/
│       └── server.js              # REST API backend
└── public/
    └── index.html
```

## 🎨 Design System

### Color Palette
- **Neon Cyan**: `#00f0ff` - Primary interactive elements
- **Neon Purple**: `#b537f2` - Secondary accents
- **Neon Pink**: `#ff006e` - Danger/high priority
- **Neon Yellow**: `#ffd60a` - Medium priority

### Typography
- **Headings**: Outfit (Google Fonts)
- **Body**: Inter (Google Fonts)

### Effects
- **Neumorphic Shadows**: Dual-directional soft shadows
- **Neon Glow**: Box-shadow based glows on interactive elements
- **Glassmorphism**: Backdrop blur with transparency
- **Animations**: Smooth cubic-bezier transitions

## 🔧 Technologies Used

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **CSS3** - Advanced styling (neumorphism, glassmorphism)
- **IndexedDB** - Client-side database

### Backend
- **Node.js** - Runtime
- **Express** - REST API framework
- **CORS** - Cross-origin support

### Development
- **React Scripts** - Build tooling
- **Playwright** - E2E testing
- **ESLint** - Code linting

## 📖 Usage Guide

### Adding a Todo
1. Type your task in the input field
2. Click the **▶** button for advanced options:
   - Set priority (High/Medium/Low)
   - Choose category
   - Add due date
   - Write notes
3. Click **Add** to create

### Filtering Todos
Use the filters panel to:
- **Search** by title or notes
- Filter by **priority**
- Filter by **category**
- Filter by **due date** (Today, This Week, Overdue)
- Toggle **show completed**

### Statistics
View your productivity metrics:
- Total, completed, and pending tasks
- Overdue task count
- Completion rate with progress bar
- Breakdown by priority and category

### Notifications
1. Grant notification permission when prompted
2. Receive alerts for:
   - Tasks due today
   - Overdue tasks
3. Checks run automatically every 30 minutes

## 🌐 API Endpoints

The backend provides a REST API:

- `GET /api/todos` - Get all todos
- `GET /api/todos/:id` - Get todo by ID
- `POST /api/todos` - Create new todo
- `PUT /api/todos/:id` - Update todo
- `DELETE /api/todos/:id` - Delete todo
- `DELETE /api/todos` - Delete all completed
- `GET /api/health` - Health check

## 🧪 Testing

Run end-to-end tests:
```bash
npm run e2e
```

Run tests in UI mode:
```bash
npm run e2e:ui
```

## 📝 Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start frontend dev server |
| `npm run build` | Build for production |
| `npm run server` | Start backend server |
| `npm run dev` | Run both frontend & backend |
| `npm run e2e` | Run Playwright tests |
| `npm test` | Run unit tests |

## 🎯 Roadmap

- [ ] Complete TodoItem integration with new features
- [ ] Add bulk operations (select multiple, bulk delete)
- [ ] Export/import todos (JSON, CSV)
- [ ] Recurring tasks
- [ ] Task templates
- [ ] Collaboration features
- [ ] Mobile app (React Native)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 👤 Author

**Ankit Kaushik**
- GitHub: [@ankit7610](https://github.com/ankit7610)

## 🙏 Acknowledgments

- Design inspired by modern neumorphism and neon aesthetics
- Built with ❤️ using React and TypeScript

---

**Note**: This is an evolving project with continuous improvements. Check the branches for the latest experimental features!
