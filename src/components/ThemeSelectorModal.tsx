import React from "react";
import { X, Palette, Sparkles, Check } from "lucide-react";
import ThemeSelectorView from "./ThemeSelectorView";

interface ThemeSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentThemeId: string;
  onSelectTheme: (themeId: string) => void;
}

export default function ThemeSelectorModal({
  isOpen,
  onClose,
  currentThemeId,
  onSelectTheme
}: ThemeSelectorModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in">
      
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-scale-up">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                Select Workspace Theme
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-pink-100 text-pink-700 rounded-full border border-pink-200 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-pink-600" />
                  Always SaaS Cyberpunk Loaded
                </span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Choose a color theme to instantly customize workspace buttons, highlights, swatches, and layouts.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          <ThemeSelectorView
            currentThemeId={currentThemeId}
            onSelectTheme={(id) => {
              onSelectTheme(id);
            }}
          />
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Selections are automatically saved to browser storage.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>

    </div>
  );
}
