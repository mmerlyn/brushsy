import {
    Brush, Eraser, Square, Circle, Zap, Move, MousePointer2, Hexagon
} from 'lucide-react';

export const COLORS = [
    '#1a1a1a', '#ffffff', '#ff4757', '#2ed573', '#3742fa', '#ffa502', '#ff6348', '#ff3838',
    '#7bed9f', '#70a1ff', '#5352ed', '#ff9ff3', '#54a0ff', '#7bed9f', '#a4b0be', '#57606f',
    '#2f3542', '#f1f2f6', '#ddd', '#c4c4c4', '#8b8b8b', '#6c6c6c', '#4a4a4a', '#2a2a2a',
    '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#f9ca24', '#eb4d4b', '#6c5ce7', '#a29bfe'
];

export const TOOLS = [
    { id: 'brush', icon: Brush, name: 'Brush', shortcut: 'B', description: 'Free drawing' },
    { id: 'eraser', icon: Eraser, name: 'Eraser', shortcut: 'E', description: 'Remove strokes' },
    { id: 'rectangle', icon: Square, name: 'Rectangle', shortcut: 'R', description: 'Draw rectangles' },
    { id: 'circle', icon: Circle, name: 'Circle', shortcut: 'C', description: 'Draw circles' },
    { id: 'line', icon: Zap, name: 'Line', shortcut: 'L', description: 'Straight lines' },
    { id: 'pan', icon: Move, name: 'Pan', shortcut: 'H', description: 'Move canvas' },
    { id: 'select', icon: MousePointer2, name: 'Select', shortcut: 'V', description: 'Select objects' }
];

export const canvasWidth = 794;
export const canvasHeight = 1123;

export const Plus = Hexagon;