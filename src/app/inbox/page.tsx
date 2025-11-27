'use client';
import { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  MessageCircle, 
  Mail, 
  Instagram, 
  Facebook, 
  MessageSquare, 
  Search, 
  Phone, 
  MoreVertical, 
  CheckCircle2, 
  Send, 
  FileText, 
  Edit2, 
  Globe,
  RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { CRMButton } from '@/components/ui/crm-button';
import { CRMAvatar } from '@/components/ui/crm-avatar';
import { CRMBadge } from '@/components/ui/crm-badge';
import { useCRMTheme } from '@/providers/crm-theme-provider';
import { CRMAuthenticatedLayout } from '@/components/layout/crm-authenticated-layout';
import { SimpleInputModal } from '@/components/modals/simple-input-modal';

import { uazapiClient } from '@/lib/api/uazapi-client';

export default function InboxPage() {
  const { themeColor, isDark } = useCRMTheme();
  const [activeChat, setActiveChat] = useState<string | number | null>(null);
  const [visibleChannels, setVisibleChannels] = useState(['whatsapp', 'email', 'instagram', 'facebook']);
  const [orientations, setOrientations] = useState("Cliente interessado no plano Enterprise. \n\nPreferência por contato via WhatsApp à tarde.");
  
  // Popups State
  const [showNewGroup, setShowNewGroup] = useState(false);
  const [showNewChat, setShowNewChat] = useState(false);

  const [conversations, setConversations] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isUsingMock, setIsUsingMock] = useState(false);

  // Fetch Chats (Real Uazapi Integration)
  const fetchChats = async () => {
    setRefreshing(true);
    try {
        const response = await uazapiClient.chats.listChats();
        const chats = Array.isArray(response) ? response : (response?.data || []);
        
        // Auto-sync if list is empty
        if (!chats || chats.length === 0) {
            try {
                await uazapiClient.chats.syncChats();
                // Fetch again after sync
                const syncedResponse = await uazapiClient.chats.listChats();
                const syncedChats = Array.isArray(syncedResponse) ? syncedResponse : (syncedResponse?.data || []);
                
                if (syncedChats && syncedChats.length > 0) {
                    updateConversations(syncedChats);
                    setIsUsingMock(false);
                    return;
                }
            } catch (syncError) {
                console.error('Auto-sync failed', syncError);
            }
        }

        if (chats && chats.length > 0) {
            updateConversations(chats);
            setIsUsingMock(false);
        } else {
             // If strictly empty and no sync worked
             // throw new Error("No data returned"); // Don't throw, just show empty
        }
    } catch (error: any) {
        console.error('Failed to fetch Uazapi chats', error);
        
        // If error is "instance not connected" or similar, don't use mock, just show empty or error
        const errorMsg = error?.message?.toLowerCase() || '';
        if (errorMsg.includes('instance') && (errorMsg.includes('not found') || errorMsg.includes('not connected'))) {
            setIsUsingMock(false);
            // You might want to set a state here to show a "Connect WhatsApp" button in the UI
            setConversations([]); 
            return;
        }

        setIsUsingMock(true);
        // Fallback to mock if API fails (dev mode without real connection)
        fetch('/api/inbox')
            .then(res => res.json())
            .then(data => setConversations(data.conversations))
            .catch(err => console.error('Fallback failed', err));
    } finally {
        setRefreshing(false);
    }
  };

  const updateConversations = (chats: any[]) => {
        const mappedChats = chats.map((chat: any) => ({
            id: chat.id,
            name: chat.name || chat.number || chat.id.split('@')[0] || 'Desconhecido',
            lastMsg: chat.last_message?.content || '...',
            time: chat.last_message?.timestamp ? new Date(chat.last_message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '',
            unread: chat.unread_count || 0,
            online: true, // Mock for now
            channel: 'whatsapp' // Uazapi defaults to WhatsApp
        }));
        setConversations(mappedChats);
  };

  useEffect(() => {
    fetchChats();
    // Poll for new chats every 15 seconds
    const interval = setInterval(fetchChats, 15000);
    return () => clearInterval(interval);
  }, []);

  // Fetch Messages when Chat Selected
  useEffect(() => {
    if (!activeChat) return;

    const fetchMessages = async () => {
        setLoading(true);
        try {
             // Check if it's a mock ID (number) or real ID (string)
             if (typeof activeChat === 'string') {
                 const response = await uazapiClient.chats.getMessages(activeChat);
                 const msgs = Array.isArray(response) ? response : (response?.data || []);

                 if (msgs && Array.isArray(msgs)) {
                     setMessages(msgs.map((m: any) => ({
                         id: m.id,
                         sender: m.fromMe ? 'me' : 'other',
                         text: m.content || '',
                         time: m.timestamp ? new Date(m.timestamp * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''
                     })));
                 }
             } else {
                 // Fallback for mock data
                 fetch('/api/inbox')
                    .then(res => res.json())
                    .then(data => setMessages(data.messages));
             }
        } catch (error) {
            console.error('Failed to fetch messages', error);
        } finally {
            setLoading(false);
        }
    };

    fetchMessages();
  }, [activeChat]);

  // Send Message
  const handleSendMessage = async (text: string) => {
      if (!activeChat || typeof activeChat !== 'string') return;
      
      try {
          // Assuming activeChat is the chat ID, but sendText needs a number.
          // In UazAPI, usually chat ID is the number (e.g. 5511999999999@c.us)
          // We need to extract the number or use the chat ID if sendText supports it.
          const number = activeChat.includes('@') ? activeChat.split('@')[0] : activeChat;
          
          await uazapiClient.messages.sendText(number, text);
          
          // Optimistic update
          setMessages(prev => [...prev, {
              id: Date.now(),
              sender: 'me',
              text: text,
              time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
          }]);
          
      } catch (error) {
          console.error('Failed to send message', error);
          alert('Erro ao enviar mensagem');
      }
  };

  const toggleChannelVisibility = (channel: string) => {
      setVisibleChannels(prev => 
          prev.includes(channel) 
              ? prev.filter(c => c !== channel) 
              : [...prev, channel]
      );
  };

  const filteredConversations = conversations.filter(c => visibleChannels.includes(c.channel));

  const getChannelIcon = (channel: string) => {
      switch(channel) {
          case 'whatsapp': return <MessageCircle className="h-3 w-3 text-emerald-500" />;
          case 'email': return <Mail className="h-3 w-3 text-red-500" />;
          case 'instagram': return <Instagram className="h-3 w-3 text-pink-500" />;
          case 'facebook': return <Facebook className="h-3 w-3 text-blue-600" />;
          default: return <MessageSquare className="h-3 w-3" />;
      }
  };

  return (
    <CRMAuthenticatedLayout title="Inbox">
    <div className={cn(
      "h-full flex rounded-xl overflow-hidden border shadow-sm",
      isDark ? "border-zinc-800 bg-zinc-900/30" : "border-zinc-200 bg-white"
    )}>
      {/* Coluna 1: Lista de Conversas */}
      <div className={cn("w-72 border-r flex flex-col", isDark ? "border-zinc-800 bg-zinc-900/50" : "border-zinc-200 bg-zinc-50/50")}>
        <div className={cn("p-3 border-b space-y-3", isDark ? "border-zinc-800" : "border-zinc-200")}>
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <h2 className={cn("font-bold text-sm", isDark ? "text-white" : "text-zinc-900")}>Inbox</h2>
                    {isUsingMock ? (
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
                            Modo Demo
                        </span>
                    ) : (
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                            Online
                        </span>
                    )}
                </div>
                <div className="flex gap-1">
                    <CRMButton 
                        variant="ghost" 
                        size="icon" 
                        isDark={isDark} 
                        title="Atualizar Conversas" 
                        className={cn("h-7 w-7", refreshing && "animate-spin")} 
                        onClick={fetchChats}
                    >
                        <RefreshCw className="h-4 w-4" />
                    </CRMButton>
                    <CRMButton variant="ghost" size="icon" isDark={isDark} title="Novo Grupo" className="h-7 w-7" onClick={() => setShowNewGroup(true)}>
                        <Users className="h-4 w-4" />
                    </CRMButton>
                    <CRMButton variant="ghost" size="icon" isDark={isDark} title="Nova Conversa" className="h-7 w-7" onClick={() => setShowNewChat(true)}>
                        <Plus className="h-4 w-4" />
                    </CRMButton>
                </div>
            </div>
            
            <div className="flex justify-between px-1">
                {['whatsapp', 'email', 'instagram', 'facebook'].map(ch => (
                    <button 
                        key={ch}
                        onClick={() => toggleChannelVisibility(ch)}
                        className={cn(
                            "p-1.5 rounded transition-all", 
                            visibleChannels.includes(ch) 
                                ? (isDark ? "bg-zinc-800 text-zinc-200" : "bg-zinc-200 text-zinc-800")
                                : "opacity-30 hover:opacity-70 grayscale"
                        )}
                        title={`Mostrar/Ocultar ${ch}`}
                    >
                        {getChannelIcon(ch)}
                    </button>
                ))}
            </div>

            <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
                <input 
                type="text" 
                placeholder="Buscar..." 
                className={cn(
                    "w-full border-none rounded-lg pl-8 pr-3 py-1.5 text-xs focus:ring-1 transition-all",
                    isDark 
                    ? `bg-zinc-800/50 text-zinc-200 focus:ring-${themeColor}-500` 
                    : `bg-white text-zinc-900 shadow-sm focus:ring-${themeColor}-500`
                )}
                />
            </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map(chat => (
            <div 
              key={chat.id} 
              onClick={() => setActiveChat(chat.id)}
              className={cn(
                "p-3 flex gap-3 cursor-pointer transition-colors border-l-[3px] relative group",
                activeChat === chat.id 
                  ? `bg-${themeColor}-500/5 border-${themeColor}-500` 
                  : isDark ? "border-transparent hover:bg-zinc-800/50" : "border-transparent hover:bg-zinc-100"
              )}
            >
              <div className="relative">
                <CRMAvatar initials={chat.name.slice(0, 2).toUpperCase()} size="md" color={isDark ? "bg-zinc-700" : "bg-zinc-200 text-zinc-700"} />
                {chat.online && <div className={cn("absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2", isDark ? "ring-zinc-900" : "ring-white")} />}
                <div className="absolute -top-1 -left-1 bg-zinc-900 rounded-full p-0.5 border border-zinc-800">
                    {getChannelIcon(chat.channel)}
                </div>
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <div className="flex justify-between items-baseline mb-0.5">
                  <span className={cn("text-xs font-semibold truncate", 
                    activeChat === chat.id 
                      ? isDark ? "text-white" : "text-zinc-900"
                      : isDark ? "text-zinc-300" : "text-zinc-700"
                  )}>
                    {chat.name}
                  </span>
                  <span className="text-[9px] text-zinc-500">{chat.time}</span>
                </div>
                <p className="text-[10px] text-zinc-500 truncate">{chat.lastMsg}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Coluna 2: Chat Area */}
      <div className={cn("flex-1 flex flex-col min-w-0", isDark ? "bg-zinc-950/30" : "bg-zinc-50/50")}>
        {activeChat ? (
          <>
            <div className={cn("h-14 px-4 border-b flex justify-between items-center backdrop-blur-md", isDark ? "border-zinc-800 bg-zinc-900/50" : "border-zinc-200 bg-white/80")}>
              <div className="flex items-center gap-3">
                <CRMAvatar 
                    initials={conversations.find(c => c.id === activeChat)?.name.slice(0,2).toUpperCase() || "?"} 
                    size="sm" 
                    color={isDark ? "bg-zinc-700" : "bg-zinc-200 text-zinc-700"} 
                />
                <div>
                    <span className={cn("font-bold text-sm block", isDark ? "text-white" : "text-zinc-900")}>
                        {conversations.find(c => c.id === activeChat)?.name || "Desconhecido"}
                    </span>
                    <span className="text-[10px] text-emerald-500 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Online</span>
                </div>
              </div>
              <div className="flex gap-1">
                <CRMButton variant="ghost" size="icon" isDark={isDark} className="h-8 w-8"><Phone className="h-4 w-4" /></CRMButton>
                <CRMButton variant="ghost" size="icon" isDark={isDark} className="h-8 w-8"><MoreVertical className="h-4 w-4" /></CRMButton>
              </div>
            </div>

            <div className="flex-1 p-4 space-y-4 overflow-y-auto text-xs">
              <div className="flex justify-center">
                <span className={cn("text-[10px] px-2 py-0.5 rounded-full border opacity-70", isDark ? "bg-zinc-900 border-zinc-800" : "bg-zinc-100 border-zinc-200")}>Hoje</span>
              </div>
              
              {messages.length === 0 && (
                  <div className="text-center text-zinc-500 mt-10">
                      Nenhuma mensagem nesta conversa.
                  </div>
              )}

              {messages.map((msg) => (
                  <div key={msg.id} className={cn("flex gap-2", msg.sender === 'me' ? "flex-row-reverse" : "")}>
                     {msg.sender !== 'me' && (
                         <CRMAvatar 
                            initials={conversations.find(c => c.id === activeChat)?.name.slice(0,2).toUpperCase() || "?"} 
                            size="sm" 
                            color={isDark ? "bg-zinc-700" : "bg-zinc-200 text-zinc-600"} 
                         />
                     )}
                     <div className={cn(
                         "px-3 py-2 rounded-xl max-w-sm shadow-sm", 
                         msg.sender === 'me' 
                            ? `bg-${themeColor}-600 text-white rounded-tr-none`
                            : (isDark ? "bg-zinc-800 text-zinc-200 rounded-tl-none" : "bg-white text-zinc-800 border border-zinc-100 rounded-tl-none")
                     )}>
                        <p>{msg.text}</p>
                        <div className={cn("flex items-center gap-1 mt-1", msg.sender === 'me' ? "justify-end" : "")}>
                          <span className={cn("text-[9px]", msg.sender === 'me' ? `text-${themeColor}-100 opacity-80` : "text-zinc-500")}>{msg.time}</span>
                          {msg.sender === 'me' && <CheckCircle2 className={cn("h-2.5 w-2.5", `text-${themeColor}-100 opacity-80`)} />}
                        </div>
                     </div>
                  </div>
              ))}
            </div>

            <div className={cn("p-3 border-t", isDark ? "bg-zinc-900/50 border-zinc-800" : "bg-white border-zinc-200")}>
               <div className="relative flex items-center gap-2">
                 <CRMButton variant="ghost" size="icon" isDark={isDark} className="h-8 w-8 text-zinc-400 hover:text-foreground"><Plus className="h-4 w-4" /></CRMButton>
                 <input 
                   type="text" 
                   placeholder="Mensagem..." 
                   onKeyDown={(e) => {
                       if (e.key === 'Enter') {
                           const target = e.target as HTMLInputElement;
                           handleSendMessage(target.value);
                           target.value = '';
                       }
                   }}
                   className={cn(
                     "flex-1 border rounded-lg px-3 py-2 text-xs transition-all focus:outline-none focus:ring-1",
                     isDark 
                        ? `bg-zinc-950 border-zinc-800 text-white placeholder:text-zinc-600 focus:border-${themeColor}-500 focus:ring-${themeColor}-500`
                        : `bg-zinc-50 border-zinc-200 text-zinc-900 placeholder:text-zinc-500 focus:border-${themeColor}-500 focus:ring-${themeColor}-500`
                   )}
                 />
                 <CRMButton 
                    className="h-8 w-8 rounded-lg p-0" 
                    themeColor={themeColor} 
                    isDark={isDark}
                    onClick={() => {
                        const input = document.querySelector('input[placeholder="Mensagem..."]') as HTMLInputElement;
                        if (input && input.value) {
                            handleSendMessage(input.value);
                            input.value = '';
                        }
                    }}
                >
                    <Send className="h-3.5 w-3.5 ml-0.5" />
                </CRMButton>
               </div>
            </div>
          </>
        ) : (
            <div className="flex flex-col items-center justify-center h-full text-zinc-400">
                <MessageSquare className="h-12 w-12 mb-3 opacity-20" />
                <p className="text-sm font-medium">Selecione uma conversa</p>
                <p className="text-xs opacity-50">Escolha um contato à esquerda para iniciar o atendimento.</p>
            </div>
        )}
      </div>

      {/* Coluna 3: Info do Lead e Orientações (RESTAURADA) */}\n
      <div className={cn("w-72 border-l flex flex-col hidden xl:flex", isDark ? "border-zinc-800 bg-zinc-900/50" : "border-zinc-200 bg-white")}>
          <div className={cn("h-14 px-4 border-b flex items-center font-bold text-xs", isDark ? "border-zinc-800 text-zinc-400" : "border-zinc-200 text-zinc-600")}>
              Detalhes do Lead
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* Lead Profile */}
              <div className="text-center">
                  <CRMAvatar initials="AS" size="xl" themeColor={themeColor} className="mx-auto mb-2" />
                  <h3 className={cn("font-bold text-sm", isDark ? "text-white" : "text-zinc-900")}>Ana Souza</h3>
                  <p className="text-zinc-500 text-xs">Gerente de Projetos</p>
                  <div className="flex justify-center gap-2 mt-3">
                      <CRMBadge themeColor={themeColor} isDark={isDark}>Cliente VIP</CRMBadge>
                      <CRMBadge variant="warning" isDark={isDark}>Quente</CRMBadge>
                  </div>
              </div>

              {/* Contact Info */}
              <div className={cn("p-3 rounded-lg border space-y-2", isDark ? "bg-zinc-800/30 border-zinc-800" : "bg-zinc-50 border-zinc-200")}>
                  <div className="flex items-center gap-2 text-xs">
                      <Mail className="h-3.5 w-3.5 text-zinc-500" />
                      <span className={isDark ? "text-zinc-300" : "text-zinc-700"}>ana@email.com</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                      <Phone className="h-3.5 w-3.5 text-zinc-500" />
                      <span className={isDark ? "text-zinc-300" : "text-zinc-700"}>+55 11 99999-9999</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                      <Globe className="h-3.5 w-3.5 text-zinc-500" />
                      <span className={isDark ? "text-zinc-300" : "text-zinc-700"}>ana.com.br</span>
                  </div>
              </div>

              {/* Box de Orientações Editável */}
              <div className="space-y-2">
                  <div className="flex items-center justify-between">
                      <h4 className="text-[10px] font-bold uppercase text-zinc-500 tracking-wider flex items-center gap-1">
                          <FileText className="h-3 w-3" /> Orientações
                      </h4>
                      <CRMButton variant="ghost" size="icon" className="h-5 w-5" isDark={isDark}><Edit2 className="h-3 w-3" /></CRMButton>
                  </div>
                  <textarea 
                      value={orientations}
                      onChange={(e) => setOrientations(e.target.value)}
                      className={cn(
                          "w-full h-32 p-3 rounded-lg text-xs resize-none border focus:outline-none focus:ring-1",
                          isDark ? "bg-zinc-950 border-zinc-800 text-zinc-300 focus:border-zinc-600" : "bg-white border-zinc-200 text-zinc-700 focus:border-zinc-300"
                      )}
                  />
              </div>
          </div>
      </div>

      {/* Popups do Inbox */}
      <SimpleInputModal 
          isOpen={showNewGroup}
          onClose={() => setShowNewGroup(false)}
          title="Criar Novo Grupo"
          submitLabel="Criar"
          isDark={isDark}
          themeColor={themeColor}
          onSave={(data: any) => console.log("Grupo criado", data)}
          fields={[{ label: "Nome do Grupo", key: "name", placeholder: "Ex: Vendas Setembro" }]}
      />
      <SimpleInputModal 
          isOpen={showNewChat}
          onClose={() => setShowNewChat(false)}
          title="Iniciar Nova Conversa"
          submitLabel="Iniciar"
          isDark={isDark}
          themeColor={themeColor}
          onSave={(data: any) => console.log("Conversa iniciada", data)}
          fields={[{ label: "Número ou Email", key: "contact", placeholder: "+55..." }]}
      />
    </div>
    </CRMAuthenticatedLayout>
  );
};
