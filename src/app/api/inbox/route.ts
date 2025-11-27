import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  const conversations = [
    { id: 1, name: "Ana Souza", lastMsg: "Podemos agendar?", time: "10:30", unread: 2, online: true, channel: 'whatsapp' },
    { id: 2, name: "Marcos Silva", lastMsg: "Obrigado!", time: "09:15", unread: 0, online: false, channel: 'email' },
    { id: 3, name: "Julia Tech", lastMsg: "Valor do plano?", time: "Ontem", unread: 0, online: true, channel: 'instagram' },
    { id: 4, name: "Pedro H.", lastMsg: "Enviado anexo.", time: "Ontem", unread: 0, online: false, channel: 'whatsapp' },
    { id: 5, name: "Suporte", lastMsg: "Ticket #1234", time: "Seg", unread: 0, online: true, channel: 'facebook' },
  ];

  const messages = [
    { id: 1, sender: 'other', text: 'Olá! Gostaria de saber mais sobre a integração.', time: '10:28' },
    { id: 2, sender: 'me', text: 'Claro, Ana! Nossa API permite envio de mensagens e automação.', time: '10:29' },
  ];

  return NextResponse.json({ conversations, messages });
}
