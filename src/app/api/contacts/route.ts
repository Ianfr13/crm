import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  // In a real scenario, this would fetch from Supabase
  // const { data } = await supabase.from('Chat').select('*')...
  
  const contacts = [
    { id: 1, name: "Carlos Machado", role: "CEO", email: "carlos@techs.com", phone: "+55 11 9999-0000", tags: ["Cliente"], status: "active", value: "R$ 15k" },
    { id: 2, name: "Ana Silva", role: "Gerente", email: "ana@grupo.com", phone: "+55 11 9888-1111", tags: ["Lead"], status: "pending", value: "R$ 5k" },
    { id: 3, name: "Roberto Dias", role: "Dev", email: "rob@soft.io", phone: "+55 21 9777-2222", tags: ["Parceiro"], status: "inactive", value: "R$ 0" },
    { id: 4, name: "Lucia Ferreira", role: "Design", email: "lucia@art.com", phone: "+55 31 9666-3333", tags: ["VIP"], status: "active", value: "R$ 8k" },
    { id: 5, name: "Marcos Paulo", role: "CTO", email: "marc@web.net", phone: "+55 41 9555-4444", tags: ["Novo"], status: "active", value: "R$ 22k" },
  ];
  
  return NextResponse.json(contacts);
}
