'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { uazapiClient } from '@/lib/api/uazapi-client'
import { ContactList } from '@/components/features/contacts/contact-list'
import { ContactDetail } from '@/components/features/contacts/contact-detail'
import { ContactForm } from '@/components/features/contacts/contact-form'
import { Loader2, Plus, X } from 'lucide-react'

function ContactsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  const [contacts, setContacts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [selectedContactId, setSelectedContactId] = useState<string | null>(
    searchParams.get('contact_id')
  )
  const [editingContact, setEditingContact] = useState<any>(null)

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    loadContacts()
  }, [])

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      router.push('/login')
    }
  }

  const loadContacts = async () => {
    try {
      setLoading(true)
      const data = await uazapiClient.contacts.listContacts()
      setContacts(data?.data || [])
    } catch (error) {
      console.error('Erro ao carregar contatos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddContact = async (formData: any) => {
    try {
      const result = await uazapiClient.contacts.createContact(formData.name, formData.phone || formData.email)
      const newContact = result?.data || formData
      setContacts([newContact, ...contacts])
      setShowForm(false)
      setSelectedContactId(newContact.id)
    } catch (error) {
      console.error('Erro ao criar contato:', error)
      alert('Erro ao criar contato')
    }
  }

  const handleUpdateContact = async (id: string, updates: any) => {
    try {
      const contact = contacts.find(c => c.id === id)
      if (contact) {
        const result = await uazapiClient.contacts.updateContact(contact.phone || contact.number, updates.name)
        const updated = result?.data || { ...contact, ...updates }
        setContacts(contacts.map(c => c.id === id ? updated : c))
      }
      setEditingContact(null)
    } catch (error) {
      console.error('Erro ao atualizar contato:', error)
      alert('Erro ao atualizar contato')
    }
  }

  const handleDeleteContact = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este contato?')) return

    try {
      const contact = contacts.find(c => c.id === id)
      if (contact) {
        await uazapiClient.contacts.deleteContact(contact.phone || contact.number)
      }
      setContacts(contacts.filter(c => c.id !== id))
      if (selectedContactId === id) {
        setSelectedContactId(null)
      }
    } catch (error) {
      console.error('Erro ao deletar contato:', error)
      alert('Erro ao deletar contato')
    }
  }

  const selectedContact = contacts.find(c => c.id === selectedContactId)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Contatos
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Gerencie todos os seus contatos e leads
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="h-5 w-5" />
            Novo Contato
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Novo Contato
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <ContactForm
                onSubmit={handleAddContact}
                onCancel={() => setShowForm(false)}
              />
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* List */}
          <div className="lg:col-span-1">
            <ContactList
              contacts={contacts}
              selectedId={selectedContactId}
              onSelect={setSelectedContactId}
              onDelete={handleDeleteContact}
            />
          </div>

          {/* Detail */}
          <div className="lg:col-span-2">
            {selectedContact ? (
              <ContactDetail
                contact={selectedContact}
                onUpdate={handleUpdateContact}
                onDelete={handleDeleteContact}
              />
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
                <p className="text-gray-500 dark:text-gray-400">
                  Selecione um contato para visualizar detalhes
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ContactsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div>}>
      <ContactsContent />
    </Suspense>
  )
}
