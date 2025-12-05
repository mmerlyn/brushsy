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
        <div className="relative group w-full max-w-4xl px-2 sm:px-4">
            <div className={`absolute -top-6 left-2 sm:left-4 flex items-center gap-2 sm:gap-3`}>
                <div className={`px-2 py-1 rounded-full transition-all text-xs sm:text-sm ${
                    pageIndex === state.activePageIndex
                        ? `${themeClasses.accent} text-white ${themeClasses.shadow}`
                        : `${themeClasses.surface} ${themeClasses.text}`
                }`}>
                    <span className="font-semibold">Page {pageIndex + 1}</span>
                </div>
                {pageIndex === state.activePageIndex && (
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full animate-pulse" />
                )}
            </div>

            <div
                id={`whiteboard-page-${page.id}`}
                className={`mt-4 relative ${themeClasses.shadow} rounded-lg sm:rounded-2xl overflow-hidden bg-white border-2 sm:border-4 ${
                    pageIndex === state.activePageIndex
                        ? `border-indigo-200 ring-2 sm:ring-4 ${themeClasses.ring}`
                        : 'border-gray-200'
                } transition-all duration-300`}
                style={{
                    aspectRatio: `${canvasWidth} / ${canvasHeight}`,
                }}
            >
                <canvas
                    ref={el => {
                        if (canvasRefs.current) {
                            canvasRefs.current[pageIndex] = el;
                        }
                    }}
                    className={`block w-full h-full transition-all ${
                        state.currentTool === 'pan' ? 'cursor-grab' :
                        state.isPanning ? 'cursor-grabbing' :
                        state.currentTool === 'eraser' ? 'cursor-none' : 'cursor-crosshair'
                    }`}
                    style={{
                        touchAction: 'none',
                    }}
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
                    className="absolute top-0 left-0 block w-full h-full pointer-events-none"
                    width={canvasWidth}
                    height={canvasHeight}
                />
            </div>

            {pageIndex === state.pages.length - 1 && (
                <div className="mt-8 sm:mt-12 flex justify-center">
                    <button
                        onClick={addPage}
                        className={`group px-4 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl ${themeClasses.surface} ${themeClasses.surfaceHover} border-2 border-dashed ${themeClasses.border} transition-all hover:scale-105 active:scale-95 flex items-center gap-2 sm:gap-3`}
                    >
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center group-hover:rotate-90 transition-transform duration-300">
                            <Plus className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <div className="text-left">
                            <div className="font-semibold text-sm sm:text-base">Add Page</div>
                        </div>
                    </button>
                </div>
            )}
        </div>
    );
};

export default CanvasPage;