# Brushsy

A digital drawing app I built to practice frontend development with React and TypeScript.

[Live Application](https://www.brushsy.net/)

## About

I built Brushsy as a learning project to get hands-on experience with the HTML Canvas API and explore performance optimization in React. It's a simple whiteboard/drawing app where you can sketch, draw shapes, and create artwork across multiple pages. Everything auto-saves to the browser and can be exported as PNG or PDF.

## Features

- **Drawing Tools** - Brush, Eraser, Rectangle, Circle, Line, Pan, Select
- **Multi-Page Support** - Unlimited pages with independent undo/redo history
- **Customization** - Adjustable brush size, opacity, and 32+ color palette
- **Select & Delete** - Click to select strokes, press Delete to remove
- **Zoom** - Ctrl+Scroll or +/- keys to zoom in/out
- **Export** - PNG (single page) or PDF (all pages)
- **Persistence** - Auto-saves to localStorage
- **Responsive** - Works on desktop, tablet, and mobile
- **Dark Mode** - Toggle between light and dark themes

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **HTML Canvas API** - Drawing engine
- **jsPDF + html2canvas** - PDF export
- **Vite** - Build tool

## What I Learned

Building this project taught me a lot about frontend development:

- **Performance Optimization** - Using refs instead of state to avoid lag during drawing
- **State Management** - Handling complex undo/redo history across multiple pages
- **Algorithm Design** - Detecting if a user clicked on a shape using math
- **Cross-Platform Development** - Making the app work on both desktop and mobile
- **React Hooks** - When to use useCallback, useRef, and useEffect
- **Data Persistence** - Saving user data to localStorage
- **Responsive Design** - Building UI that adapts to different screen sizes

## License

MIT
