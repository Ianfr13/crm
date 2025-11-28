'use client';
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { 
  Users, 
  Plus, 
  Pin,
  MessageCircle,
  BellOff,
  Heart,
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
  RefreshCw,
  Check,
  CheckCheck,
  Clock,
  XCircle,
  Trash2,
  UserMinus,
  UserPlus,
  Shield,
  ShieldAlert
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { CRMButton } from '@/components/ui/crm-button';
import { CRMAvatar } from '@/components/ui/crm-avatar';
import { CRMBadge } from '@/components/ui/crm-badge';
import { useCRMTheme } from '@/providers/crm-theme-provider';
import { CRMAuthenticatedLayout } from '@/components/layout/crm-authenticated-layout';
import { CreateGroupDialog } from '@/components/features/inbox/create-group-dialog';
import { SimpleInputModal } from '@/components/modals/simple-input-modal';

import { ChatContextMenu } from '@/components/features/inbox/chat-context-menu';
import { chatwootClient } from '@/lib/api/chatwoot-client'; // Chatwoot (engine do inbox)
import { uazapiClient } from '@/lib/api/uazapi-client'; // Evolution/UazAPI (grupos, ações avançadas)
import { mapChatwootConversationToLocal, mapChatwootMessageToLocal } from '@/lib/mappers/chatwoot-mapper';
import type { ChatConversation, ChatMessage } from '@/types/chat';

export default function InboxPage() {
  const { themeColor, isDark } = useCRMTheme();
  const [activeChat, setActiveChat] = useState<string | number | null>(null);
  const [visibleChannels, setVisibleChannels] = useState(['whatsapp', 'email', 'instagram', 'facebook']);
  const [orientations, setOrientations] = useState("Cliente interessado no plano Enterprise. \n\nPreferência por contato via WhatsApp à tarde.");
  
  // Search State
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Group Management State
  const [groupMembers, setGroupMembers] = useState<any[]>([]);
  const [groupDescription, setGroupDescription] = useState('');
  const [groupName, setGroupName] = useState('');
  const [isGroupAdmin, setIsGroupAdmin] = useState(false); // To implement check later
  const [groupLoading, setGroupLoading] = useState(false);

  // Popups State
  const [showNewGroup, setShowNewGroup] = useState(false);
  const [showNewChat, setShowNewChat] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; chat: any } | null>(null);

  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageLimit, setMessageLimit] = useState<number>(50);
  const [loading, setLoading] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [isUsingMock, setIsUsingMock] = useState(false);

  // Message list scroll/perf state
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const [isNearBottom, setIsNearBottom] = useState(true);
  const [isLoadingOlder, setIsLoadingOlder] = useState(false);
  const ESTIMATED_MESSAGE_HEIGHT = 72; // px
  const VIRTUAL_OVERSCAN = 6;
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 100 });

  // Debounce search input para suavizar o filtro
  useEffect(() => {
    const id = setTimeout(() => setSearchQuery(searchInput), 200);
    return () => clearTimeout(id);
  }, [searchInput]);

  // Ajusta janela virtual de mensagens quando a lista muda
  useEffect(() => {
    const total = messages.length;
    if (!messagesContainerRef.current) {
      setVisibleRange({ start: 0, end: total });
      return;
    }
    if (total === 0) {
      setVisibleRange({ start: 0, end: 0 });
      return;
    }
    if (total <= 200) {
      setVisibleRange({ start: 0, end: total });
      return;
    }
    const el = messagesContainerRef.current;
    const viewCapacity =
      Math.ceil(el.clientHeight / ESTIMATED_MESSAGE_HEIGHT) + VIRTUAL_OVERSCAN * 2;
    const start = Math.max(0, total - viewCapacity);
    const end = total;
    setVisibleRange({ start, end });
  }, [messages.length]);

  // Fetch Chats (Chatwoot Engine)
  const fetchChats = useCallback(async () => {
    setRefreshing(true);
    try {
        // Headless Mode: Fetch from Chatwoot via Gateway
        const cwConversations = await chatwootClient.getConversations('open');
        
        if (cwConversations && Array.isArray(cwConversations)) {
            const mapped = cwConversations.map(mapChatwootConversationToLocal);
            
            // Sort by timestamp
            mapped.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
            
            setConversations(mapped);
            setIsUsingMock(false);
        } else {
            setConversations([]);
        }
    } catch (error: any) {
        console.error('Failed to fetch Chatwoot conversations', error);
        setIsUsingMock(false);
        // Optional: Show empty or error state
    } finally {
        setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | null = null;

    const setupInterval = () => {
      if (intervalId) clearInterval(intervalId);
      if (typeof document === 'undefined') return;
      if (document.visibilityState !== 'visible') return;
      intervalId = setInterval(fetchChats, 15000);
    };

    const handleVisibilityChange = () => {
      setupInterval();
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        fetchChats();
      }
    };

    fetchChats();
    setupInterval();

    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', handleVisibilityChange);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
      if (typeof document !== 'undefined') {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      }
    };
  }, [fetchChats]);

  // Fetch Messages when Chat Selected
  useEffect(() => {
    if (!activeChat) return;

    const fetchMessages = async () => {
        setLoading(true);
        try {
             const cwMessages = await chatwootClient.getMessages(activeChat);
             
             if (cwMessages && Array.isArray(cwMessages)) {
                 const mapped = cwMessages.map(mapChatwootMessageToLocal);
                 const sortedMsgs = mapped.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));

                 setMessages(sortedMsgs);
             } else {
                setMessages([]); // Clear messages if empty
             }
        } catch (error) {
            console.error('Failed to fetch Chatwoot messages', error);
        } finally {
            setLoading(false);
        }
    };

    fetchMessages();
  }, [activeChat, messageLimit]);

  // Fetch Group Details when activeChat is a group
  const fetchGroupDetails = async () => {
      if (!activeChat || typeof activeChat !== 'string' || !activeChat.endsWith('@g.us')) return;
      
      setGroupLoading(true);
      try {
          // Fetch group info (participants, admins, etc)
          const response = await uazapiClient.groups.getGroup(activeChat);
          
          if (response) {
              if (response.desc || response.description) setGroupDescription(response.desc || response.description);
              if (response.subject || response.name) setGroupName(response.subject || response.name);

              // Handle participants - try from getGroup response first, otherwise fetch explicitly
              let members = [];
              if (response.participants && Array.isArray(response.participants) && response.participants.length > 0) {
                  members = response.participants;
              } else {
                  try {
                      const membersResponse = await uazapiClient.groups.listGroupMembers(activeChat);
                      
                      if (Array.isArray(membersResponse)) {
                          members = membersResponse;
                      } else if (membersResponse?.participants && Array.isArray(membersResponse.participants)) {
                          members = membersResponse.participants;
                      } else if (membersResponse?.data && Array.isArray(membersResponse.data)) {
                          members = membersResponse.data;
                      }
                  } catch (err) {
                      console.error('Error fetching group members explicitly:', err);
                  }
              }
              
              if (members.length > 0) {
                  // Normalize members to ensure consistent structure
                  const normalizedMembers = members.map((m: any) => {
                      if (typeof m === 'string') {
                          return { id: m, admin: false, name: null };
                      }
                      // Handle various field names for participants
                      // The API seems to return 'DisplayName' which might be empty for non-contacts or non-business
                      // If DisplayName is empty, we should treat it as null so the UI falls back to ID
                      const name = m.name || m.notify || m.verifiedName || m.pushName || m.DisplayName || null;
                      
                      return {
                          id: m.id || m.jid || m.number || m.JID || m.PhoneNumber || 'unknown',
                          admin: m.admin === 'admin' || m.admin === 'superadmin' || m.admin === true || m.isAdmin === true || m.isSuperAdmin === true || m.IsAdmin === true || m.IsSuperAdmin === true,
                          name: (name && name.trim() !== '') ? name : null,
                          image: m.imgUrl || m.image || m.profilePictureUrl || null
                      };
                  });
                  setGroupMembers(normalizedMembers);
              }
          } 
      } catch (error) {
          console.error('Failed to fetch group details', error);
      } finally {
          setGroupLoading(false);
      }
  };

  useEffect(() => {
      if (!activeChat || typeof activeChat !== 'string' || !activeChat.endsWith('@g.us')) {
          setGroupMembers([]);
          return;
      }
      fetchGroupDetails();
  }, [activeChat]);

  // Group Actions
  const handlePromoteParticipant = async (participantId: string) => {
      if (!activeChat || typeof activeChat !== 'string') return;
      try {
          await uazapiClient.groups.promoteGroupMember(activeChat, participantId);
          alert('Participante promovido!');
          // Refresh members?
      } catch (error) {
          console.error('Failed to promote', error);
          alert('Erro ao promover');
      }
  };

  const handleDemoteParticipant = async (participantId: string) => {
      if (!activeChat || typeof activeChat !== 'string') return;
      try {
          await uazapiClient.groups.demoteGroupMember(activeChat, participantId);
          alert('Participante rebaixado!');
      } catch (error) {
          console.error('Failed to demote', error);
          alert('Erro ao rebaixar');
      }
  };

  const handleRemoveParticipant = async (participantId: string) => {
      if (!activeChat || typeof activeChat !== 'string') return;
      if (!confirm('Tem certeza que deseja remover este participante?')) return;
      try {
          await uazapiClient.groups.removeGroupMember(activeChat, participantId);
          alert('Participante removido!');
          setGroupMembers(prev => prev.filter(m => m.id !== participantId));
      } catch (error) {
          console.error('Failed to remove', error);
          alert('Erro ao remover');
      }
  };

  const handleUpdateGroupDescription = async () => {
      if (!activeChat || typeof activeChat !== 'string') return;
      try {
          await uazapiClient.groups.updateGroup(activeChat, { description: groupDescription });
          alert('Descrição atualizada!');
      } catch (error) {
          console.error('Failed to update description', error);
          alert('Erro ao atualizar descrição');
      }
  };

  const handleUpdateGroupName = async () => {
      if (!activeChat || typeof activeChat !== 'string') return;
      try {
          await uazapiClient.groups.updateGroup(activeChat, { name: groupName });
          alert('Nome atualizado!');
          // Optimistic update list
          setConversations(prev => prev.map(c => c.id === activeChat ? { ...c, name: groupName } : c));
      } catch (error) {
          console.error('Failed to update name', error);
          alert('Erro ao atualizar nome');
      }
  };

  // Auto-scroll to bottom when new messages arrive and user está perto do fim
  useEffect(() => {
      if (!isNearBottom || messages.length === 0) return;
      const lastMsgElement = document.getElementById("last-message");
      if (lastMsgElement) {
          lastMsgElement.scrollIntoView({ behavior: "smooth" });
      }
  }, [messages, isNearBottom]);

  // Send Message
  const handleSendMessage = async (text: string) => {
      if (!activeChat || typeof activeChat !== 'string') return;
      
      const now = Date.now();
      const tempId = `local-${now}`;
      const timeLabel = new Date(now).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

      // Optimistic message as pending
      setMessages(prev => [...prev, {
          id: tempId,
          chatId: activeChat,
          sender: 'me',
          text,
          timestamp: now,
          timeLabel,
          status: 'pending',
      } as ChatMessage]);

      // Also update last message info on conversation
      setConversations(prev => prev.map(c => {
        if (c.id !== activeChat) return c;
        return {
          ...c,
          lastMessageText: text,
          lastMessageStatus: 'pending',
          lastMessageSender: 'me',
          timestamp: now,
          timeLabel,
        };
      }));

      try {
          // Send via Chatwoot Engine
          const result = await chatwootClient.sendMessage(activeChat, text);

          // Mapeia a resposta do Chatwoot para atualizar a UI
          const newMessage = mapChatwootMessageToLocal(result);
          const realId = newMessage.id || tempId;

          setMessages(prev => prev.map(m =>
            m.id === tempId
              ? { ...m, id: realId, status: 'sent' }
              : m
          ));

          setConversations(prev => prev.map(c => {
            if (c.id !== activeChat) return c;
            return {
              ...c,
              lastMessageText: text,
              lastMessageStatus: 'sent',
              timestamp: now,
              timeLabel,
            };
          }));
      } catch (error) {
          console.error('Failed to send message via Chatwoot', error);
          // Mark optimistic message as failed
          setMessages(prev => prev.map(m =>
            m.id === tempId ? { ...m, status: 'failed' } : m
          ));
          setConversations(prev => prev.map(c => {
            if (c.id !== activeChat) return c;
            return {
              ...c,
              lastMessageStatus: 'failed',
            };
          }));
          alert('Erro ao enviar mensagem');
      }
  };

  const toggleChannelVisibility = useCallback((channel: string) => {
      setVisibleChannels(prev => 
          prev.includes(channel) 
              ? prev.filter(c => c !== channel) 
              : [...prev, channel]
      );
  }, []);

  const handleCreateGroup = async (name: string, participants: string[]) => {
    setLoading(true);
    try {
        const result = await uazapiClient.groups.createGroup(name, participants);
        
        // Force sync to fetch the new group
        await uazapiClient.chats.syncChats();
        
        // Refresh chat list
        await fetchChats();
        
        // Optimistic add if fetch didn't catch it yet (and we have a GID)
        // result usually looks like { success: true, gid: "12345@g.us" } or just the gid string depending on implementation
        // Safely try to extract gid
        const newGid = (result as any)?.gid || (result as any)?.id || (typeof result === 'string' ? result : null);
        
        if (newGid && !conversations.find(c => c.id === newGid)) {
             const newGroupChat: ChatConversation = {
                id: newGid,
                name: name,
                lastMessageText: 'Grupo criado',
                lastMessageStatus: 'sent',
                lastMessageSender: 'me',
                timestamp: Date.now(),
                timeLabel: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
                unreadCount: 0,
                online: false,
                channel: 'whatsapp',
                image: null,
                isGroup: true,
            };
            setConversations(prev => [newGroupChat, ...prev]);
            setActiveChat(newGid);
        }

        alert('Grupo criado com sucesso!');
    } catch (error) {
        console.error('Failed to create group', error);
        alert('Erro ao criar grupo');
    } finally {
        setLoading(false);
    }
  };

  const handleStartNewChat = (data: any) => {
    const contact = data.contact;
    if (!contact) return;

    // Check if conversation exists
    const existing = conversations.find(c =>
      c.id.includes(contact) || c.name.toLowerCase() === contact.toLowerCase()
    );

    if (existing) {
      setActiveChat(existing.id);
    } else {
      // Create optimistic conversation
      const newChatId = contact.includes('@') ? contact : `${contact}@s.whatsapp.net`;
      const now = Date.now();
      const newChat: ChatConversation = {
        id: newChatId,
        name: contact,
        lastMessageText: 'Nova conversa',
        lastMessageStatus: undefined,
        lastMessageSender: 'me',
        timestamp: now,
        timeLabel: new Date(now).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        unreadCount: 0,
        online: false,
        channel: 'whatsapp',
        image: null,
        isGroup: false,
      };
      setConversations(prev => [newChat, ...prev]);
      setActiveChat(newChatId);
    }
    setShowNewChat(false);
  };

  // Context Menu Actions
  const handleContextMenu = useCallback((e: React.MouseEvent, chat: ChatConversation) => {
    e.preventDefault();
    setContextMenu({
        x: e.clientX,
        y: e.clientY,
        chat
    });
  }, []);

  const handleMenuAction = async (action: string, chat: any) => {
      const chatId = chat.id;
      try {
          switch(action) {
              case 'archive':
                  await uazapiClient.chats.archiveChat(chatId);
                  // Optimistic removal from list
                  setConversations(prev => prev.filter(c => c.id !== chatId));
                  if (activeChat === chatId) setActiveChat(null);
                  break;
              case 'mute':
                  await uazapiClient.chats.muteChat(chatId);
                  setConversations(prev => prev.map(c => c.id === chatId ? { ...c, muted: true } : c));
                  break;
              case 'unmute':
                  await uazapiClient.chats.unmuteChat(chatId);
                  setConversations(prev => prev.map(c => c.id === chatId ? { ...c, muted: false } : c));
                  break;
              case 'pin':
                  // Local state + Re-sort
                  setConversations(prev => {
                      const updated = prev.map(c => c.id === chatId ? { ...c, pinned: !c.pinned } : c);
                      return updated.sort((a: ChatConversation, b: ChatConversation) => {
                        if (a.pinned && !b.pinned) return -1;
                        if (!a.pinned && b.pinned) return 1;
                        return (b.timestamp || 0) - (a.timestamp || 0);
                    });
                  });
                  break;
              case 'mark_unread':
                  // Local state only
                  setConversations(prev => prev.map(c => c.id === chatId ? { ...c, unreadCount: (c.unreadCount || 0) + 1 } : c));
                  break;
              case 'mark_read':
                  setConversations(prev => prev.map(c => c.id === chatId ? { ...c, unreadCount: 0 } : c));
                  break;
              case 'favorite':
                  // Local state
                  setConversations(prev => prev.map(c => c.id === chatId ? { ...c, favorite: !c.favorite } : c));
                  break;
              case 'block':
                  if (confirm(`Bloquear ${chat.name}?`)) {
                      // Extract number from ID (remove @s.whatsapp.net)
                      const number = chatId.split('@')[0];
                      await uazapiClient.contacts.blockContact(number);
                      alert('Contato bloqueado');
                  }
                  break;
              case 'delete':
                  if (confirm(`Apagar conversa com ${chat.name}?`)) {
                      // Fallback: try to archive or just hide locally since deleteChat isn't explicit in helper
                      // If it's a group, maybe leaveGroup?
                      if (chatId.endsWith('@g.us')) {
                          await uazapiClient.groups.leaveGroup(chatId);
                      } else {
                          // For individual, usually means deleting messages or clearing chat
                          // We'll just hide it locally for now
                          setConversations(prev => prev.filter(c => c.id !== chatId));
                      }
                      if (activeChat === chatId) setActiveChat(null);
                  }
                  break;
          }
      } catch (error) {
          console.error(`Action ${action} failed`, error);
          alert('Ação falhou');
      }
  };

  const filteredConversations = useMemo(
    () =>
      conversations
        .filter(c => visibleChannels.includes(c.channel))
        .filter(c =>
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.id.toLowerCase().includes(searchQuery.toLowerCase())
        ),
    [conversations, visibleChannels, searchQuery]
  );

  const activeConversation = useMemo(
    () => conversations.find(c => c.id === activeChat) || null,
    [conversations, activeChat]
  );

  const totalMessages = messages.length;
  const useVirtualization = totalMessages > 200;
  const virtualStart = useVirtualization ? visibleRange.start : 0;
  const virtualEnd = useVirtualization ? Math.min(visibleRange.end, totalMessages) : totalMessages;
  const visibleMessages = messages.slice(virtualStart, virtualEnd);
  const topSpacerHeight = useVirtualization ? virtualStart * ESTIMATED_MESSAGE_HEIGHT : 0;
  const bottomSpacerHeight = useVirtualization
    ? (totalMessages - virtualEnd) * ESTIMATED_MESSAGE_HEIGHT
    : 0;

  const getChannelIcon = (channel: string) => {
      switch(channel) {
          case 'whatsapp': return <MessageCircle className="h-3 w-3 text-emerald-500" />;
          case 'email': return <Mail className="h-3 w-3 text-red-500" />;
          case 'instagram': return <Instagram className="h-3 w-3 text-pink-500" />;
          case 'facebook': return <Facebook className="h-3 w-3 text-blue-600" />;
          default: return <MessageSquare className="h-3 w-3" />;
      }
  };

  const getStatusIcon = (status: any, customClass?: string) => {
      const s = String(status || '').toUpperCase();
      const baseClass = customClass || "h-3 w-3 text-zinc-400";
      
      // Failed: X vermelho
      if (['FAILED', 'ERROR'].includes(s)) {
          return <XCircle className={cn(baseClass, !customClass && "text-red-500")} />;
      }
      // Pending: relógio cinza
      if (['PENDING', '0'].includes(s)) {
          return <Clock className={baseClass} />;
      }
      // Blue check for Read/Seen
      if (['READ', 'SEEN', 'PLAYED', '3', '4'].includes(s)) {
          return <CheckCheck className={cn(baseClass, !customClass && "text-blue-500")} />;
      }
      // Double check gray for Delivered/Received
      if (['DELIVERED', 'RECEIVED', '2'].includes(s)) {
          return <CheckCheck className={baseClass} />;
      }
      // Single check for Sent (sent / default)
      return <Check className={baseClass} />;
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
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
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
                      {filteredConversations.map((chat: ChatConversation) => (
            <div 
              key={chat.id} 
              onClick={() => setActiveChat(chat.id)}
              onContextMenu={(e) => handleContextMenu(e, chat)}
              className={cn(
                "p-3 flex gap-3 cursor-pointer transition-colors border-l-[3px] relative group",
                activeChat === chat.id 
                  ? `bg-${themeColor}-500/5 border-${themeColor}-500` 
                  : isDark ? "border-transparent hover:bg-zinc-800/50" : "border-transparent hover:bg-zinc-100"
              )}
            >
              {chat.pinned && (
                  <Pin className={cn("absolute top-1 right-1 h-3 w-3 -rotate-45", isDark ? "text-zinc-500" : "text-zinc-400")} />
              )}
              <div className="relative">
                <CRMAvatar 
                    initials={chat.name.slice(0, 2).toUpperCase()} 
                    size="md" 
                    color={isDark ? "bg-zinc-700" : "bg-zinc-200 text-zinc-700"} 
                    src={chat.image}
                />
                {chat.online && <div className={cn("absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2", isDark ? "ring-zinc-900" : "ring-white")} />}
                <div className="absolute -top-1 -left-1 bg-zinc-900 rounded-full p-0.5 border border-zinc-800">
                    {getChannelIcon(chat.channel)}
                </div>
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <div className="flex justify-between items-baseline mb-0.5">
                  <div className="flex items-center gap-1 min-w-0">
                      <span className={cn("text-xs font-semibold truncate", 
                        activeChat === chat.id 
                          ? isDark ? "text-white" : "text-zinc-900"
                          : isDark ? "text-zinc-300" : "text-zinc-700"
                      )}>
                        {chat.name}
                      </span>
                      {chat.favorite && <Heart className="h-2.5 w-2.5 fill-rose-500 text-rose-500" />}
                      {chat.muted && <BellOff className="h-2.5 w-2.5 text-zinc-400" />}
                  </div>
                  <span className="text-[9px] text-zinc-500 whitespace-nowrap ml-1">{chat.timeLabel}</span>
                </div>
                <div className="flex items-center gap-1 overflow-hidden">
                    {chat.lastMessageSender === 'me' && getStatusIcon(chat.lastMessageStatus, "h-3 w-3 min-w-[12px]")}
                    <p className="text-[10px] text-zinc-500 truncate">{chat.lastMessageText}</p>
                </div>
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
                    initials={activeConversation?.name?.slice(0,2).toUpperCase() || "?"} 
                    size="sm" 
                    color={isDark ? "bg-zinc-700" : "bg-zinc-200 text-zinc-700"} 
                    src={activeConversation?.image}
                />
                <div>
                    <span className={cn("font-bold text-sm block", isDark ? "text-white" : "text-zinc-900")}>
                        {activeConversation?.name || "Desconhecido"}
                    </span>
                    <span className="text-[10px] text-emerald-500 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Online</span>
                </div>
              </div>
              <div className="flex gap-1">
                <CRMButton variant="ghost" size="icon" isDark={isDark} className="h-8 w-8"><Phone className="h-4 w-4" /></CRMButton>
                <CRMButton variant="ghost" size="icon" isDark={isDark} className="h-8 w-8"><MoreVertical className="h-4 w-4" /></CRMButton>
              </div>
            </div>

            <div
              ref={messagesContainerRef}
              className="flex-1 p-4 space-y-4 overflow-y-auto text-xs"
              onScroll={(e) => {
                const el = e.currentTarget;
                const threshold = 48;
                const atTop = el.scrollTop <= threshold;
                const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight <= threshold;
                if (atBottom !== isNearBottom) setIsNearBottom(atBottom);

                if (atTop && !isLoadingOlder && messages.length >= messageLimit) {
                  setIsLoadingOlder(true);
                  const prevScrollHeight = el.scrollHeight;
                  setMessageLimit(prev => prev + 50);
                  setTimeout(() => {
                    const container = messagesContainerRef.current;
                    if (!container) {
                      setIsLoadingOlder(false);
                      return;
                    }
                    const newScrollHeight = container.scrollHeight;
                    container.scrollTop = newScrollHeight - prevScrollHeight;
                    setIsLoadingOlder(false);
                  }, 0);
                }

                const total = messages.length;
                if (total > 200) {
                  const firstVisibleIndex = Math.max(
                    0,
                    Math.floor(el.scrollTop / ESTIMATED_MESSAGE_HEIGHT) - VIRTUAL_OVERSCAN
                  );
                  const viewCount =
                    Math.ceil(el.clientHeight / ESTIMATED_MESSAGE_HEIGHT) + VIRTUAL_OVERSCAN * 2;
                  const lastVisibleIndex = Math.min(total, firstVisibleIndex + viewCount);
                  setVisibleRange(prev => {
                    if (prev.start === firstVisibleIndex && prev.end === lastVisibleIndex) return prev;
                    return { start: firstVisibleIndex, end: lastVisibleIndex };
                  });
                } else {
                  if (visibleRange.start !== 0 || visibleRange.end !== total) {
                    setVisibleRange({ start: 0, end: total });
                  }
                }
              }}
            >
              <div className="flex justify-center">
                <span className={cn("text-[10px] px-2 py-0.5 rounded-full border opacity-70", isDark ? "bg-zinc-900 border-zinc-800" : "bg-zinc-100 border-zinc-200")}>Hoje</span>
              </div>
              
              {messages.length === 0 && (
                  <div className="text-center text-zinc-500 mt-10">
                      Nenhuma mensagem nesta conversa.
                  </div>
              )}

              {messages.length > 0 && (
                  <>
                    {topSpacerHeight > 0 && (
                      <div style={{ height: topSpacerHeight }} />
                    )}
                    {visibleMessages.map((msg, index) => {
                      const globalIndex = virtualStart + index;
                      const isLast = globalIndex === totalMessages - 1;
                      return (
                        <div
                          key={msg.id || globalIndex}
                          className={cn("flex gap-2", msg.sender === 'me' ? "flex-row-reverse" : "")}
                          id={isLast ? "last-message" : undefined}
                        >
                           {msg.sender !== 'me' && (
                               <CRMAvatar 
                                  initials={activeConversation?.name?.slice(0,2).toUpperCase() || "?"} 
                                  size="sm" 
                                  color={isDark ? "bg-zinc-700" : "bg-zinc-200 text-zinc-600"} 
                                  src={activeConversation?.image}
                               />
                           )}
                           <div className={cn(
                               "px-3 py-2 rounded-xl max-w-sm shadow-sm", 
                               msg.sender === 'me' 
                                  ? `bg-${themeColor}-600 text-white rounded-tr-none`
                                  : (isDark ? "bg-zinc-800 text-zinc-200 rounded-tl-none" : "bg-white text-zinc-800 border border-zinc-100 rounded-tl-none")
                           )}>
                              {msg.sender !== 'me' && String(activeChat).endsWith('@g.us') && (
                                  <p className={cn("text-[10px] font-bold mb-0.5 opacity-80", isDark ? "text-zinc-400" : "text-zinc-500")}>
                                      {(msg.senderName && msg.senderName.trim() !== '') ? msg.senderName : (msg.senderId ? msg.senderId.split('@')[0] : "Membro")}
                                  </p>
                              )}
                              <p>{msg.text}</p>
                              <div className={cn("flex items-center gap-1 mt-1", msg.sender === 'me' ? "justify-end" : "")}>
                                <span className={cn("text-[9px]", msg.sender === 'me' ? `text-${themeColor}-100 opacity-80` : "text-zinc-500")}>{msg.timeLabel}</span>
                                {msg.sender === 'me' && getStatusIcon(msg.status, cn("h-3 w-3", `text-${themeColor}-100 opacity-80`))}
                              </div>
                           </div>
                        </div>
                      );
                    })}
                    {bottomSpacerHeight > 0 && (
                      <div style={{ height: bottomSpacerHeight }} />
                    )}
                  </>
              )}
            </div>

            <div className={cn("p-3 border-t", isDark ? "bg-zinc-900/50 border-zinc-800" : "bg-white border-zinc-200")}>
               <div className="relative flex items-center gap-2">
                 <CRMButton variant="ghost" size="icon" isDark={isDark} className="h-8 w-8 text-zinc-400 hover:text-foreground"><Plus className="h-4 w-4" /></CRMButton>
                 <input 
                   type="text" 
                   placeholder="Mensagem..." 
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          const value = messageInput.trim();
                          if (!value) return;
                          handleSendMessage(value);
                          setMessageInput('');
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
                        const value = messageInput.trim();
                        if (!value) return;
                        handleSendMessage(value);
                        setMessageInput('');
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

      {/* Coluna 3: Info do Lead e Orientações (RESTAURADA) */}
      <div className={cn("w-72 border-l flex flex-col hidden xl:flex", isDark ? "border-zinc-800 bg-zinc-900/50" : "border-zinc-200 bg-white")}>
          <div className={cn("h-14 px-4 border-b flex items-center font-bold text-xs", isDark ? "border-zinc-800 text-zinc-400" : "border-zinc-200 text-zinc-600")}>
              {activeChat && String(activeChat).endsWith('@g.us') ? 'Detalhes do Grupo' : 'Detalhes do Lead'}
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {activeChat ? (
                  <>
                    {/* Header Profile */}
                    <div className="text-center">
                        <CRMAvatar 
                            initials={activeConversation?.name?.slice(0,2).toUpperCase() || "?"} 
                            size="xl" 
                            themeColor={themeColor} 
                            className="mx-auto mb-2" 
                            src={activeConversation?.image}
                        />
                        <div className="flex justify-center items-center gap-2 mb-2">
                            <input 
                                type="text"
                                value={groupName}
                                onChange={(e) => setGroupName(e.target.value)}
                                className={cn(
                                    "font-bold text-sm text-center bg-transparent border-b border-transparent focus:border-zinc-500 outline-none transition-all w-full",
                                    isDark ? "text-white" : "text-zinc-900"
                                )}
                            />
                            <button 
                                onClick={handleUpdateGroupName}
                                title="Salvar Nome"
                                className="bg-emerald-500 hover:bg-emerald-600 text-white p-1 rounded-full transition-colors flex-shrink-0"
                            >
                                <Check className="h-3 w-3" />
                            </button>
                        </div>
                        <p className="text-zinc-500 text-xs mb-2">
                            {String(activeChat).endsWith('@g.us') ? 'Grupo WhatsApp' : 'Lead'}
                        </p>

                        {String(activeChat).endsWith('@g.us') && (
                            <button 
                                onClick={async () => {
                                    const url = prompt("Cole a URL da nova imagem do grupo:");
                                    if (url) {
                                        try {
                                            await uazapiClient.groups.updateGroupPicture(String(activeChat), url);
                                            alert("Foto atualizada com sucesso!");
                                        } catch (e) {
                                            console.error(e);
                                            alert("Erro ao atualizar foto.");
                                        }
                                    }
                                }}
                                className="text-[10px] text-zinc-400 hover:text-zinc-500 underline cursor-pointer"
                            >
                                Alterar Foto
                            </button>
                        )}
                        {!String(activeChat).endsWith('@g.us') && (
                            <div className="flex justify-center gap-2 mt-3">
                                <CRMBadge themeColor={themeColor} isDark={isDark}>Novo</CRMBadge>
                            </div>
                        )}
                        
                        {/* Group Description & Photo Edit Placeholder */}
                        {String(activeChat).endsWith('@g.us') && (
                             <div className="mt-3 px-4">
                                <div className="flex items-center justify-between mb-1">
                                    <label className="text-[10px] font-bold uppercase text-zinc-500 tracking-wider">Descrição</label>
                                    <button onClick={handleUpdateGroupDescription} className="text-emerald-500 hover:text-emerald-600 text-[10px]">Salvar</button>
                                </div>
                                <textarea 
                                    value={groupDescription}
                                    onChange={(e) => setGroupDescription(e.target.value)}
                                    className={cn(
                                        "w-full h-20 p-2 rounded text-xs resize-none border focus:outline-none focus:ring-1",
                                        isDark ? "bg-zinc-800/50 border-zinc-700 text-zinc-300" : "bg-zinc-50 border-zinc-200 text-zinc-700"
                                    )}
                                    placeholder="Adicionar descrição..."
                                />
                             </div>
                        )}
                    </div>

                    {/* Contact Info (Individual) */}
                    {!String(activeChat).endsWith('@g.us') && (
                        <div className={cn("p-3 rounded-lg border space-y-2", isDark ? "bg-zinc-800/30 border-zinc-800" : "bg-zinc-50 border-zinc-200")}>
                            <div className="flex items-center gap-2 text-xs">
                                <Phone className="h-3.5 w-3.5 text-zinc-500" />
                                <span className={isDark ? "text-zinc-300" : "text-zinc-700"}>
                                    {activeConversation?.id.split('@')[0] || "-"}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Group Participants List */}
                    {String(activeChat).endsWith('@g.us') && (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <h4 className="text-[10px] font-bold uppercase text-zinc-500 tracking-wider flex items-center gap-1">
                                    <Users className="h-3 w-3" /> Participantes ({groupMembers.length})
                                </h4>
                                <button 
                                    onClick={fetchGroupDetails}
                                    className="text-zinc-400 hover:text-zinc-600"
                                    title="Recarregar Membros"
                                >
                                    <RefreshCw className={cn("h-3 w-3", groupLoading && "animate-spin")} />
                                </button>
                            </div>
                            {groupLoading ? (
                                <p className="text-xs text-zinc-500 text-center py-2">Carregando...</p>
                            ) : groupMembers.length === 0 ? (
                                <div className="text-center py-4 space-y-2">
                                    <p className="text-xs text-zinc-500">Nenhum participante encontrado.</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {groupMembers.map((member: any) => (
                                        <div key={member.id} className={cn("p-2 rounded flex items-center justify-between group", isDark ? "bg-zinc-800/30 hover:bg-zinc-800" : "bg-zinc-50 hover:bg-zinc-100")}>
                                            <div className="flex items-center gap-2 overflow-hidden">
                                                <CRMAvatar 
                                                    initials={member.name ? member.name.slice(0,2).toUpperCase() : member.id.slice(0,2)} 
                                                    size="sm" 
                                                    className="h-6 w-6"
                                                    src={member.image}
                                                />
                                                <div className="flex flex-col min-w-0">
                                                    <span className={cn("text-xs truncate w-32", isDark ? "text-zinc-300" : "text-zinc-700")}>
                                                        {member.name || member.id.split('@')[0]}
                                                    </span>
                                                    {member.name && (
                                                        <span className="text-[9px] text-zinc-500 truncate">
                                                            {member.id.split('@')[0]}
                                                        </span>
                                                    )}
                                                    {member.admin && (
                                                        <span className="text-[9px] text-emerald-500 font-medium block">Admin</span>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            {/* Admin Actions */}
                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {member.admin ? (
                                                    <button onClick={() => handleDemoteParticipant(member.id)} title="Remover Admin" className="text-amber-500 hover:text-amber-600">
                                                        <ShieldAlert className="h-3 w-3" />
                                                    </button>
                                                ) : (
                                                    <button onClick={() => handlePromoteParticipant(member.id)} title="Promover Admin" className="text-emerald-500 hover:text-emerald-600">
                                                        <Shield className="h-3 w-3" />
                                                    </button>
                                                )}
                                                <button onClick={() => handleRemoveParticipant(member.id)} title="Remover do Grupo" className="text-red-500 hover:text-red-600">
                                                    <Trash2 className="h-3 w-3" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

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
                  </>
              ) : (
                  <div className="text-center text-zinc-500 text-xs mt-10">
                      Selecione um contato para ver detalhes.
                  </div>
              )}
          </div>
      </div>

      {/* Popups do Inbox */}
      {contextMenu && (
          <ChatContextMenu 
            position={contextMenu} 
            chat={contextMenu.chat} 
            onClose={() => setContextMenu(null)}
            onAction={handleMenuAction}
            isDark={isDark}
          />
      )}
      <CreateGroupDialog 
          isOpen={showNewGroup}
          onClose={() => setShowNewGroup(false)}
          onCreate={handleCreateGroup}
          isDark={isDark}
          themeColor={themeColor}
      />
      <SimpleInputModal 
          isOpen={showNewChat}
          onClose={() => setShowNewChat(false)}
          title="Iniciar Nova Conversa"
          submitLabel="Iniciar"
          isDark={isDark}
          themeColor={themeColor}
          onSave={handleStartNewChat}
          fields={[{ label: "Número ou Email", key: "contact", placeholder: "Ex: 5511999999999" }]}
      />
    </div>
    </CRMAuthenticatedLayout>
  );
};
