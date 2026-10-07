import React from "react";
import { Palette, Check, Sparkles, Moon, Sun, Shield, Zap, Layers, RefreshCw } from "lucide-react";
import { COLOR_THEMES, ColorTheme, applyTheme } from "../utils/theme";

interface ThemeSelectorViewProps {
  currentThemeId: string;
  onSelectTheme: (themeId: string) => void;
  compact?: boolean;
}

export default function ThemeSelectorView({
  currentThemeId,
  onSelectTheme,
  compact = false
}: ThemeSelectorViewProps) {
  const handleThemeChange = (themeId: string) => {
    applyTheme(themeId);
    onSelectTheme(themeId);
  };

  const activeThemeObj = COLOR_THEMES.find((t) => t.id === currentThemeId) || COLOR_THEMES[0];

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Info Header */}
      {!compact && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Palette className="w-5 h-5" />
                </span>
                <h2 className="text-xl font-bold text-slate-900">Workspace Appearance & Color Themes</h2>
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 bg-indigo-100 text-indigo-700 rounded-full border border-indigo-200">
                  6 Themes Available
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-2 max-w-2xl leading-relaxed">
                Select your preferred color scheme to personalize the AI GRC Platform workspace. Features the signature <strong className="text-pink-600">Always SaaS Neon Cyberpunk</strong> theme along with high-contrast corporate light, emerald security, and obsidian gold presets.
              </p>
            </div>

            <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200 shrink-0">
              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Active Theme</span>
                <span className="text-xs font-extrabold text-slate-800">{activeThemeObj.name}</span>
              </div>
              <div
                className="w-7 h-7 rounded-lg border border-slate-300 shadow-2xs flex items-center justify-center font-bold text-white text-[10px]"
                style={{ backgroundColor: activeThemeObj.colors.primary }}
              >
                ✓
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid of Theme Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {COLOR_THEMES.map((theme) => {
          const isSelected = theme.id === currentThemeId;

          return (
            <div
              key={theme.id}
              onClick={() => handleThemeChange(theme.id)}
              className={`group relative rounded-2xl border transition-all duration-200 cursor-pointer overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? "border-indigo-600 ring-2 ring-indigo-500/20 shadow-md bg-white"
                  : "border-slate-200 hover:border-slate-300 hover:shadow-xs bg-white"
              }`}
            >
              {/* Card Header & Swatches Preview */}
              <div>
                {/* Visual Swatch Header Bar */}
                <div
                  className="h-28 p-4 flex flex-col justify-between relative overflow-hidden"
                  style={{
                    backgroundColor: theme.colors.bgDeep,
                    backgroundImage: theme.id === "always-saas"
                      ? "radial-gradient(circle at 80% 20%, rgba(255, 94, 190, 0.25) 0%, transparent 60%), radial-gradient(circle at 20% 80%, rgba(139, 92, 246, 0.2) 0%, transparent 60%)"
                      : "none"
                  }}
                >
                  <div className="flex items-center justify-between relative z-10">
                    <span
                      className={`text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border shadow-2xs ${
                        theme.mode === "dark"
                          ? "bg-slate-900/80 text-white border-slate-700"
                          : "bg-white/90 text-slate-800 border-slate-200"
                      }`}
                    >
                      {theme.badge}
                    </span>

                    {theme.mode === "dark" ? (
                      <span className="p-1 bg-slate-900/60 text-indigo-300 rounded-md backdrop-blur-xs">
                        <Moon className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <span className="p-1 bg-amber-100/80 text-amber-700 rounded-md backdrop-blur-xs">
                        <Sun className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>

                  {/* Mock Mini UI Preview Inside Swatch */}
                  <div className="flex items-center gap-2 relative z-10">
                    <div
                      className="px-2.5 py-1 rounded-md text-[10px] font-bold shadow-xs text-white"
                      style={{ backgroundColor: theme.colors.primary }}
                    >
                      Primary Button
                    </div>
                    <div
                      className="px-2 py-1 rounded-md text-[10px] font-semibold border"
                      style={{
                        backgroundColor: theme.colors.bgSurface,
                        borderColor: theme.colors.primary,
                        color: theme.colors.textMuted
                      }}
                    >
                      Badge
                    </div>
                    <div
                      className="w-3 h-3 rounded-full border shadow-2xs"
                      style={{ backgroundColor: theme.colors.accentCyan, borderColor: "rgba(255,255,255,0.4)" }}
                    />
                    <div
                      className="w-3 h-3 rounded-full border shadow-2xs"
                      style={{ backgroundColor: theme.colors.accentCoral, borderColor: "rgba(255,255,255,0.4)" }}
                    />
                  </div>
                </div>

                {/* Card Content & Details */}
                <div className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                        {theme.name}
                        {theme.id === "always-saas" && (
                          <Sparkles className="w-3.5 h-3.5 text-pink-500 animate-pulse" />
                        )}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">{theme.subtitle}</p>
                    </div>

                    {isSelected && (
                      <span className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>

                  {/* Color Palette Palette Bubbles */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                    <span className="font-semibold uppercase tracking-wider">Palette</span>
                    <div className="flex items-center gap-1">
                      <div
                        className="w-4 h-4 rounded-full border border-slate-200"
                        style={{ backgroundColor: theme.colors.bgDeep }}
                        title={`Deep BG: ${theme.colors.bgDeep}`}
                      />
                      <div
                        className="w-4 h-4 rounded-full border border-slate-200"
                        style={{ backgroundColor: theme.colors.bgMidnight }}
                        title={`Surface: ${theme.colors.bgMidnight}`}
                      />
                      <div
                        className="w-4 h-4 rounded-full border border-slate-200"
                        style={{ backgroundColor: theme.colors.primary }}
                        title={`Primary: ${theme.colors.primary}`}
                      />
                      <div
                        className="w-4 h-4 rounded-full border border-slate-200"
                        style={{ backgroundColor: theme.colors.secondary }}
                        title={`Secondary: ${theme.colors.secondary}`}
                      />
                      <div
                        className="w-4 h-4 rounded-full border border-slate-200"
                        style={{ backgroundColor: theme.colors.accentCyan }}
                        title={`Accent Cyan: ${theme.colors.accentCyan}`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] font-mono font-semibold text-slate-400">
                  HEX: {theme.colors.primary}
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleThemeChange(theme.id);
                  }}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                    isSelected
                      ? "bg-indigo-600 text-white shadow-2xs"
                      : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {isSelected ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Active Theme</span>
                    </>
                  ) : (
                    <span>Apply Theme</span>
                  )}
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
