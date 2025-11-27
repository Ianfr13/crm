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
    const [apiKey, setApiKey] = useState("uaz_live_89237489237489237489");
    const [webhookUrl, setWebhookUrl] = useState("https://seu-sistema.com/webhook");
    const [showKey, setShowKey] = useState(false);

    const copyToClipboard = (text: string) => {
        alert(`Copiado: ${text}`);
    };

    return (
        <CRMAuthenticatedLayout title="Integração">
        <div className="space-y-6 animate-in fade-in duration-300 h-full flex flex-col">
             <div className="flex items-center justify-between border-b pb-2 border-zinc-800/50 shrink-0">
                <div>
                    <h1 className={cn("text-xl font-bold", isDark ? "text-white" : "text-zinc-900")}>Integração</h1>
                    <p className="text-xs text-zinc-500">Conecte o UazAPI aos seus sistemas e ao Google.</p>
                </div>
                <CRMButton variant="outline" size="sm" isDark={isDark}>
                    <Globe className="h-3 w-3 mr-1.5" /> Documentação
                </CRMButton>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Google Integration Card */}
                <div className={cn("p-5 rounded-xl border space-y-4 lg:col-span-1", isDark ? "bg-zinc-900/40 border-zinc-800" : "bg-white border-zinc-200 shadow-sm")}>
                    <h3 className={cn("text-sm font-bold flex items-center gap-2", isDark ? "text-white" : "text-zinc-900")}>
                        Google Workspace
                    </h3>
                    <p className="text-[10px] text-zinc-500">Sincronize emails e calendário.</p>
                    
                    <div className="space-y-3">
                        <div className={cn("p-3 rounded-lg border flex items-center justify-between", isDark ? "bg-zinc-950 border-zinc-800" : "bg-zinc-50 border-zinc-200")}>
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 bg-red-500/10 rounded flex items-center justify-center text-red-500">
                                    <Mail className="h-4 w-4" />
                                </div>
                                <span className={cn("text-xs font-medium", isDark ? "text-zinc-200" : "text-zinc-800")}>Gmail</span>
                            </div>
                            <CRMButton size="sm" variant="outline" isDark={isDark} className="h-7 text-[10px]">Conectar</CRMButton>
                        </div>

                        <div className={cn("p-3 rounded-lg border flex items-center justify-between", isDark ? "bg-zinc-950 border-zinc-800" : "bg-zinc-50 border-zinc-200")}>
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 bg-blue-500/10 rounded flex items-center justify-center text-blue-500">
                                    <Calendar className="h-4 w-4" />
                                </div>
                                <span className={cn("text-xs font-medium", isDark ? "text-zinc-200" : "text-zinc-800")}>Google Calendar</span>
                            </div>
                            <CRMButton size="sm" variant="outline" isDark={isDark} className="h-7 text-[10px]">Conectar</CRMButton>
                        </div>
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
                                <h3 className={cn("text-sm font-bold", isDark ? "text-white" : "text-zinc-900")}>API de Envio</h3>
                                <p className="text-[10px] text-zinc-500">Use esta chave para enviar mensagens via código.</p>
                            </div>
                        </div>
                        <CRMBadge variant="success" themeColor="emerald" isDark={isDark}>Ativo</CRMBadge>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Sua Chave de API</label>
                        <div className={cn("flex items-center gap-2 p-2 rounded-lg border", isDark ? "bg-zinc-950 border-zinc-800" : "bg-zinc-50 border-zinc-200")}>
                            <code className={cn("flex-1 text-xs font-mono truncate", isDark ? "text-zinc-300" : "text-zinc-700")}>
                                {showKey ? apiKey : "uaz_live_********************"}
                            </code>
                            <CRMButton variant="ghost" size="icon" isDark={isDark} onClick={() => setShowKey(!showKey)} title={showKey ? "Esconder" : "Mostrar"}>
                                {showKey ? <X className="h-3.5 w-3.5" /> : <span className="text-[10px] font-bold">VER</span>}
                            </CRMButton>
                            <CRMButton variant="ghost" size="icon" isDark={isDark} onClick={() => copyToClipboard(apiKey)} title="Copiar">
                                <Copy className="h-3.5 w-3.5" />
                            </CRMButton>
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
                                <h3 className={cn("text-sm font-bold", isDark ? "text-white" : "text-zinc-900")}>Webhooks</h3>
                                <p className="text-[10px] text-zinc-500">Receba eventos em tempo real.</p>
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
