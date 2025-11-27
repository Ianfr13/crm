'use client';

import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Users, 
  KanbanSquare, 
  Zap, 
  Settings, 
  LogOut 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { CRMAvatar } from '@/components/ui/crm-avatar';
import { useCRMTheme } from '@/providers/crm-theme-provider';
import { useRouter, usePathname } from 'next/navigation';
import { SettingsModal } from '@/components/modals/settings-modal';

export const CRMSidebar = () => {
  const { themeColor, isDark, setThemeColor, toggleTheme } = useCRMTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'inbox', path: '/inbox', icon: MessageSquare, label: 'Inbox', badge: 3 },
    { id: 'contacts', path: '/contacts', icon: Users, label: 'Contatos' },
    { id: 'pipeline', path: '/pipeline', icon: KanbanSquare, label: 'Pipeline' },
    { id: 'integration', path: '/integration', icon: Zap, label: 'Integração' },
  ];

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <>
    <aside className={cn(
      "w-60 border-r flex flex-col h-full sticky top-0 transition-colors duration-300",
      isDark ? "border-zinc-800 bg-zinc-900/50 backdrop-blur-xl" : "border-zinc-200 bg-white/70 backdrop-blur-xl"
    )}>
      {/* Logo Area - AUMENTADO */}
      <div className={cn("h-32 flex items-center justify-center border-b", isDark ? "border-zinc-800/50" : "border-zinc-200/50")}>
        <div className="relative h-20 w-20 flex items-center justify-center transition-transform hover:scale-105 cursor-pointer">
            <img 
              src="https://i.postimg.cc/25tSrv5C/LOGO-19.png" 
              alt="UazAPI Logo" 
              className={cn(
                "h-full w-full object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.15)]",
                !isDark && "brightness-0 opacity-80"
              )} 
            />
        </div>
      </div>

      <nav className="flex-1 px-2 space-y-0.5 py-4">
        <p className="px-3 text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-2 opacity-70">Menu</p>
        {menuItems.map((item) => {
          const isActive = pathname === item.path || (item.path === '/dashboard' && pathname === '/');
          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.path)}
              className={cn(
                "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 group relative",
                isActive 
                  ? `bg-${themeColor}-500/10 text-${themeColor}-500` 
                  : isDark ? "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-100" : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
              )}
            >
              <item.icon className={cn("h-4 w-4 transition-colors", isActive ? `text-${themeColor}-500` : "text-zinc-500 group-hover:text-zinc-400")} />
              {item.label}
              {item.badge && (
                <span className={`ml-auto bg-${themeColor}-500 text-white text-[9px] font-bold px-1.5 py-0 rounded-full`}>
                  {item.badge}
                </span>
              )}
              {isActive && <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-${themeColor}-500 rounded-r-full`} />}
            </button>
          );
        })}
      </nav>

      {/* Footer Compacto com Configurações */}
      <div className={cn("p-3 border-t space-y-2", isDark ? "border-zinc-800/50" : "border-zinc-200")}>
        
        <button 
            onClick={() => setSettingsOpen(true)}
            className={cn("w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-colors", isDark ? "text-zinc-400 hover:bg-zinc-800" : "text-zinc-500 hover:bg-zinc-100")}
        >
            <Settings className="h-4 w-4" />
            <span>Configurações</span>
        </button>

        <div className={cn(
          "rounded-lg p-2 flex items-center gap-2 backdrop-blur-sm border transition-colors",
          isDark ? "bg-zinc-800/40 border-zinc-700/50" : "bg-zinc-50 border-zinc-200"
        )}>
          <CRMAvatar initials="JD" themeColor={themeColor} size="sm" />
          <div className="flex-1 min-w-0">
            <p className={cn("text-xs font-semibold truncate", isDark ? "text-zinc-200" : "text-zinc-900")}>João Demo</p>
            <p className="text-[9px] text-zinc-500 truncate">joao@empresa.com</p>
          </div>
          <LogOut className="h-3.5 w-3.5 text-zinc-500 hover:text-red-400 cursor-pointer" />
        </div>
      </div>
    </aside>

    <SettingsModal 
        isOpen={settingsOpen} 
        onClose={() => setSettingsOpen(false)}
        isDark={isDark}
        themeColor={themeColor}
        setThemeColor={setThemeColor}
        toggleTheme={toggleTheme}
    />
    </>
  );
};
