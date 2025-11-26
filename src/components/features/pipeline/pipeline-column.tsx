'use client'

import Link from 'next/link'
import { Users } from 'lucide-react'

interface Contact {
  id: string
  name: string
  email?: string
  phone?: string
}

interface Stage {
  id: string
  label: string
  color: string
}

interface PipelineColumnProps {
  stage: Stage
  contacts: Contact[]
  onDragStart: (e: React.DragEvent, contact: Contact) => void
  onDragOver: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent, stageId: string) => void
}

export function PipelineColumn({
  stage,
  contacts,
  onDragStart,
  onDragOver,
  onDrop,
}: PipelineColumnProps) {
  return (
    <div
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, stage.id)}
      className={`${stage.color} rounded-lg p-4 min-h-96 flex flex-col`}
    >
      {/* Header */}
      <div className="mb-4">
        <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
          {stage.label}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {contacts.length} contato{contacts.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Cards */}
      <div className="space-y-3 flex-1">
        {contacts.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-gray-500 dark:text-gray-400 rounded-lg bg-white dark:bg-gray-800 bg-opacity-50">
            <div className="text-center">
              <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Nenhum contato</p>
            </div>
          </div>
        ) : (
          contacts.map((contact) => (
            <Link
              key={contact.id}
              href={`/contacts?contact_id=${contact.id}`}
              draggable
              onDragStart={(e) => onDragStart(e, contact)}
              className="block p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing hover:scale-105 transform"
            >
              <h4 className="font-medium text-gray-900 dark:text-white truncate">
                {contact.name}
              </h4>
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
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
