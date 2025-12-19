# Todo App

A simple and elegant to-do list application built with React and TypeScript.

## Features

- ✅ Add new todos
- ✅ Mark todos as completed
- ✅ Delete todos
- ✅ Persistent storage (localStorage)
- ✅ Responsive design
- ✅ Task completion counter

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone or navigate to the project directory
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the App

Start the development server:

```bash
npm start
```

The app will open in your browser at [http://localhost:3000](http://localhost:3000)

### Building for Production

Create an optimized production build:

```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── TodoInput.tsx      # Input form component
│   ├── TodoInput.css
│   ├── TodoItem.tsx       # Individual todo item component
│   ├── TodoItem.css
│   ├── TodoList.tsx       # List container component
│   └── TodoList.css
├── types/
│   └── index.ts           # TypeScript type definitions
├── App.tsx                # Main app component
├── App.css
├── index.tsx              # React entry point
└── index.css              # Global styles
```

## Technologies Used

- **React** - UI library
- **TypeScript** - Type-safe JavaScript
- **CSS3** - Styling with gradients and animations
- **localStorage** - Data persistence

## Features in Detail

### Add Todos
Type in the input field and click "Add" or press Enter to create a new todo.

### Toggle Completion
Click the checkbox next to a todo to mark it as completed. Completed todos will have a strikethrough effect.

### Delete Todos
Click the "✕" button to remove a todo from the list.

### Persistent Storage
All todos are automatically saved to your browser's localStorage, so they persist even after closing the browser.

### Progress Tracking
The app displays how many todos you've completed out of the total number.

## Author

Created with React + TypeScript
