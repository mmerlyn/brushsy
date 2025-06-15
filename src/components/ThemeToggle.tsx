import React from 'react';
import { Sun, Moon } from 'lucide-react';
import type { AppState } from '../types/types';

interface ThemeToggleProps {
    isDarkTheme: boolean;
    setState: React.Dispatch<React.SetStateAction<AppState>>;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDarkTheme, setState }) => {
    const themeClasses = isDarkTheme ? {
        surface: 'bg-slate-700/80',
        surfaceHover: 'hover:bg-slate-600/80',
        border: 'border-slate-600/30',
        shadow: 'shadow-2xl shadow-black/20'
    } : {
        surface: 'bg-slate-100/80',
        surfaceHover: 'hover:bg-slate-200/80',
        border: 'border-slate-200/50',
        shadow: 'shadow-xl shadow-slate-200/40'
    };

    return (
        <div className="fixed top-8 right-8 z-50">
            <button
                onClick={() => setState(prev => ({ ...prev, isDarkTheme: !prev.isDarkTheme }))}
                className={`w-12 h-12 ${themeClasses.surface} ${themeClasses.surfaceHover} ${themeClasses.border} border rounded-2xl ${themeClasses.shadow} flex items-center justify-center transition-all duration-300 hover:scale-110 group`}
            >
                {isDarkTheme ? 
                    <Sun className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" /> : 
                    <Moon className="w-6 h-6 group-hover:-rotate-12 transition-transform duration-300" />
                }
            </button>
        </div>
    );
};

export default ThemeToggle;