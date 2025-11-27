'use client';
import { useState, useEffect } from 'react';
import { 
  KanbanSquare, 
  Plus,
  ChevronDown,
  Edit2,
  MoreHorizontal
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { CRMButton } from '@/components/ui/crm-button';
import { CRMBadge } from '@/components/ui/crm-badge';
import { useCRMTheme } from '@/providers/crm-theme-provider';
import { CRMAuthenticatedLayout } from '@/components/layout/crm-authenticated-layout';
import { CreateLeadModal } from '@/components/modals/create-lead-modal';
import { ContactDetailDrawer } from '@/components/drawers/contact-detail-drawer';

export default function PipelinePage() {
  const { themeColor, isDark } = useCRMTheme();
  const [createLeadOpen, setCreateLeadOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [pipelines, setPipelines] = useState(['Vendas Padrão', 'Pós-Venda', 'Parcerias']);
  const [currentPipeline, setCurrentPipeline] = useState('Vendas Padrão');
  
  const [stages, setStages] = useState<any[]>([]);
  const [cards, setCards] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/pipeline')
      .then(res => res.json())
      .then(data => {
        setStages(data.stages);
        setCards(data.cards);
      })
      .catch(err => console.error('Failed to fetch pipeline data', err));
  }, []);

  const addStage = () => {
      const newId = `stage-${stages.length + 1}`;
      setStages([...stages, { id: newId, title: 'Nova Etapa', color: 'bg-zinc-500' }]);
  };

  // -- Drag & Drop Logic --
  const handleDragStart = (e: React.DragEvent, cardId: number) => {
      e.dataTransfer.setData('cardId', cardId.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault(); // Necessary to allow dropping
  };

  const handleDrop = (e: React.DragEvent, targetStage: string) => {
      e.preventDefault();
      const cardId = parseInt(e.dataTransfer.getData('cardId'));
      
      // Optimistic Update
      const oldCards = [...cards];
      setCards(cards.map(card => card.id === cardId ? { ...card, stage: targetStage } : card));

      // Backend Sync
      fetch('/api/pipeline', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'move', cardId, targetStage })
      }).catch(err => {
          console.error('Failed to sync move', err);
          setCards(oldCards); // Revert on error
      });
  };

  const handleSaveLead = (leadData: any) => {
      // Optimistic Create
      const tempId = Date.now();
      const newCard = { 
          id: tempId, 
          stage: leadData.stage, 
          name: leadData.name, 
          value: leadData.value, 
          tags: ['Novo'],
          role: 'Lead',
          email: 'pendente@email.com',
          phone: leadData.phone
      };
      setCards([...cards, newCard]);

      // Backend Sync
      fetch('/api/pipeline', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'create', data: leadData })
      })
      .then(res => res.json())
      .then(data => {
          if(data.success && data.card) {
              // Update with real ID from backend if needed, though here we used Date.now() in backend too
              setCards(prev => prev.map(c => c.id === tempId ? data.card : c));
          }
      })
      .catch(err => console.error('Failed to create lead', err));
  };

  return (
    <CRMAuthenticatedLayout title="Pipeline">
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4 border-b border-zinc-800/50 pb-2">
        <div className="flex items-center gap-3">
            <div className="relative group">
                <select 
                    value={currentPipeline} 
                    onChange={(e) => setCurrentPipeline(e.target.value)}
                    className={cn(
                        "appearance-none bg-transparent font-bold text-lg pr-8 cursor-pointer focus:outline-none",
                        isDark ? "text-white" : "text-zinc-900"
                    )}
                >
                    {pipelines.map(p => <option key={p} value={p} className="text-black">{p}</option>)}
                    <option value="new">+ Criar Pipeline</option>
                </select>
                <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
            </div>
            <CRMButton variant="ghost" size="icon" isDark={isDark} title="Editar Nome do Pipeline">
                <Edit2 className="h-3.5 w-3.5 text-zinc-500" />
            </CRMButton>
        </div>
        <div className="flex gap-2">
            <CRMButton size="sm" variant="outline" isDark={isDark} onClick={addStage}>
                <KanbanSquare className="h-3 w-3 mr-1.5" /> Nova Etapa
            </CRMButton>
            <CRMButton size="sm" themeColor={themeColor} isDark={isDark} onClick={() => setCreateLeadOpen(true)}>
                <Plus className="h-3 w-3 mr-1.5" /> Novo Contato
            </CRMButton>
        </div>
      </div>

      <div className="flex-1 flex gap-2 overflow-x-auto pb-2">
        {stages.map((stage) => (
          <div 
            key={stage.id} 
            className={cn(
                "min-w-[200px] w-[200px] flex flex-col h-full rounded-xl border transition-colors",
                isDark ? "bg-zinc-900/20 border-zinc-800/50" : "bg-white/40 border-zinc-200/60"
            )}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, stage.id)}
          >
            <div className={cn("p-2 flex items-center justify-between border-b", isDark ? "border-zinc-800/50" : "border-zinc-200/50")}>
              <div className="flex items-center gap-1.5">
                <div className={cn("h-1.5 w-1.5 rounded-full", stage.color)} />
                <span className={cn("font-semibold text-xs truncate max-w-[100px]", isDark ? "text-zinc-200" : "text-zinc-800")}>{stage.title}</span>
                <span className={cn("text-[9px] px-1 rounded text-zinc-500 bg-zinc-500/10")}>{cards.filter(c => c.stage === stage.id).length}</span>
              </div>
              <MoreHorizontal className="h-3.5 w-3.5 text-zinc-500 cursor-pointer hover:text-foreground shrink-0" />
            </div>
            
            <div className="p-1.5 space-y-1.5 flex-1 overflow-y-auto">
              {cards.filter(c => c.stage === stage.id).map(card => (
                <div 
                    key={card.id} 
                    draggable
                    onDragStart={(e) => handleDragStart(e, card.id)}
                    onClick={() => setSelectedContact(card)}
                    className={cn(
                        "group p-2.5 rounded-lg shadow-sm hover:shadow-md border transition-all cursor-grab active:cursor-grabbing",
                        isDark 
                            ? "bg-zinc-900 hover:bg-zinc-800 border-zinc-800" 
                            : "bg-white hover:bg-zinc-50 border-zinc-200"
                )}>
                  <div className="flex flex-wrap gap-1 mb-1.5">
                    {card.tags?.map((tag: string) => (
                      <CRMBadge key={tag} variant={tag === 'Urgente' ? 'warning' : 'default'} themeColor={themeColor} isDark={isDark}>{tag}</CRMBadge>
                    ))}
                  </div>
                  <h4 className={cn("font-semibold text-xs mb-0.5 truncate", isDark ? "text-zinc-200" : "text-zinc-900")}>{card.name}</h4>
                  <p className="text-[10px] text-zinc-500">{card.value}</p>
                </div>
              ))}
              <button onClick={() => setCreateLeadOpen(true)} className={cn("w-full py-1 text-[10px] font-medium rounded border border-dashed flex items-center justify-center gap-1 opacity-60 hover:opacity-100", isDark ? "border-zinc-800 text-zinc-500 hover:bg-zinc-800" : "border-zinc-300 text-zinc-500 hover:bg-zinc-50")}>
                <Plus className="h-3 w-3" /> Adicionar
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <CreateLeadModal
        isOpen={createLeadOpen}
        onClose={() => setCreateLeadOpen(false)}
        onSave={handleSaveLead}
        isDark={isDark}
        themeColor={themeColor}
        stages={stages}
      />

      <ContactDetailDrawer 
        contact={selectedContact} 
        onClose={() => setSelectedContact(null)}
        isDark={isDark}
        themeColor={themeColor}
      />
    </div>
    </CRMAuthenticatedLayout>
  );
};
