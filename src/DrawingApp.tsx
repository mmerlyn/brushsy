import React, { useState, useRef, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Point, DrawingStroke, DrawingPage, AppState, ThemeClasses } from './types/types';
import { TOOLS, canvasWidth, canvasHeight }  from './constants/constants';
import { drawStroke, redrawCanvas, hitTestStroke, drawSelectionHighlight } from './utils/drawingUtils';
import CanvasPage from './components/CanvasPage';
import ToolPanel from './components/ToolPanel';
import ControlPanel from './components/ControlPanel';
import ThemeToggle from './components/ThemeToggle';
import { jsPDF } from 'jspdf';
import { XCircle } from 'lucide-react';

const STORAGE_KEY = 'brushsy-drawing-state';

interface DrawingAppProps {
    onClose?: () => void;
}

const getDefaultState = (): AppState => ({
    currentTool: 'brush',
    brushSize: 4,
    brushOpacity: 100,
    currentColor: '#1a1a1a',
    viewTransform: { scale: 1, offsetX: 0, offsetY: 0 },
    showGrid: false,
    isDarkTheme: false,
    pages: [{ id: uuidv4(), strokes: [], history: [[]], historyIndex: 0 }],
    activePageIndex: 0,
    showLeftPanel: false,
    showRightPanel: false,
    isPanning: false,
    selectedStrokeIds: [],
    title: 'Untitled Page',
});

const loadStateFromStorage = (): AppState => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            // Merge with default state to ensure all fields exist
            return {
                ...getDefaultState(),
                ...parsed,
                // Reset transient state
                showLeftPanel: false,
                showRightPanel: false,
                isPanning: false,
                selectedStrokeIds: [],
            };
        }
    } catch (e) {
        console.warn('Failed to load state from localStorage:', e);
    }
    return getDefaultState();
};

const saveStateToStorage = (state: AppState) => {
    try {
        // Only save persistent data, not transient UI state
        const toSave = {
            brushSize: state.brushSize,
            brushOpacity: state.brushOpacity,
            currentColor: state.currentColor,
            showGrid: state.showGrid,
            isDarkTheme: state.isDarkTheme,
            pages: state.pages,
            activePageIndex: state.activePageIndex,
            title: state.title,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch (e) {
        console.warn('Failed to save state to localStorage:', e);
    }
};

const DrawingApp: React.FC<DrawingAppProps> = ({ onClose }) => {
    const canvasRefs = useRef<Array<HTMLCanvasElement | null>>([]);
    const overlayCanvasRefs = useRef<Array<HTMLCanvasElement | null>>([]);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const isDrawing = useRef(false);
    const currentStroke = useRef<DrawingStroke | null>(null);
    const panStart = useRef<Point | null>(null);
    const cursorPositionRef = useRef<Point | null>(null);
    const [state, setState] = useState<AppState>(loadStateFromStorage);
    const [cursorPosition, setCursorPosition] = useState<Point | null>(null);
    const [isExporting, setIsExporting] = useState(false);
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [tempTitle, setTempTitle] = useState(state.title);

    // Save state to localStorage when it changes
    useEffect(() => {
        saveStateToStorage(state);
    }, [state.pages, state.brushSize, state.brushOpacity, state.currentColor, state.showGrid, state.isDarkTheme, state.title, state.activePageIndex]);


    const handleSaveTitle = useCallback(() => {
        setState(prev => ({ ...prev, title: tempTitle.trim() || 'Untitled Artwork' }));
        setIsEditingTitle(false);
    }, [tempTitle]);

    const handleCancelTitleEdit = useCallback(() => {
        setTempTitle(state.title);
        setIsEditingTitle(false);
    }, [state.title]);

    const handleTitleKeyPress = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSaveTitle();
        } else if (e.key === 'Escape') {
            handleCancelTitleEdit();
        }
    }, [handleSaveTitle, handleCancelTitleEdit]);

    const handleCanvasClick = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        if (state.showLeftPanel || state.showRightPanel) {
            setState(prev => ({
                ...prev,
                showLeftPanel: false,
                showRightPanel: false
            }));
        }
    }, [state.showLeftPanel, state.showRightPanel]);

    const getCanvasPoint = useCallback((e: React.MouseEvent | React.TouchEvent, pageIndex: number): Point => {
        const canvas = canvasRefs.current[pageIndex];
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();
        const clientX = 'touches' in e ? e.touches[0]?.clientX ?? 0 : e.clientX;
        const clientY = 'touches' in e ? e.touches[0]?.clientY ?? 0 : e.clientY;
        // Account for zoom scale in the bounding rect (which is already scaled)
        const canvasX = (clientX - rect.left) / rect.width * canvasWidth;
        const canvasY = (clientY - rect.top) / rect.height * canvasHeight;
        return { x: canvasX, y: canvasY };
    }, []);

    const handleStart = useCallback((e: React.MouseEvent | React.TouchEvent, pageIndex: number) => {
        const nativeEvent = e.nativeEvent;
        if ('touches' in nativeEvent && nativeEvent.touches.length > 1) return;
        e.preventDefault();

        if (state.showLeftPanel || state.showRightPanel) {
            setState(prev => ({
                ...prev,
                showLeftPanel: false,
                showRightPanel: false
            }));
        }

        if (state.currentTool === 'pan') {
            setState(prev => ({ ...prev, isPanning: true }));
            panStart.current = {
                x: 'touches' in nativeEvent ? nativeEvent.touches[0].clientX : nativeEvent.clientX,
                y: 'touches' in nativeEvent ? nativeEvent.touches[0].clientY : nativeEvent.clientY
            };
            return;
        }
        if (state.currentTool === 'select') {
            const point = getCanvasPoint(e, pageIndex);
            const page = state.pages[pageIndex];
            const hitStroke = hitTestStroke(point, page.strokes);

            if (hitStroke) {
                setState(prev => ({
                    ...prev,
                    activePageIndex: pageIndex,
                    selectedStrokeIds: [hitStroke.id]
                }));
            } else {
                // Clicked on empty space - deselect
                setState(prev => ({
                    ...prev,
                    activePageIndex: pageIndex,
                    selectedStrokeIds: []
                }));
            }
            return;
        }

        isDrawing.current = true;
        setState(prev => ({ ...prev, activePageIndex: pageIndex }));
        const point = getCanvasPoint(e, pageIndex);
        currentStroke.current = {
            id: uuidv4(),
            tool: state.currentTool,
            points: [point],
            color: state.currentColor,
            size: state.brushSize,
            opacity: state.brushOpacity
        };
    }, [state.currentTool, state.currentColor, state.brushSize, state.brushOpacity, state.showLeftPanel, state.showRightPanel, getCanvasPoint]);

    const handleMove = useCallback((e: MouseEvent | TouchEvent) => {
        if (e instanceof TouchEvent && e.touches.length > 1) return;
        const clientX = 'touches' in e ? e.touches[0]?.clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0]?.clientY : e.clientY;
        if (clientX === undefined || clientY === undefined) return;

        // Update cursor position ref immediately (no re-render)
        cursorPositionRef.current = { x: clientX, y: clientY };

        // Only update state for eraser cursor preview (throttled)
        if (state.currentTool === 'eraser' && !isDrawing.current) {
            setCursorPosition({ x: clientX, y: clientY });
        }

        if (state.isPanning && panStart.current && scrollContainerRef.current) {
            e.preventDefault();
            const dx = clientX - panStart.current.x;
            const dy = clientY - panStart.current.y;
            panStart.current = { x: clientX, y: clientY };
            scrollContainerRef.current.scrollLeft -= dx;
            scrollContainerRef.current.scrollTop -= dy;
            return;
        }

        if (!isDrawing.current || !currentStroke.current) return;
        e.preventDefault();

        const pageIndex = state.activePageIndex;
        const overlayCanvas = overlayCanvasRefs.current[pageIndex];
        const overlayCtx = overlayCanvas?.getContext('2d');
        if (!overlayCtx || !overlayCanvas) return;

        const canvas = canvasRefs.current[pageIndex];
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const canvasX = (clientX - rect.left) / rect.width * canvasWidth;
        const canvasY = (clientY - rect.top) / rect.height * canvasHeight;
        const point = { x: canvasX, y: canvasY };

        currentStroke.current.points.push(point);
        overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
        drawStroke(overlayCtx, currentStroke.current, state.isDarkTheme);
    }, [state.activePageIndex, state.isPanning, state.isDarkTheme, state.currentTool]);

    const handleEnd = useCallback(() => {
        if (state.isPanning) {
            setState(prev => ({ ...prev, isPanning: false }));
            panStart.current = null;
            return;
        }

        if (!isDrawing.current || !currentStroke.current) {
            isDrawing.current = false;
            currentStroke.current = null;
            return;
        }

        const pageIndex = state.activePageIndex;
        const finalStroke = currentStroke.current;
        const overlayCanvas = overlayCanvasRefs.current[pageIndex];
        
        if (overlayCanvas) {
            const overlayCtx = overlayCanvas.getContext('2d', { willReadFrequently: true });
            if (overlayCtx) {
                overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
            } else {
                console.warn(`Overlay context not found for page ${pageIndex} in handleEnd.`);
            }
        } else {
            console.warn(`Overlay canvas not found for page ${pageIndex} in handleEnd.`);
        }

        setState(prev => {
            const newPages = [...prev.pages];
            const page = newPages[pageIndex];
            const newStrokes = [...page.strokes, finalStroke];
            const newHistory = page.history.slice(0, page.historyIndex + 1);
            newHistory.push(newStrokes);
            newPages[pageIndex] = {
                ...page,
                strokes: newStrokes,
                history: newHistory,
                historyIndex: newHistory.length - 1
            };
            return { ...prev, pages: newPages };
        });

        isDrawing.current = false;
        currentStroke.current = null;
    }, [state.activePageIndex, state.isPanning]);

    useEffect(() => {
        const handleGlobalMove = (e: MouseEvent | TouchEvent) => handleMove(e);
        const handleGlobalEnd = () => handleEnd();

        window.addEventListener('mousemove', handleGlobalMove);
        window.addEventListener('mouseup', handleGlobalEnd);
        window.addEventListener('touchmove', handleGlobalMove, { passive: false });
        window.addEventListener('touchend', handleGlobalEnd);

        return () => {
            window.removeEventListener('mousemove', handleGlobalMove);
            window.removeEventListener('mouseup', handleGlobalEnd);
            window.removeEventListener('touchmove', handleGlobalMove);
            window.removeEventListener('touchend', handleGlobalEnd);
        };
    }, [handleMove, handleEnd]);

    // Wheel zoom handler
    useEffect(() => {
        const handleWheel = (e: WheelEvent) => {
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                const delta = e.deltaY > 0 ? 0.9 : 1.1;
                setState(prev => ({
                    ...prev,
                    viewTransform: {
                        ...prev.viewTransform,
                        scale: Math.min(Math.max(prev.viewTransform.scale * delta, 0.25), 3)
                    }
                }));
            }
        };

        const container = scrollContainerRef.current;
        if (container) {
            container.addEventListener('wheel', handleWheel, { passive: false });
        }

        return () => {
            if (container) {
                container.removeEventListener('wheel', handleWheel);
            }
        };
    }, []);

    useEffect(() => {
        state.pages.forEach((_, index) => {
            const canvas = canvasRefs.current[index];
            if (canvas) {
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    console.error(`Could not get 2D context for canvas at index ${index}`);
                    return;
                }
            }
            const overlayCanvas = overlayCanvasRefs.current[index];
            if (overlayCanvas) {
                const overlayCtx = overlayCanvas.getContext('2d');
                if (!overlayCtx) {
                    console.error(`Could not get 2D context for overlay canvas at index ${index}`);
                    return;
                }
            }
            redrawCanvas(index, canvasRefs, overlayCanvasRefs, state, canvasWidth, canvasHeight);
        });
    }, [state.pages, state.showGrid, state.isDarkTheme]);

    // Draw selection highlights on overlay canvas
    useEffect(() => {
        if (state.selectedStrokeIds.length === 0) return;

        const pageIndex = state.activePageIndex;
        const overlayCanvas = overlayCanvasRefs.current[pageIndex];
        if (!overlayCanvas) return;

        const overlayCtx = overlayCanvas.getContext('2d');
        if (!overlayCtx) return;

        overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);

        const page = state.pages[pageIndex];
        state.selectedStrokeIds.forEach(id => {
            const stroke = page.strokes.find(s => s.id === id);
            if (stroke) {
                drawSelectionHighlight(overlayCtx, stroke);
            }
        });
    }, [state.selectedStrokeIds, state.activePageIndex, state.pages]);

    // Zoom functions
    const zoomIn = useCallback(() => {
        setState(prev => ({
            ...prev,
            viewTransform: {
                ...prev.viewTransform,
                scale: Math.min(prev.viewTransform.scale * 1.2, 3)
            }
        }));
    }, []);

    const zoomOut = useCallback(() => {
        setState(prev => ({
            ...prev,
            viewTransform: {
                ...prev.viewTransform,
                scale: Math.max(prev.viewTransform.scale / 1.2, 0.25)
            }
        }));
    }, []);

    const resetZoom = useCallback(() => {
        setState(prev => ({
            ...prev,
            viewTransform: { scale: 1, offsetX: 0, offsetY: 0 }
        }));
    }, []);

    // Delete selected strokes
    const deleteSelectedStrokes = useCallback(() => {
        if (state.selectedStrokeIds.length === 0) return;

        setState(prev => {
            const pageIndex = prev.activePageIndex;
            const page = prev.pages[pageIndex];
            const newStrokes = page.strokes.filter(s => !prev.selectedStrokeIds.includes(s.id));
            const newHistory = page.history.slice(0, page.historyIndex + 1);
            newHistory.push(newStrokes);

            const newPages = [...prev.pages];
            newPages[pageIndex] = {
                ...page,
                strokes: newStrokes,
                history: newHistory,
                historyIndex: newHistory.length - 1
            };

            return {
                ...prev,
                pages: newPages,
                selectedStrokeIds: []
            };
        });

        // Clear overlay
        const overlayCanvas = overlayCanvasRefs.current[state.activePageIndex];
        if (overlayCanvas) {
            const overlayCtx = overlayCanvas.getContext('2d');
            if (overlayCtx) {
                overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
            }
        }
    }, [state.selectedStrokeIds, state.activePageIndex]);

    const undo = useCallback(() => {
        setState(prev => {
            const page = prev.pages[prev.activePageIndex];
            if (page.historyIndex > 0) {
                const newIndex = page.historyIndex - 1;
                const newPages = prev.pages.map((p, index) =>
                    index === prev.activePageIndex
                        ? { ...p, strokes: p.history[newIndex], historyIndex: newIndex }
                        : p
                );
                return { ...prev, pages: newPages };
            }
            return prev;
        });
    }, []);

    const redo = useCallback(() => {
        setState(prev => {
            const page = prev.pages[prev.activePageIndex];
            if (page.historyIndex < page.history.length - 1) {
                const newIndex = page.historyIndex + 1;
                const newPages = prev.pages.map((p, index) =>
                    index === prev.activePageIndex
                        ? { ...p, strokes: p.history[newIndex], historyIndex: newIndex }
                        : p
                );
                return { ...prev, pages: newPages };
            }
            return prev;
        });
    }, []);

    const addPage = useCallback(() => {
        const newPage: DrawingPage = {
            id: uuidv4(),
            strokes: [],
            history: [[]],
            historyIndex: 0
        };

        setState(prev => ({ ...prev, pages: [...prev.pages, newPage], activePageIndex: prev.pages.length }));

        setTimeout(() => {
            if (scrollContainerRef.current) {
                const pageHeight = canvasHeight + 100;
                scrollContainerRef.current.scrollTo({
                    top: (state.pages.length) * pageHeight,
                    behavior: 'smooth'
                });
            }
        }, 100);
    }, [state.pages.length]);

    const deletePage = useCallback((pageIndexToDelete: number) => {
        setState(prev => {
            if (prev.pages.length <= 1) return prev;

            const newPages = prev.pages.filter((_, index) => index !== pageIndexToDelete);
            const newActiveIndex = Math.min(prev.activePageIndex, newPages.length - 1);
            return {
                ...prev,
                pages: newPages,
                activePageIndex: newActiveIndex
            };
        });
    }, []);

    const exportPNG = useCallback(() => {
        const canvas = canvasRefs.current[state.activePageIndex];
        if (canvas) {
            const link = document.createElement('a');
            const timestamp = new Date().toISOString().split('T')[0];
            const sanitizedTitle = state.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
            link.download = `${sanitizedTitle}-page-${state.activePageIndex + 1}-${timestamp}.png`;
            link.href = canvas.toDataURL();
            link.click();
        }
    }, [state.activePageIndex, state.title]);

    const scrollToPage = useCallback((pageIndex: number) => {
        if (scrollContainerRef.current) {
            const pageHeight = canvasHeight + 100;
            scrollContainerRef.current.scrollTo({
                top: pageIndex * pageHeight,
                behavior: 'smooth'
            });
        }
    }, []);

    const exportPDF = useCallback(async () => {
        setIsExporting(true);
        
        try {
            const canvasAspectRatio = canvasWidth / canvasHeight;
            const isCanvasPortrait = canvasAspectRatio < 1;
            
            const doc = new jsPDF({
                orientation: isCanvasPortrait ? 'portrait' : 'landscape',
                unit: 'mm',
                format: 'a4'
            });

            const pdfWidth = doc.internal.pageSize.getWidth();
            const pdfHeight = doc.internal.pageSize.getHeight();
            const margin = 10;
            
            const availableWidth = pdfWidth - (2 * margin);
            const availableHeight = pdfHeight - (2 * margin);
            const availableAspectRatio = availableWidth / availableHeight;
            
            let imgWidth, imgHeight;
            if (canvasAspectRatio > availableAspectRatio) {
                imgWidth = availableWidth;
                imgHeight = availableWidth / canvasAspectRatio;
            } else {
                imgHeight = availableHeight;
                imgWidth = availableHeight * canvasAspectRatio;
            }
            
            const x = (pdfWidth - imgWidth) / 2;
            const y = (pdfHeight - imgHeight) / 2;

            for (let i = 0; i < state.pages.length; i++) {
                const canvas = canvasRefs.current[i];
                
                if (canvas) {
                    const tempCanvas = document.createElement('canvas');
                    tempCanvas.width = canvasWidth;
                    tempCanvas.height = canvasHeight;
                    const tempCtx = tempCanvas.getContext('2d');
                    
                    if (tempCtx) {
                        tempCtx.fillStyle = '#ffffff';
                        tempCtx.fillRect(0, 0, canvasWidth, canvasHeight);
                        
                        tempCtx.drawImage(canvas, 0, 0);
                        
                        const imgData = tempCanvas.toDataURL('image/jpeg', 0.95);
                        
                        if (i > 0) {
                            doc.addPage();
                        }
                        
                        doc.addImage(imgData, 'JPEG', x, y, imgWidth, imgHeight);
                        
                        doc.setFontSize(16);
                        doc.setTextColor(60, 60, 60);
                        doc.text(state.title, margin, margin / 2 + 5);
                        
                        doc.setFontSize(10);
                        doc.setTextColor(128, 128, 128);
                        doc.text(`Page ${i + 1} of ${state.pages.length}`, pdfWidth - margin - 30, pdfHeight - 5);
                        
                        tempCanvas.remove();
                    }
                } else {
                    console.warn(`Canvas for page ${i + 1} not found`);
                }
            }

            const timestamp = new Date().toISOString().split('T')[0];
            const sanitizedTitle = state.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
            const filename = `${sanitizedTitle}-${timestamp}.pdf`;
            
            doc.save(filename);
            
            console.log(`PDF exported successfully: ${filename}`);
            
        } catch (error) {
            console.error('Error during PDF export:', error);
            alert('Failed to export PDF. Please try again.');
        } finally {
            setIsExporting(false);
        }
    }, [state.pages, state.title]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (state.showLeftPanel || state.showRightPanel || (e.target as HTMLElement).tagName === 'INPUT' || isEditingTitle) {
                return;
            }

            const key = e.key.toLowerCase();

            const tool = TOOLS.find(t => t.shortcut.toLowerCase() === key);
            if (tool) {
                e.preventDefault();
                setState(prev => ({ ...prev, currentTool: tool.id, selectedStrokeIds: [] }));
                return;
            }

            if (e.ctrlKey || e.metaKey) {
                switch (key) {
                    case 'z':
                        e.preventDefault();
                        if (e.shiftKey) {
                            redo();
                        } else {
                            undo();
                        }
                        break;
                    case 'y':
                        e.preventDefault();
                        redo();
                        break;
                    case 'n':
                        e.preventDefault();
                        addPage();
                        break;
                    case 's':
                        e.preventDefault();
                        exportPNG();
                        break;
                    case 'p':
                        e.preventDefault();
                        exportPDF();
                        break;
                }
                return;
            }

            // Delete/Backspace to delete selected strokes
            if (key === 'delete' || key === 'backspace') {
                e.preventDefault();
                deleteSelectedStrokes();
                return;
            }

            // Zoom shortcuts
            if (key === '=' || key === '+') {
                e.preventDefault();
                zoomIn();
                return;
            }

            if (key === '-') {
                e.preventDefault();
                zoomOut();
                return;
            }

            if (key === '0') {
                e.preventDefault();
                resetZoom();
                return;
            }

            if (key === 'g') {
                e.preventDefault();
                setState(prev => ({ ...prev, showGrid: !prev.showGrid }));
            }

            if (key === 't') {
                e.preventDefault();
                setState(prev => ({ ...prev, showLeftPanel: !prev.showLeftPanel }));
            }

            if (key === 'c') {
                e.preventDefault();
                setState(prev => ({ ...prev, showRightPanel: !prev.showRightPanel }));
            }

            if (key === 'escape') {
                e.preventDefault();
                setState(prev => ({
                    ...prev,
                    showLeftPanel: false,
                    showRightPanel: false
                }));
                onClose?.();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [state.showLeftPanel, state.showRightPanel, undo, redo, addPage, exportPNG, exportPDF, isEditingTitle, onClose, deleteSelectedStrokes, zoomIn, zoomOut, resetZoom]);

    const themeClasses: ThemeClasses = state.isDarkTheme ? {
        bg: 'bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800',
        modal: 'bg-gray-800/95 backdrop-blur-sm border-gray-700',
        surface: 'bg-gray-700 hover:bg-gray-600',
        surfaceHover: 'hover:bg-gray-600',
        text: 'text-gray-100',
        textSecondary: 'text-gray-400',
        accent: 'bg-blue-600 hover:bg-blue-700',
        accentHover: 'hover:bg-blue-700',
        border: 'border-gray-600',
        canvas: 'bg-gradient-to-br from-gray-800 to-gray-900',
        shadow: 'shadow-xl shadow-black/20',
        ring: 'ring-blue-500/30'
    } : {
        bg: 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50',
        modal: 'bg-white/95 backdrop-blur-sm border-gray-200',
        surface: 'bg-white hover:bg-gray-50',
        surfaceHover: 'hover:bg-gray-50',
        text: 'text-gray-900',
        textSecondary: 'text-gray-600',
        accent: 'bg-blue-600 hover:bg-blue-700',
        accentHover: 'hover:bg-blue-700',
        border: 'border-gray-200',
        canvas: 'bg-gradient-to-br from-white to-gray-50/50',
        shadow: 'shadow-xl shadow-gray-200/40',
        ring: 'ring-blue-500/30'
    };

    return (
        <div className={`h-screen ${themeClasses.bg} ${themeClasses.text} relative overflow-hidden`}>
            {onClose && (
                <button
                    onClick={onClose}
                    className={`fixed top-4 right-4 z-50 w-12 h-12 ${themeClasses.surface} ${themeClasses.surfaceHover} rounded-full flex items-center justify-center ${themeClasses.shadow} transition-all duration-300 hover:scale-110`}
                    title="Close Canvas (Escape)"
                >
                    <XCircle className="w-6 h-6 text-gray-500" />
                </button>
            )}
            <div className="absolute top-2 sm:top-4 left-2 sm:left-4 z-50 max-w-[calc(100%-4rem)] sm:max-w-xs">
                {isEditingTitle ? (
                    <div className={`${themeClasses.modal} border ${themeClasses.border} rounded-lg sm:rounded-xl px-2 sm:px-4 py-2 sm:py-3 ${themeClasses.shadow} flex items-center gap-2 sm:gap-3`}>
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse flex-shrink-0"></div>
                        <input
                            type="text"
                            value={tempTitle}
                            onChange={(e) => setTempTitle(e.target.value)}
                            onKeyDown={handleTitleKeyPress}
                            onBlur={handleSaveTitle}
                            className={`bg-transparent outline-none text-xs sm:text-sm font-medium ${themeClasses.text} min-w-0 flex-1`}
                            style={{ width: `${Math.max(tempTitle.length, 8)}ch`, maxWidth: '150px' }}
                            autoFocus
                            maxLength={30}
                            placeholder="Enter title..."
                        />
                        <button
                            onClick={handleSaveTitle}
                            className="w-6 h-6 sm:w-7 sm:h-7 bg-green-500 hover:bg-green-600 text-white rounded-lg text-xs transition-all duration-200 hover:scale-110 active:scale-95 flex items-center justify-center flex-shrink-0"
                            title="Save (Enter)"
                        >
                            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                            </svg>
                        </button>
                        <button
                            onClick={handleCancelTitleEdit}
                            className="w-6 h-6 sm:w-7 sm:h-7 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs transition-all duration-200 hover:scale-110 active:scale-95 flex items-center justify-center flex-shrink-0"
                            title="Cancel (Escape)"
                        >
                            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => {
                            setIsEditingTitle(true);
                            setTempTitle(state.title);
                        }}
                        className={`${themeClasses.modal} border ${themeClasses.border} rounded-lg sm:rounded-xl px-2 sm:px-4 py-2 sm:py-3 ${themeClasses.shadow} hover:${themeClasses.surfaceHover} transition-all duration-200 hover:scale-105 active:scale-95 group`}
                        title="Click to edit title"
                    >
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0"></div>
                            <span className="text-xs sm:text-sm font-medium truncate max-w-[120px] sm:max-w-[180px]">{state.title}</span>
                            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors flex-shrink-0">
                                <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                </svg>
                            </div>
                        </div>
                    </button>
                )}
            </div>

            <ThemeToggle isDarkTheme={state.isDarkTheme} setState={setState} />

            <button
                onClick={() => setState(prev => ({ ...prev, showLeftPanel: !prev.showLeftPanel }))}
                className={`fixed bottom-4 sm:bottom-6 left-3 sm:left-6 z-50 w-12 h-12 sm:w-14 sm:h-14 ${themeClasses.accent} ${themeClasses.accentHover} text-white rounded-xl sm:rounded-2xl flex items-center justify-center ${themeClasses.shadow} transition-all duration-300 hover:scale-105 active:scale-95 group`}
                title="Toggle Tools Panel (T)"
            >
                <div className="relative">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 group-hover:rotate-12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42" />
                    </svg>
                    <div className="hidden sm:block absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-full h-full bg-green-400 rounded-full animate-ping"></div>
                    </div>
                </div>
            </button>

            <button
                onClick={() => setState(prev => ({ ...prev, showRightPanel: !prev.showRightPanel }))}
                className={`fixed bottom-4 sm:bottom-6 right-3 sm:right-6 z-50 w-12 h-12 sm:w-14 sm:h-14 ${themeClasses.accent} ${themeClasses.accentHover} text-white rounded-xl sm:rounded-2xl flex items-center justify-center ${themeClasses.shadow} transition-all duration-300 hover:scale-105 active:scale-95 group`}
                title="Toggle Controls Panel (C)"
            >
                <div className="relative">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 group-hover:rotate-12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                    <div className="hidden sm:block absolute -top-1 -right-1 w-3 h-3 bg-orange-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-full h-full bg-orange-400 rounded-full animate-ping"></div>
                    </div>
                </div>
            </button>

            {state.currentTool === 'eraser' && cursorPosition && (
                <div
                    className="fixed pointer-events-none z-[60]"
                    style={{
                        left: cursorPosition.x - state.brushSize / 2,
                        top: cursorPosition.y - state.brushSize / 2,
                        width: state.brushSize,
                        height: state.brushSize,
                    }}
                >
                    <div className="w-full h-full rounded-full border-2 border-red-500 bg-red-500/20"></div>
                </div>
            )}

            <ToolPanel
                state={state}
                setState={setState}
                themeClasses={themeClasses}
            />

            <ControlPanel
                state={state}
                setState={setState}
                themeClasses={themeClasses}
                undo={undo}
                redo={redo}
                addPage={addPage}
                deletePage={deletePage}
                exportPNG={exportPNG}
                exportPDF={exportPDF}
                scrollToPage={scrollToPage}
                isExporting={isExporting}
            />

            {/* Zoom Controls - hidden on very small screens, shown at top on mobile */}
            <div className={`fixed bottom-20 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1 sm:gap-2 ${themeClasses.modal} border ${themeClasses.border} rounded-xl sm:rounded-2xl px-2 sm:px-4 py-1.5 sm:py-2 ${themeClasses.shadow}`}>
                <button
                    onClick={zoomOut}
                    className={`w-8 h-8 sm:w-8 sm:h-8 ${themeClasses.surface} rounded-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95`}
                    title="Zoom Out (-)"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                    </svg>
                </button>
                <button
                    onClick={resetZoom}
                    className={`px-2 sm:px-3 py-1 ${themeClasses.surface} rounded-lg text-xs sm:text-sm font-mono transition-all hover:scale-105 active:scale-95`}
                    title="Reset Zoom (0)"
                >
                    {Math.round(state.viewTransform.scale * 100)}%
                </button>
                <button
                    onClick={zoomIn}
                    className={`w-8 h-8 sm:w-8 sm:h-8 ${themeClasses.surface} rounded-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95`}
                    title="Zoom In (+)"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                </button>
            </div>

            <div className="h-full">
                <div
                    ref={scrollContainerRef}
                    className={`w-full h-full overflow-auto ${themeClasses.canvas} px-2 py-16 sm:px-6 sm:py-12 md:p-12`}
                    onClick={handleCanvasClick}
                >
                    <div
                        className="flex flex-col items-center space-y-12 sm:space-y-16 md:space-y-20 origin-top pt-8 sm:pt-4"
                        style={{
                            transform: `scale(${state.viewTransform.scale})`,
                            transformOrigin: 'top center'
                        }}
                    >
                        {state.pages.map((page, pageIndex) => (
                            <CanvasPage
                                key={page.id}
                                page={page}
                                pageIndex={pageIndex}
                                state={state}
                                themeClasses={themeClasses}
                                canvasRefs={canvasRefs}
                                overlayCanvasRefs={overlayCanvasRefs}
                                handleStart={handleStart}
                                addPage={addPage}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DrawingApp;