import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  // Mock data simulating a database query
  // In a real scenario, this would aggregate data from Supabase tables
  
  const stats = [
    { label: 'Contatos', value: '2,543', change: '+12%', trend: 'up', color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    { label: 'Ativos', value: '45', change: '+5%', trend: 'up', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Pipeline', value: 'R$ 128k', change: '+18%', trend: 'up', color: 'text-violet-500', bg: 'bg-violet-500/10' },
    { label: 'Tempo', value: '12m', change: '-2m', trend: 'down', color: 'text-amber-500', bg: 'bg-amber-500/10' },
  ];

  const activity = [40, 65, 30, 85, 55, 90, 45, 70, 60, 95, 50, 75, 60, 80, 45, 60];

  const topContacts = [
    { id: 1, name: "Carlos Machado", initials: "CM", time: "2m atrás" },
    { id: 2, name: "Ana Silva", initials: "AS", time: "15m atrás" },
    { id: 3, name: "Roberto Dias", initials: "RD", time: "1h atrás" },
    { id: 4, name: "Lucia Ferreira", initials: "LF", time: "3h atrás" },
    { id: 5, name: "Marcos Paulo", initials: "MP", time: "1d atrás" },
  ];

  return NextResponse.json({
    stats,
    activity,
    topContacts
  });
}
