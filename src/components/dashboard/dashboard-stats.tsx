'use client'

import { useEffect, useState } from 'react'
import { Users, MessageSquare, TrendingUp, Clock } from 'lucide-react'
import { apiClient } from '@/lib/api/client'

export function DashboardStats() {
  const [stats, setStats] = useState({
    totalContacts: 0,
    totalConversations: 0,
    openConversations: 0,
    averageResponseTime: '0h',
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      setLoading(true)
      const [contacts, conversations] = await Promise.all([
        apiClient.getContacts(),
        apiClient.getConversations(),
      ])

      const openConvs = conversations?.filter((c: any) => c.status === 'open').length || 0

      setStats({
        totalContacts: contacts?.length || 0,
        totalConversations: conversations?.length || 0,
        openConversations: openConvs,
        averageResponseTime: '< 1h',
      })
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      label: 'Total de Contatos',
      value: stats.totalContacts,
      icon: Users,
      color: 'bg-blue-100 dark:bg-blue-900',
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      label: 'Total de Conversas',
      value: stats.totalConversations,
      icon: MessageSquare,
      color: 'bg-green-100 dark:bg-green-900',
      iconColor: 'text-green-600 dark:text-green-400',
    },
    {
      label: 'Conversas Abertas',
      value: stats.openConversations,
      icon: TrendingUp,
      color: 'bg-purple-100 dark:bg-purple-900',
      iconColor: 'text-purple-600 dark:text-purple-400',
    },
    {
      label: 'Tempo Médio de Resposta',
      value: stats.averageResponseTime,
      icon: Clock,
      color: 'bg-orange-100 dark:bg-orange-900',
      iconColor: 'text-orange-600 dark:text-orange-400',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((card, index) => {
        const Icon = card.icon
        return (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                  {card.label}
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {loading ? '-' : card.value}
                </p>
              </div>
              <div className={`${card.color} p-3 rounded-lg`}>
                <Icon className={`h-6 w-6 ${card.iconColor}`} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
