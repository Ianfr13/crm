
// Tailwind Safelist for Dynamic Theme Colors
// We use these classes dynamically: bg-${themeColor}-600, text-${themeColor}-500, etc.

export const safelist = [
  // Backgrounds
  "bg-indigo-600 bg-emerald-600 bg-rose-600 bg-amber-600 bg-cyan-600 bg-violet-600 bg-blue-600",
  "bg-indigo-500 bg-emerald-500 bg-rose-500 bg-amber-500 bg-cyan-500 bg-violet-500 bg-blue-500",
  "bg-indigo-100 bg-emerald-100 bg-rose-100 bg-amber-100 bg-cyan-100 bg-violet-100 bg-blue-100",
  
  // Backgrounds with Opacity
  "bg-indigo-500/10 bg-emerald-500/10 bg-rose-500/10 bg-amber-500/10 bg-cyan-500/10 bg-violet-500/10 bg-blue-500/10",
  "bg-indigo-500/20 bg-emerald-500/20 bg-rose-500/20 bg-amber-500/20 bg-cyan-500/20 bg-violet-500/20 bg-blue-500/20",
  "bg-indigo-500/40 bg-emerald-500/40 bg-rose-500/40 bg-amber-500/40 bg-cyan-500/40 bg-violet-500/40 bg-blue-500/40",

  // Texts
  "text-indigo-500 text-emerald-500 text-rose-500 text-amber-500 text-cyan-500 text-violet-500 text-blue-500",
  "text-indigo-600 text-emerald-600 text-rose-600 text-amber-600 text-cyan-600 text-violet-600 text-blue-600",
  "text-indigo-100 text-emerald-100 text-rose-100 text-amber-100 text-cyan-100 text-violet-100 text-blue-100",

  // Borders
  "border-indigo-500 border-emerald-500 border-rose-500 border-amber-500 border-cyan-500 border-violet-500 border-blue-500",
  "border-indigo-500/20 border-emerald-500/20 border-rose-500/20 border-amber-500/20 border-cyan-500/20 border-violet-500/20 border-blue-500/20",

  // Shadows
  "shadow-indigo-500/25 shadow-emerald-500/25 shadow-rose-500/25 shadow-amber-500/25 shadow-cyan-500/25 shadow-violet-500/25 shadow-blue-500/25",

  // Rings
  "focus:ring-indigo-500 focus:ring-emerald-500 focus:ring-rose-500 focus:ring-amber-500 focus:ring-cyan-500 focus:ring-violet-500 focus:ring-blue-500",
  "focus:border-indigo-500 focus:border-emerald-500 focus:border-rose-500 focus:border-amber-500 focus:border-cyan-500 focus:border-violet-500 focus:border-blue-500",
  "focus:ring-indigo-500/20 focus:ring-emerald-500/20 focus:ring-rose-500/20 focus:ring-amber-500/20 focus:ring-cyan-500/20 focus:ring-violet-500/20 focus:ring-blue-500/20",
];
