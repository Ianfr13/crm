'use client'

import { useState, useEffect } from 'react'
import { uazapiClient } from '@/lib/api/uazapi-client'
import { contactService, Contact } from '@/lib/services/contact-service'
import { Loader2, X, Users, Check, Search, Plus } from 'lucide-react'

interface CreateGroupDialogProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function CreateGroupDialog({ isOpen, onClose, onSuccess }: CreateGroupDialogProps) {
  const [step, setStep] = useState<'details' | 'participants'>('details')
  const [groupName, setGroupName] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingContacts, setLoadingContacts] = useState(false)
  const [contacts, setContacts] = useState<Contact[]>([])
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([])

  // Load contacts when opening, but don't block rendering.
  // Rely on contactService cache for speed.
  useEffect(() => {
    if (isOpen) {
      setStep('details')
      setGroupName('')
      setSearchQuery('')
      setSelectedParticipants([])
      
      // Optimistic: If we have cached contacts, show them immediately
      contactService.getContacts(false).then(data => {
        if (data && data.length > 0) setContacts(data)
      })
      
      // Then refresh in background
      loadContacts()
    }
  }, [isOpen])

  const loadContacts = async () => {
    try {
      setLoadingContacts(true)
      // Force refresh from API
      const contactsData = await contactService.getContacts(true)
      setContacts(contactsData)
    } catch (error) {
      console.error('Error loading contacts:', error)
    } finally {
      setLoadingContacts(false)
    }
  }

  const handleSubmit = async () => {
    if (!groupName.trim() || selectedParticipants.length === 0) return

    try {
      setLoading(true)
      // Format participants as phone numbers (only digits)
      // The API seems to expect just the phone numbers array, and handles JID conversion internally or expects plain numbers
      // If previous attempts with JID suffix failed, let's try sending JUST the numbers.
      // However, some APIs require the full JID. Let's check the error message if possible.
      // Assuming the user tried both and failed, let's try a cleaner approach:
      // 1. Clean non-digits
      // 2. Ensure country code (if missing, maybe that's the issue? Hard to guess without user input)
      // Let's revert to sending just numbers as string[], similar to how individual messages are sent
      
      const formattedParticipants = selectedParticipants.map(p => p.replace(/\D/g, ''))
      
      console.log('Creating group:', { groupName, formattedParticipants })
      
      const res = await uazapiClient.groups.createGroup(groupName, formattedParticipants)
      console.log('Create group response:', res)

      if (res.success) {
        onSuccess()
        onClose()
      } else {
        throw new Error(res.error || res.message || 'Falha desconhecida')
      }
    } catch (error: any) {
      console.error('Error creating group:', error)
      alert(`Erro ao criar grupo: ${error.message || error}`)
    } finally {
      setLoading(false)
    }
  }

  const toggleParticipant = (number: string) => {
    if (selectedParticipants.includes(number)) {
      setSelectedParticipants(prev => prev.filter(n => n !== number))
    } else {
      setSelectedParticipants(prev => [...prev, number])
    }
  }

  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.number.includes(searchQuery)
  )

  const isSearchNumber = /^\d{10,15}$/.test(searchQuery.replace(/\D/g, ''))
  const isNumberInList = contacts.some(c => c.number === searchQuery.replace(/\D/g, ''))

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Novo Grupo
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {step === 'details' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nome do Grupo
                </label>
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Digite o nome do grupo"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  maxLength={25}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {groupName.length}/25 caracteres
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Participantes selecionados: {selectedParticipants.length}
                </span>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar contatos ou digitar número..."
                  className="w-full pl-9 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              
              {loadingContacts ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
              ) : (
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {/* Manual add option */}
                  {isSearchNumber && !isNumberInList && (
                    <button
                      onClick={() => {
                        const number = searchQuery.replace(/\D/g, '')
                        if (!contacts.some(c => c.number === number)) {
                            const newContact = { number, name: number }
                            setContacts(prev => [newContact, ...prev])
                            toggleParticipant(number)
                            setSearchQuery('')
                        }
                      }}
                      className="w-full flex items-center p-2 rounded-lg border border-dashed border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                    >
                        <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center flex-shrink-0">
                            <Plus className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="ml-3 flex-1 text-left">
                            <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                                Adicionar número: {searchQuery}
                            </p>
                        </div>
                    </button>
                  )}

                  {filteredContacts.length === 0 && !isSearchNumber ? (
                    <p className="text-center text-gray-500 py-8">
                      Nenhum contato encontrado
                    </p>
                  ) : (
                    filteredContacts.map(contact => (
                    <button
                      key={contact.number}
                      onClick={() => toggleParticipant(contact.number)}
                      className={`w-full flex items-center p-2 rounded-lg border transition-colors ${
                        selectedParticipants.includes(contact.number)
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {contact.profilePicUrl ? (
                          <img src={contact.profilePicUrl} alt={contact.name} className="h-full w-full object-cover" />
                        ) : (
                          <Users className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                        )}
                      </div>
                      <div className="ml-3 flex-1 text-left min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {contact.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {contact.number}
                        </p>
                      </div>
                      <div className="ml-2 flex items-center justify-center h-5 w-5">
                        <input
                            type="checkbox"
                            checked={selectedParticipants.includes(contact.number)}
                            readOnly
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </div>
                    </button>
                  )))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-2">
          {step === 'details' ? (
            <button
              onClick={() => setStep('participants')}
              disabled={!groupName.trim()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Próximo: Participantes
            </button>
          ) : (
            <>
              <button
                onClick={() => setStep('details')}
                className="px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors"
              >
                Voltar
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading || selectedParticipants.length === 0}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Criando...
                  </>
                ) : (
                  'Criar Grupo'
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
