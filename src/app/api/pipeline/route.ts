import { NextResponse } from 'next/server';

export const runtime = 'edge';

// Mock initial state
let stages = [
  { id: 'lead', title: 'Leads', color: 'bg-blue-500' },
  { id: 'contact', title: 'Contato', color: 'bg-violet-500' },
  { id: 'proposal', title: 'Proposta', color: 'bg-amber-500' },
  { id: 'negotiation', title: 'Negociação', color: 'bg-orange-500' },
  { id: 'closed', title: 'Fechado', color: 'bg-emerald-500' },
];

let cards = [
  { id: 1, stage: 'lead', name: 'Tech Solutions Ltd', value: 'R$ 15k', tags: ['Quente'], role: 'Lead', email: 'contact@tech.com', phone: '123' },
  { id: 2, stage: 'lead', name: 'Grupo Alpha', value: 'R$ 8.5k', tags: ['Indicação'], role: 'Lead', email: 'contact@alpha.com', phone: '123' },
  { id: 3, stage: 'contact', name: 'StartUp Innov', value: 'R$ 12k', tags: ['SaaS'], role: 'Lead', email: 'contact@innov.com', phone: '123' },
  { id: 4, stage: 'proposal', name: 'Mega Corp', value: 'R$ 45k', tags: ['Urgente'], role: 'Lead', email: 'contact@mega.com', phone: '123' },
  { id: 5, stage: 'negotiation', name: 'Beta Inc', value: 'R$ 22k', tags: [], role: 'Lead', email: 'contact@beta.com', phone: '123' },
];

export async function GET() {
  return NextResponse.json({ stages, cards });
}

export async function POST(request: Request) {
  const body = await request.json();
  
  // Handle "Move Card"
  if (body.action === 'move') {
    const { cardId, targetStage } = body;
    cards = cards.map(c => c.id === cardId ? { ...c, stage: targetStage } : c);
    return NextResponse.json({ success: true, cards });
  }

  // Handle "Create Card"
  if (body.action === 'create') {
    const newCard = {
        id: Date.now(), 
        stage: body.data.stage, 
        name: body.data.name, 
        value: body.data.value, 
        tags: ['Novo'],
        role: 'Lead',
        email: 'pendente@email.com',
        phone: body.data.phone
    };
    cards.push(newCard);
    return NextResponse.json({ success: true, card: newCard });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
