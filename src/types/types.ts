export interface Point {
    x: number;
    y: number;
}

export interface ViewTransform {
    scale: number;
    offsetX: number;
    offsetY: number;
}

export interface AppState {
    currentTool: string;
    brushSize: number;
    brushOpacity: number;
    currentColor: string;
    viewTransform: ViewTransform;
    showGrid: boolean;
    isDarkTheme: boolean;
    title: string;
    pages: DrawingPage[];
    activePageIndex: number;
    showLeftPanel: boolean;
    showRightPanel: boolean;
    isPanning: boolean;
    cursorPosition: Point | null;
}

export interface DrawingStroke {
    tool: string;
    points: Point[];
    color: string;
    size: number;
    opacity: number;
}

export interface ThemeClasses {
    bg: string;
    modal: string;
    surface: string;
    surfaceHover: string;
    text: string;
    textSecondary: string;
    accent: string;
    accentHover: string;
    border: string;
    canvas: string;
    shadow: string;
    ring: string;
}

export interface DrawingPage {
    id: string;
    strokes: DrawingStroke[];
    history: DrawingStroke[][];
    historyIndex: number;
}

export interface AppState {
    currentTool: string;
    brushSize: number;
    brushOpacity: number;
    currentColor: string;
    viewTransform: {
        scale: number;
        offsetX: number;
        offsetY: number;
    };
    showGrid: boolean;
    isDarkTheme: boolean;
    pages: DrawingPage[];
    activePageIndex: number;
    showLeftPanel: boolean;
    showRightPanel: boolean;
    isPanning: boolean;
    cursorPosition: Point | null;
}