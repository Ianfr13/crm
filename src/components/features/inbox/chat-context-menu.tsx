import React, { useEffect, useRef } from 'react';
import { 
  Archive, 
  BellOff, 
  Pin, 
  PinOff, 
  MessageSquare, 
  Heart, 
  Ban, 
  Trash2, 
  Mail
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatContextMenuProps {
  position: { x: number; y: number };
  chat: any;
  onClose: () => void;
  onAction: (action: string, chat: any) => void;
  isDark: boolean;
}

export const ChatContextMenu: React.FC<ChatContextMenuProps> = ({
  position,
  chat,
  onClose,
  onAction,
  isDark
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  // Adjust position if it goes off screen (basic handling)
  const style = {
    top: position.y,
    left: position.x,
  };

  const MenuItem = ({ icon: Icon, label, action, danger = false }: any) => (
    <button
      className={cn(
        "w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left",
        danger 
          ? "text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20" 
          : isDark 
            ? "text-zinc-200 hover:bg-zinc-800" 
            : "text-zinc-700 hover:bg-zinc-100"
      )}
      onClick={() => {
        onAction(action, chat);
        onClose();
      }}
    >
      <Icon className={cn("h-4 w-4", danger ? "text-red-500" : "text-zinc-500")} />
      <span>{label}</span>
    </button>
  );

  const isMuted = chat.muted || chat.muteExpiration;
  const isUnread = (chat.unread || 0) > 0;
  const isFavorite = chat.favorite;

  return (
    <div 
      ref={menuRef}
      className={cn(
        "fixed z-50 min-w-[220px] rounded-xl shadow-xl border py-1.5 overflow-hidden animate-in fade-in zoom-in-95 duration-100",
        isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"
      )}
      style={style}
    >
      <MenuItem icon={Archive} label="Arquivar conversa" action="archive" />
      
      <MenuItem 
        icon={BellOff} 
        label={isMuted ? "Reativar notificações" : "Silenciar notificações"} 
        action={isMuted ? "unmute" : "mute"} 
      />
      
      <MenuItem 
        icon={chat.pinned ? PinOff : Pin} 
        label={chat.pinned ? "Desafixar conversa" : "Fixar conversa"} 
        action="pin" 
      />
      
      <MenuItem 
        icon={isUnread ? Mail : Mail} // Could use OpenMail icon if available
        label={isUnread ? "Marcar como lida" : "Marcar como não lida"} 
        action={isUnread ? "mark_read" : "mark_unread"} 
      />
      
      <MenuItem 
        icon={Heart} 
        label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"} 
        action="favorite" 
      />
      
      <div className={cn("my-1 border-t", isDark ? "border-zinc-800" : "border-zinc-100")} />
      
      <MenuItem icon={Ban} label="Bloquear" action="block" />
      <MenuItem icon={Trash2} label="Apagar conversa" action="delete" danger />
    </div>
  );
};
