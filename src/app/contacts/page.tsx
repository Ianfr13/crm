'use client';
import { useState, useEffect } from 'react';
import { 
  UserPlus, 
  Search, 
  Filter,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { CRMButton } from '@/components/ui/crm-button';
import { CRMAvatar } from '@/components/ui/crm-avatar';
import { CRMBadge } from '@/components/ui/crm-badge';
import { useCRMTheme } from '@/providers/crm-theme-provider';
import { CRMAuthenticatedLayout } from '@/components/layout/crm-authenticated-layout';
import { ContactDetailDrawer } from '@/components/drawers/contact-detail-drawer';
import { apiClient } from '@/lib/api/client';

import { Contact } from '@/types';

export default function ContactsPage() {
    const { themeColor, isDark } = useCRMTheme();
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
    const [contacts, setContacts] = useState<Contact[]>([]);

    useEffect(() => {
        const loadContacts = async () => {
            try {
                const data = await apiClient.getContacts();
                if (Array.isArray(data)) {
                    setContacts(data);
                } else {
                    setContacts([]);
                }
            } catch (error) {
                console.error('Failed to fetch contacts', error);
                setContacts([]);
            }
        };
        loadContacts();
    }, []);

    return (
        <CRMAuthenticatedLayout title="Contatos">
        <div className="space-y-3 h-full flex flex-col animate-in fade-in duration-300">
             <div className="flex items-center justify-between border-b pb-2 border-zinc-800/50 shrink-0">
                <div>
                    <h1 className={cn("text-xl font-bold", isDark ? "text-white" : "text-zinc-900")}>Contatos</h1>
                </div>
                <CRMButton size="sm" themeColor={themeColor} isDark={isDark}>
                    <UserPlus className="h-3 w-3 mr-1.5" /> Novo Contato
                </CRMButton>
            </div>

            <div className={cn("p-2 rounded-lg border flex gap-2 items-center shrink-0", isDark ? "bg-zinc-900/40 border-zinc-800" : "bg-white border-zinc-200")}>
                <Search className="h-3.5 w-3.5 text-zinc-500 ml-1" />
                <input 
                    type="text" 
                    placeholder="Buscar contatos..." 
                    className={cn("w-full bg-transparent text-xs focus:outline-none", isDark ? "text-zinc-200 placeholder:text-zinc-600" : "text-zinc-900 placeholder:text-zinc-400")}
                />
                <CRMButton size="sm" variant="ghost" isDark={isDark}><Filter className="h-3.5 w-3.5" /></CRMButton>
            </div>

            <div className={cn("flex-1 rounded-lg border overflow-hidden", isDark ? "bg-zinc-900/20 border-zinc-800" : "bg-white border-zinc-200")}>
                <div className="overflow-auto h-full">
                    <table className="w-full text-xs text-left">
                        <thead className={cn("uppercase font-medium sticky top-0", isDark ? "bg-zinc-800/80 text-zinc-400 backdrop-blur-md" : "bg-zinc-50 text-zinc-500")}>
                            <tr>
                                <th className="px-4 py-2">Nome</th>
                                <th className="px-4 py-2">Contato</th>
                                <th className="px-4 py-2">Tags</th>
                                <th className="px-4 py-2">Status</th>
                                <th className="px-4 py-2 text-right"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/30">
                            {contacts.map((contact) => (
                                <tr 
                                    key={contact.id} 
                                    onClick={() => setSelectedContact(contact)}
                                    className={cn("group cursor-pointer transition-colors", isDark ? "hover:bg-zinc-800/40" : "hover:bg-zinc-50")}
                                >
                                    <td className="px-4 py-2.5">
                                        <div className="flex items-center gap-2">
                                            <CRMAvatar initials={contact.name.slice(0,2).toUpperCase()} size="sm" themeColor={themeColor} />
                                            <div>
                                                <p className={cn("font-medium", isDark ? "text-white" : "text-zinc-900")}>{contact.name}</p>
                                                <p className="text-[10px] text-zinc-500">{contact.role}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-2.5 text-zinc-500">
                                        <div className="flex flex-col gap-0.5">
                                            <span>{contact.email}</span>
                                            <span className="text-[9px] opacity-70">{contact.phone}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-2.5">
                                        <div className="flex gap-1">
                                            {contact.tags?.map(tag => (
                                                <CRMBadge key={tag} themeColor={themeColor} isDark={isDark}>{tag}</CRMBadge>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-4 py-2.5">
                                        <div className="flex items-center gap-1.5">
                                            <div className={cn("h-1.5 w-1.5 rounded-full", contact.status === 'active' ? "bg-emerald-500" : contact.status === 'pending' ? "bg-amber-500" : "bg-zinc-500")} />
                                            <span className="capitalize">{contact.status}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-2.5 text-right">
                                        <ChevronRight className="h-3.5 w-3.5 text-zinc-500 opacity-0 group-hover:opacity-100" />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <ContactDetailDrawer 
            contact={selectedContact} 
            onClose={() => setSelectedContact(null)}
            isDark={isDark}
            themeColor={themeColor}
        />
        </CRMAuthenticatedLayout>
    );
};
