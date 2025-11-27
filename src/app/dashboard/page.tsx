'use client';

import React from 'react';
import { 
  Users, 
  MessageSquare, 
  TrendingUp, 
  Clock, 
  ArrowUpRight 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { CRMButton } from '@/components/ui/crm-button';
import { CRMAvatar } from '@/components/ui/crm-avatar';
import { useCRMTheme } from '@/providers/crm-theme-provider';
import { CRMAuthenticatedLayout } from '@/components/layout/crm-authenticated-layout';

export default function DashboardPage() {
  const { themeColor, isDark } = useCRMTheme();
  const [stats, setStats] = React.useState([
    { label: 'Contatos', value: '0', change: '0%', trend: 'neutral', color: 'text-indigo-500', bg: 'bg-indigo-500/10', icon: Users },
    { label: 'Ativos', value: '0', change: '0%', trend: 'neutral', color: 'text-emerald-500', bg: 'bg-emerald-500/10', icon: MessageSquare },
    { label: 'Pipeline', value: 'R$ 0', change: '0%', trend: 'neutral', color: 'text-violet-500', bg: 'bg-violet-500/10', icon: TrendingUp },
    { label: 'Tempo', value: '0m', change: '0m', trend: 'neutral', color: 'text-amber-500', bg: 'bg-amber-500/10', icon: Clock },
  ]);
  const [activity, setActivity] = React.useState<number[]>([]);
  const [topContacts, setTopContacts] = React.useState<any[]>([]);

  React.useEffect(() => {
    fetch('/api/dashboard')
      .then(res => res.json())
      .then(data => {
        if (data.stats) {
            const icons = [Users, MessageSquare, TrendingUp, Clock];
            setStats(data.stats.map((stat: any, i: number) => ({ ...stat, icon: icons[i] || Users })));
        }
        if (data.activity) setActivity(data.activity);
        if (data.topContacts) setTopContacts(data.topContacts);
      })
      .catch(err => console.error('Failed to fetch dashboard data', err));
  }, []);

  return (
    <CRMAuthenticatedLayout title="Dashboard">
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="flex items-end justify-between border-b pb-2 border-zinc-800/50">
        <div>
          <h1 className={cn("text-xl font-bold tracking-tight", isDark ? "text-white" : "text-zinc-900")}>Dashboard</h1>
          <p className="text-xs text-zinc-500">Visão geral da operação.</p>
        </div>
        <div className="flex gap-2">
            <CRMButton size="sm" variant="secondary" isDark={isDark}>Filtrar</CRMButton>
            <CRMButton size="sm" themeColor={themeColor} isDark={isDark}>Exportar</CRMButton>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {stats.map((stat, i) => (
          <div key={i} className={cn(
            "rounded-xl border p-3 backdrop-blur-sm transition-all hover:-translate-y-0.5",
            isDark ? "bg-zinc-900/40 border-zinc-800" : "bg-white border-zinc-200 shadow-sm"
          )}>
            <div className="flex justify-between items-center mb-2">
              <div className={cn("p-1.5 rounded-lg", stat.bg, stat.color)}>
                <stat.icon className="h-4 w-4" />
              </div>
              <div className={cn("flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium", stat.trend === 'up' ? "text-emerald-500 bg-emerald-500/10" : "text-rose-500 bg-rose-500/10")}>
                {stat.change}
                <ArrowUpRight className={cn("h-2.5 w-2.5", stat.trend === 'up' ? "" : "rotate-90")} />
              </div>
            </div>
            
            <div>
              <p className={cn("text-xl font-bold leading-tight", isDark ? "text-white" : "text-zinc-900")}>{stat.value}</p>
              <h3 className="text-[10px] font-medium text-zinc-500">{stat.label}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className={cn(
          "col-span-2 rounded-xl border p-4 backdrop-blur-sm min-h-[250px]",
          isDark ? "bg-zinc-900/40 border-zinc-800" : "bg-white border-zinc-200 shadow-sm"
        )}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={cn("text-sm font-semibold", isDark ? "text-white" : "text-zinc-900")}>Atividade</h3>
          </div>
          <div className="flex items-end justify-between h-32 gap-1">
             {activity.map((h, i) => (
               <div key={i} className={`flex-1 bg-${themeColor}-500/20 hover:bg-${themeColor}-500/40 rounded-t-sm transition-all relative group`} style={{ height: `${h}%` }} />
             ))}
          </div>
        </div>

        <div className={cn(
          "rounded-xl border p-4 backdrop-blur-sm",
          isDark ? "bg-zinc-900/40 border-zinc-800" : "bg-white border-zinc-200 shadow-sm"
        )}>
          <h3 className={cn("text-sm font-semibold mb-3", isDark ? "text-white" : "text-zinc-900")}>Top Contatos</h3>
          <div className="space-y-2">
            {topContacts.length > 0 ? topContacts.map((contact, i) => (
              <div key={contact.id || i} className={cn("flex items-center gap-2 p-1.5 rounded-lg transition-colors cursor-pointer group", isDark ? "hover:bg-zinc-800/50" : "hover:bg-zinc-50")}>
                <CRMAvatar initials={contact.initials || "U"} size="sm" color={isDark ? "bg-zinc-800 text-zinc-400" : "bg-zinc-100 text-zinc-600"} />
                <div className="flex-1 min-w-0">
                  <p className={cn("text-xs font-medium truncate", isDark ? "text-white" : "text-zinc-900")}>{contact.name}</p>
                  <p className="text-[10px] text-zinc-500">{contact.time}</p>
                </div>
              </div>
            )) : (
                <div className="text-center py-8 text-zinc-500 text-xs">
                    Nenhuma atividade recente.
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </CRMAuthenticatedLayout>
  );
}
