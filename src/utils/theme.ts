export interface ColorTheme {
  id: string;
  name: string;
  subtitle: string;
  mode: "light" | "dark";
  badge: string;
  colors: {
    bgDeep: string;
    bgMidnight: string;
    bgSurface: string;
    bgElevated: string;
    primary: string;
    primaryHover: string;
    secondary: string;
    accentCyan: string;
    accentCoral: string;
    accentGold: string;
    textMuted: string;
    textMain: string;
  };
  previewGradient: string;
}

export const COLOR_THEMES: ColorTheme[] = [
  {
    id: "always-saas",
    name: "Always SaaS Neon",
    subtitle: "Ship AI Apps One Subdomain At A Time",
    mode: "dark",
    badge: "Featured SaaS Cyberpunk",
    colors: {
      bgDeep: "#0A0A18",
      bgMidnight: "#15102A",
      bgSurface: "#1E1838",
      bgElevated: "#281F4A",
      primary: "#FF5EBE",
      primaryHover: "#FF7EC8",
      secondary: "#8B5CF6",
      accentCyan: "#5EE1FF",
      accentCoral: "#FF8A5B",
      accentGold: "#FFB86C",
      textMuted: "#C4B8E0",
      textMain: "#FFFFFF"
    },
    previewGradient: "from-[#FF5EBE] via-[#8B5CF6] to-[#5EE1FF]"
  },
  {
    id: "indigo-enterprise",
    name: "Indigo Enterprise",
    subtitle: "Standard High-Contrast Corporate GRC",
    mode: "light",
    badge: "Default Classic",
    colors: {
      bgDeep: "#F8FAFC",
      bgMidnight: "#FFFFFF",
      bgSurface: "#F1F5F9",
      bgElevated: "#E2E8F0",
      primary: "#4F46E5",
      primaryHover: "#4338CA",
      secondary: "#6366F1",
      accentCyan: "#0284C7",
      accentCoral: "#F43F5E",
      accentGold: "#D97706",
      textMuted: "#64748B",
      textMain: "#0F172A"
    },
    previewGradient: "from-[#4F46E5] via-[#6366F1] to-[#0284C7]"
  },
  {
    id: "emerald-security",
    name: "Emerald Safeguard",
    subtitle: "Forest Cyber Defense Operations",
    mode: "dark",
    badge: "Security Ops",
    colors: {
      bgDeep: "#061A14",
      bgMidnight: "#0B2920",
      bgSurface: "#13382C",
      bgElevated: "#1C4839",
      primary: "#10B981",
      primaryHover: "#34D399",
      secondary: "#059669",
      accentCyan: "#2DD4BF",
      accentCoral: "#FB7185",
      accentGold: "#F59E0B",
      textMuted: "#A7F3D0",
      textMain: "#F0FDF4"
    },
    previewGradient: "from-[#10B981] via-[#059669] to-[#2DD4BF]"
  },
  {
    id: "obsidian-gold",
    name: "Obsidian Gold",
    subtitle: "Luxury Dark Canvas & Amber Glow",
    mode: "dark",
    badge: "Executive Dark",
    colors: {
      bgDeep: "#0F172A",
      bgMidnight: "#1E293B",
      bgSurface: "#334155",
      bgElevated: "#475569",
      primary: "#F59E0B",
      primaryHover: "#FBBF24",
      secondary: "#D97706",
      accentCyan: "#38BDF8",
      accentCoral: "#F43F5E",
      accentGold: "#FEF08A",
      textMuted: "#CBD5E1",
      textMain: "#F8FAFC"
    },
    previewGradient: "from-[#F59E0B] via-[#D97706] to-[#38BDF8]"
  },
  {
    id: "royal-amethyst",
    name: "Royal Amethyst",
    subtitle: "Violet Canvas & Luminous Magenta",
    mode: "dark",
    badge: "Amethyst Glow",
    colors: {
      bgDeep: "#0F0C1B",
      bgMidnight: "#18122B",
      bgSurface: "#251B3E",
      bgElevated: "#342553",
      primary: "#D946EF",
      primaryHover: "#F0ABFC",
      secondary: "#A855F7",
      accentCyan: "#38BDF8",
      accentCoral: "#FF6B81",
      accentGold: "#FACC15",
      textMuted: "#D8B4FE",
      textMain: "#FAF5FF"
    },
    previewGradient: "from-[#D946EF] via-[#A855F7] to-[#38BDF8]"
  },
  {
    id: "oceanic-blue",
    name: "Oceanic Marine",
    subtitle: "Deep Navy & Vivid Cyan Highlights",
    mode: "dark",
    badge: "Marine Tech",
    colors: {
      bgDeep: "#08101E",
      bgMidnight: "#0F1C2E",
      bgSurface: "#172A45",
      bgElevated: "#213859",
      primary: "#0EA5E9",
      primaryHover: "#38BDF8",
      secondary: "#2563EB",
      accentCyan: "#06B6D4",
      accentCoral: "#F43F5E",
      accentGold: "#EAB308",
      textMuted: "#BAE6FD",
      textMain: "#F0F9FF"
    },
    previewGradient: "from-[#0EA5E9] via-[#2563EB] to-[#06B6D4]"
  }
];

export const STORAGE_KEY_THEME = "ai_grc_active_theme_id";

export function getStoredThemeId(): string {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_THEME);
    if (saved && COLOR_THEMES.some((t) => t.id === saved)) {
      return saved;
    }
  } catch (err) {
    // ignore localstorage errors
  }
  return "indigo-enterprise"; // default
}

export function applyTheme(themeId: string) {
  const theme = COLOR_THEMES.find((t) => t.id === themeId) || COLOR_THEMES[0];
  const root = document.documentElement;

  // Set data-theme attribute on root element
  root.setAttribute("data-theme", theme.id);

  // Set CSS Custom Properties on documentElement
  root.style.setProperty("--bg-deep", theme.colors.bgDeep);
  root.style.setProperty("--bg-midnight", theme.colors.bgMidnight);
  root.style.setProperty("--bg-surface", theme.colors.bgSurface);
  root.style.setProperty("--bg-elevated", theme.colors.bgElevated);
  root.style.setProperty("--primary", theme.colors.primary);
  root.style.setProperty("--primary-hover", theme.colors.primaryHover);
  root.style.setProperty("--secondary", theme.colors.secondary);
  root.style.setProperty("--accent-cyan", theme.colors.accentCyan);
  root.style.setProperty("--accent-coral", theme.colors.accentCoral);
  root.style.setProperty("--accent-gold", theme.colors.accentGold);
  root.style.setProperty("--text-muted", theme.colors.textMuted);
  root.style.setProperty("--text-main", theme.colors.textMain);

  try {
    localStorage.setItem(STORAGE_KEY_THEME, theme.id);
  } catch (e) {
    // ignore
  }
}
