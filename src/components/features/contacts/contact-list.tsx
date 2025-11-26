'use client'

import { useState } from 'react'
import { Search, Trash2 } from 'lucide-react'

interface Contact {
  id: string
  name: string
  email?: string
  phone?: string
  pipeline_stage?: string
}

interface ContactListProps {
  contacts: Contact[]
  selectedId: string | null
  onSelect: (id: string) => void
  onDelete: (id: string) => void
}

export function ContactList({
  contacts,
  selectedId,
  onSelect,
  onDelete,
}: ContactListProps) {
  const [search, setSearch] = useState('')

  const filtered = contacts.filter(
    c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase()) ||
      c.phone?.includes(search)
  )

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      {/* Search */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar contatos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* List */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-96 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            Nenhum contato encontrado
          </div>
        ) : (
          filtered.map((contact) => (
            <div
              key={contact.id}
              className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 ${
                selectedId === contact.id
                  ? 'bg-blue-50 dark:bg-blue-900'
                  : ''
              }`}
              onClick={() => onSelect(contact.id)}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 dark:text-white truncate">
                    {contact.name}
                  </h3>
                  {contact.phone && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {contact.phone}
                    </p>
                  )}
                  {contact.email && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {contact.email}
                    </p>
                  )}
                  {contact.pipeline_stage && (
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {contact.pipeline_stage}
                    </p>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete(contact.id)
                  }}
                  className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
