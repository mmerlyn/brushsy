import React from 'react';
import type { RefObject } from 'react';
import type { DrawingPage, AppState, ThemeClasses } from '../types/types';
import { canvasWidth, canvasHeight } from '../constants/constants';
import { Plus } from 'lucide-react';

interface CanvasPageProps {
    page: DrawingPage;
    pageIndex: number;
    state: AppState;
    themeClasses: ThemeClasses;
    canvasRefs: RefObject<(HTMLCanvasElement | null)[]>;
    overlayCanvasRefs: RefObject<(HTMLCanvasElement | null)[]>;
    handleStart: (e: React.MouseEvent | React.TouchEvent, pageIndex: number) => void;
    addPage: () => void;
}

const CanvasPage: React.FC<CanvasPageProps> = ({
    page,
    pageIndex,
    state,
    themeClasses,
    canvasRefs,
    overlayCanvasRefs,
    handleStart,
    addPage
}) => {
    return (
        <div className="relative group">
            <div className={`absolute -top-6 left-0 flex items-center gap-3`}>
                <div className={`px-2 py-1 rounded-full transition-all ${
                    pageIndex === state.activePageIndex
                        ? `${themeClasses.accent} text-white ${themeClasses.shadow}`
                        : `${themeClasses.surface} ${themeClasses.text}`
                }`}>
                    <span className="font-semibold">Page {pageIndex + 1}</span>
                </div>
                {pageIndex === state.activePageIndex && (
                    <div className="w-3 h-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full animate-pulse" />
                )}
            </div>
            
            <div
                id={`whiteboard-page-${page.id}`}
                className={`mt-4 relative ${themeClasses.shadow} rounded-2xl overflow-hidden bg-white border-4 ${
                    pageIndex === state.activePageIndex
                        ? `border-indigo-200 ring-4 ${themeClasses.ring}`
                        : 'border-gray-200'
                } transition-all duration-300`}
            >
                <canvas
                    ref={el => {
                        if (canvasRefs.current) {
                            canvasRefs.current[pageIndex] = el;
                        }
                    }}
                    className={`block transition-all ${
                        state.currentTool === 'pan' ? 'cursor-grab' :
                        state.isPanning ? 'cursor-grabbing' :
                        state.currentTool === 'eraser' ? 'cursor-none' : 'cursor-crosshair'
                    }`}
                    onMouseDown={(e) => handleStart(e, pageIndex)}
                    onTouchStart={(e) => handleStart(e, pageIndex)}
                    width={canvasWidth}
                    height={canvasHeight}
                />
                <canvas
                    ref={el => {
                        if (overlayCanvasRefs.current) {
                            overlayCanvasRefs.current[pageIndex] = el;
                        }
                    }}
                    className="absolute top-0 left-0 block pointer-events-none"
                    width={canvasWidth}
                    height={canvasHeight}
                />
            </div>
            
            {pageIndex === state.pages.length - 1 && (
                <div className="mt-12 flex justify-center">
                    <button
                        onClick={addPage}
                        className={`group px-8 py-4 rounded-2xl ${themeClasses.surface} ${themeClasses.surfaceHover} border-2 border-dashed ${themeClasses.border} transition-all hover:scale-105 flex items-center gap-3`}
                    >
                        <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center group-hover:rotate-90 transition-transform duration-300">
                            <Plus className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-left">
                            <div className="font-semibold">Add Page</div>
                        </div>
                    </button>
                </div>
            )}
        </div>
    );
};

export default CanvasPage;