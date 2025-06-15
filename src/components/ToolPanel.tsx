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
            className="fixed inset-0 bg-black/50 z-40 flex items-center justify-start p-4"
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    setState(prev => ({ ...prev, showLeftPanel: false }));
                }
            }}
        >
            <div 
                className={`${themeClasses.modal} border ${themeClasses.border} rounded-lg p-6 ${themeClasses.shadow} max-w-xs w-full`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className={`text-lg font-semibold ${themeClasses.text}`}>Tools</h2>
                    <button
                        onClick={() => setState(prev => ({ ...prev, showLeftPanel: false }))}
                        className={`w-8 h-8 ${themeClasses.surface} ${themeClasses.surfaceHover} rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110`}
                    >
                        <svg className={`w-4 h-4 ${themeClasses.text}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                    {TOOLS.map(tool => (
                        <button
                            key={tool.id}
                            onClick={() => setState(prev => ({ ...prev, currentTool: tool.id }))}
                            className={`p-4 rounded-lg transition-all border ${
                                state.currentTool === tool.id 
                                    ? `${themeClasses.accent} text-white border-blue-600` 
                                    : `${themeClasses.surface} ${themeClasses.surfaceHover} ${themeClasses.border}`
                            }`}
                        >
                            <div className="flex flex-col items-center gap-2">
                                <tool.icon className="w-6 h-6" />
                                <div className="text-center">
                                    <div className="font-medium text-sm">{tool.name}</div>
                                    <div className={`text-xs ${
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