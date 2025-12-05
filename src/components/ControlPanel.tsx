import React from 'react';
//import { Edit3, Palette, Layers, Undo, Redo, Grid, Download, Plus, Trash2, X, FileText, Loader } from 'lucide-react';
import type { AppState, ThemeClasses } from '../types/types';
import { COLORS } from '../constants/constants';

interface ControlPanelProps {
    state: AppState;
    setState: React.Dispatch<React.SetStateAction<AppState>>;
    themeClasses: ThemeClasses;
    undo: () => void;
    redo: () => void;
    addPage: () => void;
    deletePage: (pageIndex: number) => void;
    exportPNG: () => void;
    exportPDF: () => void;
    scrollToPage: (pageIndex: number) => void;
    isExporting: boolean;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
    state,
    setState,
    themeClasses,
    undo,
    redo,
    addPage,
    deletePage,
    exportPNG,
    exportPDF,
    scrollToPage,
    isExporting
}) => {
    if (!state.showRightPanel) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 z-40 flex items-end sm:items-center justify-center sm:justify-end p-0 sm:p-4"
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    setState(prev => ({ ...prev, showRightPanel: false }));
                }
            }}
        >
            <div
                className={`${themeClasses.modal} border-t sm:border ${themeClasses.border} rounded-t-2xl sm:rounded-lg p-4 sm:p-6 ${themeClasses.shadow} w-full sm:max-w-sm max-h-[85vh] sm:max-h-[90vh] overflow-y-auto`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Mobile drag handle */}
                <div className="sm:hidden flex justify-center mb-3">
                    <div className={`w-12 h-1 ${state.isDarkTheme ? 'bg-gray-600' : 'bg-gray-300'} rounded-full`}></div>
                </div>
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 ${state.isDarkTheme ? 'bg-purple-900/50' : 'bg-purple-100'} rounded-xl flex items-center justify-center`}>
                            <svg className={`w-5 h-5 ${state.isDarkTheme ? 'text-purple-400' : 'text-purple-600'}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                        </div>
                        <h2 className={`text-lg font-semibold ${themeClasses.text}`}>Controls</h2>
                    </div>
                    <button
                        onClick={() => setState(prev => ({ ...prev, showRightPanel: false }))}
                        className={`w-8 h-8 ${themeClasses.surface} hover:bg-red-100 hover:text-red-600 ${state.isDarkTheme ? 'hover:bg-red-900/50 hover:text-red-400' : ''} rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110`}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-4">
                        <div className={`w-6 h-6 ${state.isDarkTheme ? 'bg-green-900/50' : 'bg-green-100'} rounded-lg flex items-center justify-center`}>
                            <svg className={`w-4 h-4 ${state.isDarkTheme ? 'text-green-400' : 'text-green-600'}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42" />
                            </svg>
                        </div>
                        <h3 className={`text-sm font-semibold ${themeClasses.text}`}>Brush Settings</h3>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className={`text-sm ${themeClasses.text}`}>Size</label>
                                <span className={`text-sm font-mono ${themeClasses.surface} px-2 py-1 rounded`}>
                                    {state.brushSize}px
                                </span>
                            </div>
                            <input
                                type="range"
                                min="1"
                                max="50"
                                value={state.brushSize}
                                onChange={(e) => setState(prev => ({ ...prev, brushSize: Number(e.target.value) }))}
                                className={`w-full h-2 ${state.isDarkTheme ? 'bg-gray-600' : 'bg-gray-200'} rounded-lg appearance-none cursor-pointer`}
                            />
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className={`text-sm ${themeClasses.text}`}>Opacity</label>
                                <span className={`text-sm font-mono ${themeClasses.surface} px-2 py-1 rounded`}>
                                    {state.brushOpacity}%
                                </span>
                            </div>
                            <input
                                type="range"
                                min="1"
                                max="100"
                                value={state.brushOpacity}
                                onChange={(e) => setState(prev => ({ ...prev, brushOpacity: Number(e.target.value) }))}
                                className={`w-full h-2 ${state.isDarkTheme ? 'bg-gray-600' : 'bg-gray-200'} rounded-lg appearance-none cursor-pointer`}
                            />
                        </div>
                    </div>
                </div>

                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-4">
                        <div className={`w-6 h-6 ${state.isDarkTheme ? 'bg-pink-900/50' : 'bg-pink-100'} rounded-lg flex items-center justify-center`}>
                            <svg className={`w-4 h-4 ${state.isDarkTheme ? 'text-pink-400' : 'text-pink-600'}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672ZM12 2.25V4.5m5.834.166-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243-1.59-1.59" />
                            </svg>
                        </div>
                        <h3 className={`text-sm font-semibold ${themeClasses.text}`}>Color Palette</h3>
                    </div>
                    <div className="grid grid-cols-8 gap-2 mb-4">
                        {COLORS.map((color, index) => (
                            <button
                                key={`${color}-${index}`}
                                onClick={() => setState(prev => ({ ...prev, currentColor: color }))}
                                className={`w-8 h-8 rounded border-2 transition-all ${
                                    state.currentColor === color
                                        ? 'border-purple-500 ring-2 ring-purple-200'
                                        : `${themeClasses.border} hover:border-purple-300`
                                }`}
                                style={{ backgroundColor: color }}
                            />
                        ))}
                    </div>
                    <div>
                        <label className={`text-sm font-medium mb-2 block ${themeClasses.text}`}>Custom Color</label>
                        <input
                            type="color"
                            value={state.currentColor}
                            onChange={(e) => setState(prev => ({ ...prev, currentColor: e.target.value }))}
                            className={`w-full h-10 rounded border ${themeClasses.border} cursor-pointer`}
                        />
                    </div>
                </div>

                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-4">
                        <div className={`w-6 h-6 ${state.isDarkTheme ? 'bg-orange-900/50' : 'bg-orange-100'} rounded-lg flex items-center justify-center`}>
                            <svg className={`w-4 h-4 ${state.isDarkTheme ? 'text-orange-400' : 'text-orange-600'}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5 10.5 20.25 20.25 10.5a8.25 8.25 0 0 0-16.5 0Z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 7.5a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z" />
                            </svg>
                        </div>
                        <h3 className={`text-sm font-semibold ${themeClasses.text}`}>Quick Actions</h3>
                    </div>
                    <div className="flex gap-2 mb-3">
                        <button
                            onClick={undo}
                            disabled={state.pages[state.activePageIndex]?.historyIndex === 0}
                            className={`flex-1 p-3 rounded-xl ${themeClasses.surface} ${themeClasses.surfaceHover} disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 flex items-center justify-center gap-2 text-sm font-medium`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
                            </svg>
                            Undo
                        </button>
                        <button
                            onClick={redo}
                            disabled={state.pages[state.activePageIndex]?.historyIndex === state.pages[state.activePageIndex]?.history.length - 1}
                            className={`flex-1 p-3 rounded-xl ${themeClasses.surface} ${themeClasses.surfaceHover} disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 flex items-center justify-center gap-2 text-sm font-medium`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m15 15 6-6m0 0-6-6m6 6H9a6 6 0 0 0 0 12h3" />
                            </svg>
                            Redo
                        </button>
                    </div>
                    <button
                        onClick={() => setState(prev => ({ ...prev, showGrid: !prev.showGrid }))}
                        className={`w-full p-3 rounded-xl transition-all hover:scale-105 flex items-center justify-center gap-2 text-sm font-medium ${
                            state.showGrid
                                ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-lg shadow-purple-500/25'
                                : `${themeClasses.surface} ${themeClasses.surfaceHover}`
                        }`}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
                        </svg>
                        {state.showGrid ? 'Hide Grid' : 'Show Grid'}
                    </button>
                </div>

                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-4">
                        <div className={`w-6 h-6 ${state.isDarkTheme ? 'bg-purple-900/50' : 'bg-purple-100'} rounded-lg flex items-center justify-center`}>
                            <svg className={`w-4 h-4 ${state.isDarkTheme ? 'text-purple-400' : 'text-purple-600'}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                            </svg>
                        </div>
                        <h3 className={`text-sm font-semibold ${themeClasses.text}`}>Page Management</h3>
                    </div>
                    <div className="text-center mb-3">
                        <span className={`text-sm ${themeClasses.surface} px-3 py-1 rounded-lg font-medium`}>
                            {state.activePageIndex + 1} of {state.pages.length}
                        </span>
                    </div>
                    <div className="grid grid-cols-6 gap-2 mb-3">
                        {state.pages.map((page, index) => (
                            <button
                                key={page.id}
                                onClick={() => scrollToPage(index)}
                                className={`aspect-square rounded-lg text-sm font-medium transition-all hover:scale-110 ${
                                    index === state.activePageIndex
                                        ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-lg shadow-purple-500/25'
                                        : `${themeClasses.surface} ${themeClasses.surfaceHover}`
                                }`}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={addPage}
                            className={`flex-1 p-3 rounded-xl border-2 border-dashed ${themeClasses.border} hover:border-purple-400 ${state.isDarkTheme ? 'hover:bg-purple-900/20' : 'hover:bg-purple-50'} transition-all hover:scale-105 flex items-center justify-center gap-2 text-sm font-medium`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            Add Page
                        </button>
                        {state.pages.length > 1 && (
                            <button
                                onClick={() => deletePage(state.activePageIndex)}
                                className={`p-3 rounded-xl ${state.isDarkTheme ? 'bg-red-900/50 hover:bg-red-900/70 text-red-400' : 'bg-red-100 hover:bg-red-200 text-red-600'} transition-all hover:scale-110`}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>

                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <div className={`w-6 h-6 ${state.isDarkTheme ? 'bg-purple-900/50' : 'bg-purple-100'} rounded-lg flex items-center justify-center`}>
                            <svg className={`w-4 h-4 ${state.isDarkTheme ? 'text-purple-400' : 'text-purple-600'}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                            </svg>
                        </div>
                        <h3 className={`text-sm font-semibold ${themeClasses.text}`}>Export Options</h3>
                    </div>
                    <div className="space-y-3">
                        <button
                            onClick={exportPNG}
                            disabled={isExporting}
                            className={`w-full p-4 rounded-xl ${themeClasses.surface} ${themeClasses.surfaceHover} disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 flex items-center justify-center gap-3 font-medium`}
                        >
                            <div className={`w-6 h-6 ${state.isDarkTheme ? 'bg-gray-600' : 'bg-gray-600'} rounded-lg flex items-center justify-center`}>
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                </svg>
                            </div>
                            <div className="text-left">
                                <div className="font-semibold">Export PNG</div>
                                <div className={`text-xs ${themeClasses.textSecondary}`}>Current page only</div>
                            </div>
                        </button>
                        <button
                            onClick={exportPDF}
                            disabled={isExporting}
                            className="w-full p-4 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-all hover:scale-105 flex items-center justify-center gap-3 font-medium shadow-lg shadow-purple-500/25"
                        >
                            <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center">
                                {isExporting ? (
                                    <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                                    </svg>
                                ) : (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                    </svg>
                                )}
                            </div>
                            <div className="text-left">
                                <div className="font-semibold">{isExporting ? 'Generating...' : 'Export PDF'}</div>
                                <div className="text-xs text-purple-100">{isExporting ? 'Please wait' : 'All pages included'}</div>
                            </div>
                        </button>
                    </div>
                    <div className={`mt-4 text-center p-3 ${state.isDarkTheme ? 'bg-gray-800/50' : 'bg-gray-50'} rounded-xl`}>
                        <p className={`text-xs font-medium ${themeClasses.textSecondary}`}>
                            ⌨️ Shortcuts: Ctrl+S (PNG) • Ctrl+P (PDF)
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ControlPanel;