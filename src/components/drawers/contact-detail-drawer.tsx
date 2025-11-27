import React, { useState } from 'react';
import { X, MessageSquare, Phone, Mail, UserCheck, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CRMButton } from '@/components/ui/crm-button';
import { CRMAvatar } from '@/components/ui/crm-avatar';

interface ContactDetailDrawerProps {
  contact: any;
  onClose: () => void;
  isDark: boolean;
  themeColor: string;
}

export const ContactDetailDrawer = ({ contact, onClose, isDark, themeColor }: ContactDetailDrawerProps) => {
  const [assignedAgent, setAssignedAgent] = useState("João Demo");

  if (!contact) return null;

  return (
    <>
      <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-[1px]" onClick={onClose} />
      <div className={cn(
        "fixed inset-y-0 right-0 z-[70] w-[350px] border-l shadow-2xl flex flex-col transform transition-transform duration-300 animate-in slide-in-from-right",
        isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"
      )}>
        <div className={cn("h-12 px-4 flex items-center justify-between border-b", isDark ? "border-zinc-800" : "border-zinc-200")}>
           <span className="font-semibold text-xs">Detalhes do Contato</span>
           <CRMButton variant="ghost" size="icon" onClick={onClose} isDark={isDark}><X className="h-4 w-4" /></CRMButton>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="flex flex-col items-center text-center">
                <CRMAvatar initials={contact.name.slice(0, 2).toUpperCase()} size="xl" themeColor={themeColor} />
                <h3 className={cn("text-lg font-bold mt-3", isDark ? "text-white" : "text-zinc-900")}>{contact.name}</h3>
                <p className="text-zinc-500 text-xs">{contact.role || 'Sem cargo'}</p>
                
                <div className="grid grid-cols-3 gap-2 w-full mt-4">
                    <CRMButton size="sm" themeColor={themeColor} isDark={isDark} className="flex-1"><MessageSquare className="h-3 w-3 mr-1" /> Chat</CRMButton>
                    <CRMButton size="sm" variant="outline" isDark={isDark} className="flex-1"><Phone className="h-3 w-3 mr-1" /> Ligar</CRMButton>
                    <CRMButton size="sm" variant="outline" isDark={isDark} className="flex-1"><Mail className="h-3 w-3 mr-1" /> Email</CRMButton>
                </div>
            </div>

            {/* Seletor de Responsável */}
            <div className={cn("p-3 rounded-lg border space-y-2", isDark ? "bg-zinc-800/30 border-zinc-800" : "bg-zinc-50 border-zinc-200")}>
                <label className="text-[10px] font-bold uppercase text-zinc-500 tracking-wider flex items-center gap-1">
                    <UserCheck className="h-3 w-3" /> Responsável pelo Lead
                </label>
                <div className="relative">
                    <select 
                        value={assignedAgent}
                        onChange={(e) => setAssignedAgent(e.target.value)}
                        className={cn(
                            "w-full p-2 rounded text-xs border appearance-none cursor-pointer focus:ring-1 focus:outline-none",
                            isDark ? "bg-zinc-900 border-zinc-700 text-zinc-200 focus:border-zinc-500" : "bg-white border-zinc-300 text-zinc-800"
                        )}
                    >
                        <option>João Demo (Eu)</option>
                        <option>Maria Vendas</option>
                        <option>Carlos Suporte</option>
                        <option>Ana Gerente</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-zinc-500 pointer-events-none" />
                </div>
            </div>

            <div className={cn("p-3 rounded-lg border space-y-2", isDark ? "bg-zinc-800/30 border-zinc-800" : "bg-zinc-50 border-zinc-200")}>
                <div className="flex justify-between items-center">
                    <span className="text-xs text-zinc-500">Oportunidade</span>
                    <span className={cn("text-sm font-bold", `text-${themeColor}-500`)}>{contact.value || 'R$ 0,00'}</span>
                </div>
                <div className="w-full bg-zinc-200 dark:bg-zinc-700 h-1.5 rounded-full overflow-hidden">
                    <div className={`bg-${themeColor}-500 h-full rounded-full w-[60%]`}></div>
                </div>
            </div>

            <div className="space-y-3">
                <h4 className="text-[10px] font-bold uppercase text-zinc-500 tracking-wider">Dados</h4>
                <div className="flex items-center gap-2 text-xs">
                    <Mail className="h-3.5 w-3.5 text-zinc-500" />
                    <span className={isDark ? "text-zinc-300" : "text-zinc-700"}>{contact.email || 'email@exemplo.com'}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                    <Phone className="h-3.5 w-3.5 text-zinc-500" />
                    <span className={isDark ? "text-zinc-300" : "text-zinc-700"}>{contact.phone || '+55 11 99999-9999'}</span>
                </div>
            </div>
        </div>
      </div>
    </>
  );
}
