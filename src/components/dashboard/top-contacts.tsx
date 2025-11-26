'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { apiClient } from '@/lib/api/client'
import { Users, Loader2 } from 'lucide-react'

export function TopContacts() {
  const [contacts, setContacts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadContacts()
  }, [])

  const loadContacts = async () => {
    try {
      setLoading(true)
      const data = await apiClient.getContacts()
      setContacts(data?.slice(0, 5) || [])
    } catch (error) {
      console.error('Erro ao carregar contatos:', error)
    } finally {
      setLoading(false)
    }
  }

  const getPipelineColor = (stage: string) => {
    const colors: Record<string, string> = {
      lead: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      prospect: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      negotiation: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      customer: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    }
    return colors[stage] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-green-600" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Contatos Recentes
          </h2>
        </div>
      </div>

      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {contacts.length === 0 ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            Nenhum contato encontrado
          </div>
        ) : (
          contacts.map((contact) => (
            <Link
              key={contact.id}
              href={`/contacts?contact_id=${contact.id}`}
              className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors block"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {contact.name}
                  </h3>
                  {contact.phone && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {contact.phone}
                    </p>
                  )}
                  {contact.email && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {contact.email}
                    </p>
                  )}
                </div>
                {contact.pipeline_stage && (
                  <span className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ml-2 ${getPipelineColor(contact.pipeline_stage)}`}>
                    {contact.pipeline_stage}
                  </span>
                )}
              </div>
            </Link>
          ))
        )}
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <Link
          href="/contacts"
          className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 text-sm font-medium"
        >
          Ver todos os contatos →
        </Link>
      </div>
    </div>
  )
}
