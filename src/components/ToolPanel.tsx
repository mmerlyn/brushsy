import React from 'react';
//import { X, Hexagon } from 'lucide-react';
import type { AppState, ThemeClasses } from '../types/types';
import { TOOLS } from '../constants/constants';

interface ToolPanelProps {
    state: AppState;
    setState: React.Dispatch<React.SetStateAction<AppState>>;
    themeClasses: ThemeClasses;
}

const ToolPanel: React.FC<ToolPanelProps> = ({ state, setState, themeClasses }) => {
    if (!state.showLeftPanel) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 z-40 flex items-end sm:items-center justify-center sm:justify-start p-0 sm:p-4"
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    setState(prev => ({ ...prev, showLeftPanel: false }));
                }
            }}
        >
            <div
                className={`${themeClasses.modal} border-t sm:border ${themeClasses.border} rounded-t-2xl sm:rounded-lg p-4 sm:p-6 ${themeClasses.shadow} w-full sm:max-w-xs sm:ml-4`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Mobile drag handle */}
                <div className="sm:hidden flex justify-center mb-3">
                    <div className={`w-12 h-1 ${state.isDarkTheme ? 'bg-gray-600' : 'bg-gray-300'} rounded-full`}></div>
                </div>

                <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <h2 className={`text-base sm:text-lg font-semibold ${themeClasses.text}`}>Tools</h2>
                    <button
                        onClick={() => setState(prev => ({ ...prev, showLeftPanel: false }))}
                        className={`w-8 h-8 ${themeClasses.surface} ${themeClasses.surfaceHover} rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95`}
                    >
                        <svg className={`w-4 h-4 ${themeClasses.text}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-2 gap-2 sm:gap-3">
                    {TOOLS.map(tool => (
                        <button
                            key={tool.id}
                            onClick={() => {
                                setState(prev => ({ ...prev, currentTool: tool.id, selectedStrokeIds: [] }));
                                // Auto-close panel on mobile after selection
                                if (window.innerWidth < 640) {
                                    setState(prev => ({ ...prev, showLeftPanel: false }));
                                }
                            }}
                            className={`p-2 sm:p-4 rounded-lg transition-all border active:scale-95 ${
                                state.currentTool === tool.id
                                    ? `${themeClasses.accent} text-white border-blue-600`
                                    : `${themeClasses.surface} ${themeClasses.surfaceHover} ${themeClasses.border}`
                            }`}
                        >
                            <div className="flex flex-col items-center gap-1 sm:gap-2">
                                <tool.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                                <div className="text-center">
                                    <div className="font-medium text-xs sm:text-sm">{tool.name}</div>
                                    <div className={`text-[10px] sm:text-xs hidden sm:block ${
                                        state.currentTool === tool.id
                                            ? 'text-blue-100'
                                            : themeClasses.textSecondary
                                    }`}>
                                        {tool.shortcut}
                                    </div>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ToolPanel;