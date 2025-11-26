'use client'

import { useState } from 'react'
import { Edit2, Save, X, Trash2 } from 'lucide-react'

interface Contact {
  id: string
  name: string
  email?: string
  phone?: string
  tags?: string[]
  pipeline_stage?: string
  created_at?: string
}

interface ContactDetailProps {
  contact: Contact
  onUpdate: (id: string, updates: any) => Promise<void>
  onDelete: (id: string) => void
}

export function ContactDetail({ contact, onUpdate, onDelete }: ContactDetailProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: contact.name,
    email: contact.email || '',
    phone: contact.phone || '',
    tags: contact.tags?.join(', ') || '',
    pipeline_stage: contact.pipeline_stage || 'lead',
  })

  const handleSave = async () => {
    try {
      setLoading(true)
      await onUpdate(contact.id, {
        name: formData.name,
        email: formData.email || null,
        phone: formData.phone || null,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : [],
        pipeline_stage: formData.pipeline_stage,
      })
      setIsEditing(false)
    } catch (error) {
      console.error('Erro ao salvar:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      name: contact.name,
      email: contact.email || '',
      phone: contact.phone || '',
      tags: contact.tags?.join(', ') || '',
      pipeline_stage: contact.pipeline_stage || 'lead',
    })
    setIsEditing(false)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {contact.name}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            ID: {contact.id.substring(0, 8)}...
          </p>
        </div>
        <div className="flex gap-2">
          {!isEditing && (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
              >
                <Edit2 className="h-5 w-5" />
              </button>
              <button
                onClick={() => onDelete(contact.id)}
                className="p-2 text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nome
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Telefone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Estágio do Pipeline
              </label>
              <select
                value={formData.pipeline_stage}
                onChange={(e) => setFormData({ ...formData, pipeline_stage: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="lead">Lead</option>
                <option value="prospect">Prospect</option>
                <option value="negotiation">Negociação</option>
                <option value="customer">Cliente</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tags
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="tag1, tag2, tag3"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={handleCancel}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
              >
                <X className="h-4 w-4" />
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Save className="h-4 w-4" />
                {loading ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {contact.email || '-'}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Telefone</p>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {contact.phone || '-'}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Estágio do Pipeline</p>
              <p className="text-lg font-medium text-gray-900 dark:text-white capitalize">
                {contact.pipeline_stage || '-'}
              </p>
            </div>

            {contact.tags && contact.tags.length > 0 && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {contact.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {contact.created_at && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Criado em</p>
                <p className="text-sm text-gray-900 dark:text-white">
                  {new Date(contact.created_at).toLocaleDateString('pt-BR')}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
