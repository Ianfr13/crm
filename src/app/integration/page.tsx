'use client';
import { useState } from 'react';
import { 
  Globe,
  Mail,
  Calendar,
  Code,
  Copy,
  Zap,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { CRMButton } from '@/components/ui/crm-button';
import { CRMBadge } from '@/components/ui/crm-badge';
import { useCRMTheme } from '@/providers/crm-theme-provider';
import { CRMAuthenticatedLayout } from '@/components/layout/crm-authenticated-layout';

export default function IntegrationPage() {
    const { themeColor, isDark } = useCRMTheme();
    const [apiKey, setApiKey] = useState("evo_live_89237489237489237489");
    const [webhookUrl, setWebhookUrl] = useState("https://seu-chatwoot.com/webhooks/whatsapp");
    const [showKey, setShowKey] = useState(false);
    const [chatwootStatus, setChatwootStatus] = useState<'connected' | 'disconnected'>('connected'); // Mock inicial

    const copyToClipboard = (text: string) => {
        alert(`Copiado: ${text}`);
    };

    return (
        <CRMAuthenticatedLayout title="Integração">
        <div className="space-y-6 animate-in fade-in duration-300 h-full flex flex-col">
             <div className="flex items-center justify-between border-b pb-2 border-zinc-800/50 shrink-0">
                <div>
                    <h1 className={cn("text-xl font-bold", isDark ? "text-white" : "text-zinc-900")}>Integração & Canais</h1>
                    <p className="text-xs text-zinc-500">Gerencie suas conexões com Evolution API e Chatwoot.</p>
                </div>
                <div className="flex gap-2">
                    <CRMBadge 
                        variant={chatwootStatus === 'connected' ? 'success' : 'danger'} 
                        themeColor={chatwootStatus === 'connected' ? 'emerald' : 'red'} 
                        isDark={isDark}
                    >
                        {chatwootStatus === 'connected' ? 'Chatwoot Engine Ativo' : 'Chatwoot Desconectado'}
                    </CRMBadge>
                    <CRMButton variant="outline" size="sm" isDark={isDark}>
                        <Globe className="h-3 w-3 mr-1.5" /> Docs Evolution
                    </CRMButton>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Evolution API Instance Card */}
                <div className={cn("p-5 rounded-xl border space-y-4 lg:col-span-1", isDark ? "bg-zinc-900/40 border-zinc-800" : "bg-white border-zinc-200 shadow-sm")}>
                    <div className="flex items-center justify-between">
                        <h3 className={cn("text-sm font-bold flex items-center gap-2", isDark ? "text-white" : "text-zinc-900")}>
                            WhatsApp (Evolution)
                        </h3>
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                    </div>
                    
                    <div className="aspect-square bg-white p-4 rounded-lg flex items-center justify-center border-2 border-dashed border-zinc-300">
                        {/* Placeholder QR Code */}
                        <div className="text-center space-y-2">
                             <Zap className="h-10 w-10 text-zinc-400 mx-auto" />
                             <p className="text-[10px] text-zinc-500">Instância Conectada</p>
                             <p className="text-xs font-mono text-zinc-800 font-bold">Ian Francio</p>
                        </div>
                    </div>
                    
                    <div className="flex gap-2">
                        <CRMButton size="sm" variant="destructive" className="w-full text-[10px]" isDark={isDark}>Desconectar</CRMButton>
                        <CRMButton size="sm" variant="outline" className="w-full text-[10px]" isDark={isDark}>Reiniciar</CRMButton>
                    </div>
                </div>

                {/* API Section */}
                <div className={cn("p-5 rounded-xl border space-y-4 lg:col-span-2", isDark ? "bg-zinc-900/40 border-zinc-800" : "bg-white border-zinc-200 shadow-sm")}>
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                            <div className={cn("p-2 rounded-lg", isDark ? "bg-zinc-800 text-zinc-200" : "bg-zinc-100 text-zinc-700")}>
                                <Code className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className={cn("text-sm font-bold", isDark ? "text-white" : "text-zinc-900")}>Credenciais Evolution</h3>
                                <p className="text-[10px] text-zinc-500">Chave de API para automações externas.</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Global API Key</label>
                        <div className={cn("flex items-center gap-2 p-2 rounded-lg border", isDark ? "bg-zinc-950 border-zinc-800" : "bg-zinc-50 border-zinc-200")}>
                            <code className={cn("flex-1 text-xs font-mono truncate", isDark ? "text-zinc-300" : "text-zinc-700")}>
                                {showKey ? apiKey : "evo_live_********************"}
                            </code>
                            <CRMButton variant="ghost" size="icon" isDark={isDark} onClick={() => setShowKey(!showKey)} title={showKey ? "Esconder" : "Mostrar"}>
                                {showKey ? <X className="h-3.5 w-3.5" /> : <span className="text-[10px] font-bold">VER</span>}
                            </CRMButton>
                            <CRMButton variant="ghost" size="icon" isDark={isDark} onClick={() => copyToClipboard(apiKey)} title="Copiar">
                                <Copy className="h-3.5 w-3.5" />
                            </CRMButton>
                        </div>
                    </div>
                    
                    <div className="space-y-2 mt-4">
                         <div className={cn("p-3 rounded-lg border flex items-center gap-3", isDark ? "bg-emerald-500/10 border-emerald-500/20" : "bg-emerald-50 border-emerald-200")}>
                             <Zap className="h-4 w-4 text-emerald-500" />
                             <div>
                                 <p className={cn("text-xs font-bold", isDark ? "text-emerald-400" : "text-emerald-700")}>Integração Nativa Ativa</p>
                                 <p className="text-[10px] text-zinc-500">Esta instância da Evolution está enviando mensagens automaticamente para o Chatwoot.</p>
                             </div>
                         </div>
                    </div>
                </div>

                {/* Webhook Section */}
                <div className={cn("p-5 rounded-xl border space-y-4 lg:col-span-3", isDark ? "bg-zinc-900/40 border-zinc-800" : "bg-white border-zinc-200 shadow-sm")}>
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                            <div className={cn("p-2 rounded-lg", isDark ? "bg-zinc-800 text-zinc-200" : "bg-zinc-100 text-zinc-700")}>
                                <Zap className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className={cn("text-sm font-bold", isDark ? "text-white" : "text-zinc-900")}>Webhooks Personalizados</h3>
                                <p className="text-[10px] text-zinc-500">Para integrações além do Chatwoot.</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">URL de Destino</label>
                        <div className="flex gap-2">
                            <input 
                                type="text" 
                                value={webhookUrl}
                                onChange={(e) => setWebhookUrl(e.target.value)}
                                className={cn("flex-1 p-2 rounded-lg text-xs border focus:ring-1 focus:outline-none", isDark ? "bg-zinc-950 border-zinc-800 text-white focus:border-zinc-600" : "bg-white border-zinc-200 text-zinc-900 focus:border-zinc-400")}
                            />
                            <CRMButton themeColor={themeColor} isDark={isDark} size="sm">Salvar</CRMButton>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </CRMAuthenticatedLayout>
    );
};
