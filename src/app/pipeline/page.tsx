'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { uazapiClient } from '@/lib/api/uazapi-client'
import { PipelineBoard } from '@/components/features/pipeline/pipeline-board'
import { Loader2 } from 'lucide-react'

export default function PipelinePage() {
  const router = useRouter()
  const supabase = createClient()
  const [contacts, setContacts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

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

  const handleUpdateContact = async (id: string, updates: any) => {
    try {
      const contact = contacts.find(c => c.id === id)
      if (contact) {
        const result = await uazapiClient.contacts.updateContact(contact.phone || contact.number, updates.name)
        const updated = result?.data || { ...contact, ...updates }
        setContacts(contacts.map(c => c.id === id ? updated : c))
      }
    } catch (error) {
      console.error('Erro ao atualizar contato:', error)
      alert('Erro ao atualizar contato')
    }
  }

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Pipeline de Vendas
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Visualize e gerencie seu funil de vendas
          </p>
        </div>

        {/* Pipeline Board */}
        <PipelineBoard contacts={contacts} onUpdateContact={handleUpdateContact} />
      </div>
    </div>
  )
}
