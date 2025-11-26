'use client'

import { useState } from 'react'
import { PipelineColumn } from './pipeline-column'

interface Contact {
  id: string
  name: string
  email?: string
  phone?: string
  pipeline_stage?: string
}

interface PipelineBoardProps {
  contacts: Contact[]
  onUpdateContact: (id: string, updates: any) => Promise<void>
}

export function PipelineBoard({ contacts, onUpdateContact }: PipelineBoardProps) {
  const stages = [
    { id: 'lead', label: 'Lead', color: 'bg-blue-50 dark:bg-blue-900' },
    { id: 'prospect', label: 'Prospect', color: 'bg-purple-50 dark:bg-purple-900' },
    { id: 'negotiation', label: 'Negociação', color: 'bg-yellow-50 dark:bg-yellow-900' },
    { id: 'customer', label: 'Cliente', color: 'bg-green-50 dark:bg-green-900' },
  ]

  const handleDragStart = (e: React.DragEvent, contact: Contact) => {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('contact', JSON.stringify(contact))
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = async (e: React.DragEvent, stageId: string) => {
    e.preventDefault()
    const contactData = e.dataTransfer.getData('contact')
    if (!contactData) return

    try {
      const contact = JSON.parse(contactData)
      if (contact.pipeline_stage !== stageId) {
        await onUpdateContact(contact.id, { pipeline_stage: stageId })
      }
    } catch (error) {
      console.error('Erro ao mover contato:', error)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stages.map((stage) => (
        <PipelineColumn
          key={stage.id}
          stage={stage}
          contacts={contacts.filter(c => (c.pipeline_stage || 'lead') === stage.id)}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        />
      ))}
    </div>
  )
}
