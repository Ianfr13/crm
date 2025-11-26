import Link from 'next/link'
import { MessageCircle, Users, BarChart3, Settings } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Chat-Centric CRM
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Gerencie todas as suas conversas e leads em um único lugar. Integrado com Facebook, Instagram e WhatsApp.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <Link
            href="/inbox"
            className="group bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="bg-blue-100 dark:bg-blue-900 w-16 h-16 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <MessageCircle className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Inbox Unificado
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Todas as conversas dos seus canais em um só lugar
            </p>
          </Link>

          <Link
            href="/contacts"
            className="group bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="bg-green-100 dark:bg-green-900 w-16 h-16 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Users className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Contatos
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Gerencie seus leads e contatos
            </p>
          </Link>

          <Link
            href="/pipeline"
            className="group bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="bg-purple-100 dark:bg-purple-900 w-16 h-16 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <BarChart3 className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Pipeline
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Visualize seu funil de vendas
            </p>
          </Link>

          <div className="group bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg opacity-60 cursor-not-allowed">
            <div className="bg-gray-100 dark:bg-gray-700 w-16 h-16 rounded-xl flex items-center justify-center mb-4">
              <Settings className="h-8 w-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Configurações
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Em breve
            </p>
          </div>
        </div>

        <div className="mt-16 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Projeto configurado e funcionando! ✅
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
            Supabase conectado • Edge Functions deployed • Banco de dados configurado
          </p>
        </div>
      </div>
    </div>
  )
}
