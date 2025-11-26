'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { uazapiClient } from '@/lib/api/uazapi-client'
import { Loader2, QrCode, CheckCircle, AlertCircle, Smartphone } from 'lucide-react'

export default function IntegrationPage() {
  const router = useRouter()
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState<'idle' | 'connecting' | 'connected'>('idle')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [pairingCode, setPairingCode] = useState<string | null>(null)
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [instanceStatus, setInstanceStatus] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    checkIntegrationStatus()
    const interval = setInterval(checkIntegrationStatus, 5000)
    return () => clearInterval(interval)
  }, [])

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      router.push('/login')
    } else {
      setLoading(false)
    }
  }

  const checkIntegrationStatus = async () => {
    try {
      const data = await uazapiClient.instance.getInstanceStatus()
      setInstanceStatus(data)
      if (data?.data?.connected) {
        setStatus('connected')
      }
    } catch (error) {
      console.error('Erro ao verificar status:', error)
    }
  }

  const handleCreateInstance = async () => {
    try {
      setStatus('connecting')
      setError(null)
      const result = await uazapiClient.admin.createInstance('CRM Instance')
      setInstanceStatus(result)
      // Auto-fetch connection (QR or Pairing)
      await handleConnect()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar instância')
      setStatus('idle')
    }
  }

  const handleConnect = async () => {
    try {
      // If phone number is provided, clean it
      const cleanPhone = phoneNumber.replace(/\D/g, '')
      const response = await uazapiClient.instance.connectInstance(cleanPhone || undefined)

      // Extract data from response
      // Structure based on user log: response.data.instance.paircode / qrcode
      const instanceData = response?.data?.instance || response?.data || {}

      const pairCode = instanceData.paircode || instanceData.pairingCode || response?.data?.paircode || response?.data?.pairingCode
      const qr = instanceData.qrcode || instanceData.qr || instanceData.base64 || response?.data?.qrcode || response?.data?.qr || response?.data?.base64

      if (cleanPhone) {
        // Pairing Code flow
        setPairingCode(pairCode || null)
        setQrCode(null)
      } else {
        // QR Code flow
        // If we have a paircode but no QR code (or empty), show paircode as fallback or if it was returned
        if (qr && qr !== "") {
          setQrCode(qr)
          setPairingCode(null)
        } else if (pairCode) {
          setPairingCode(pairCode)
          setQrCode(null)
        } else {
          setQrCode(null)
          setPairingCode(null)
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao conectar')
    }
  }

  const handleDisconnect = async () => {
    try {
      setLoading(true)
      await uazapiClient.instance.disconnectInstance('CRMInstance')
      setStatus('idle')
      setQrCode(null)
      setPairingCode(null)
      setInstanceStatus(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao desconectar')
    } finally {
      setLoading(false)
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Integração WhatsApp
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Conecte sua conta do WhatsApp para enviar e receber mensagens
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-red-900 dark:text-red-200">Erro</p>
              <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
            </div>
          </div>
        )}

        {/* Status Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Status da Conexão
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {status === 'connected' ? 'Conectado ao WhatsApp' : 'Não conectado'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {status === 'connected' ? (
                <CheckCircle className="h-8 w-8 text-green-600" />
              ) : (
                <AlertCircle className="h-8 w-8 text-gray-400" />
              )}
            </div>
          </div>

          {/* Instance Info */}
          {instanceStatus && (
            <div className="space-y-2 text-sm mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p>
                <span className="font-medium text-gray-700 dark:text-gray-300">ID da Instância:</span>
                <span className="text-gray-600 dark:text-gray-400 ml-2">
                  {(instanceStatus.data?.instance?.id || instanceStatus.instance?.id)?.substring(0, 8)}...
                </span>
              </p>
              <p>
                <span className="font-medium text-gray-700 dark:text-gray-300">Status:</span>
                <span className="text-gray-600 dark:text-gray-400 ml-2">
                  {instanceStatus.data?.connected || instanceStatus.connected ? 'Conectado' : 'Desconectado'}
                </span>
              </p>
            </div>
          )}

          {/* Connection Options */}
          {status === 'idle' && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Número do WhatsApp (Opcional - para Código de Pareamento)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="5511999999999"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Deixe em branco para gerar um QR Code.
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            {status === 'idle' ? (
              <button
                onClick={handleCreateInstance}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Smartphone className="h-4 w-4" />
                )}
                {loading ? 'Conectando...' : (phoneNumber ? 'Gerar Código de Pareamento' : 'Gerar QR Code')}
              </button>
            ) : (
              <button
                onClick={handleDisconnect}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg transition-colors"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                Desconectar
              </button>
            )}
          </div>
        </div>

        {/* Pairing Code Display */}
        {pairingCode && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center gap-2 mb-6">
              <Smartphone className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Código de Pareamento
              </h3>
            </div>
            <div className="flex flex-col items-center gap-6">
              <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg">
                <p className="text-4xl font-mono font-bold text-gray-900 dark:text-white tracking-wider">
                  {pairingCode}
                </p>
              </div>
              <div className="text-center">
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  Digite este código no seu WhatsApp:
                </p>
                <p className="text-sm text-gray-500">
                  Configurações → Dispositivos Vinculados → Vincular dispositivo → Vincular com número de telefone
                </p>
              </div>
            </div>
          </div>
        )}

        {/* QR Code Display */}
        {qrCode && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center gap-2 mb-6">
              <QrCode className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Escaneie o QR Code
              </h3>
            </div>

            <div className="flex flex-col items-center gap-6">
              <div className="bg-white p-4 rounded-lg">
                <img
                  src={qrCode}
                  alt="QR Code"
                  className="w-64 h-64"
                />
              </div>

              <div className="text-center">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Use seu telefone com WhatsApp para escanear este código
                </p>
                <button
                  onClick={handleConnect}
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
                >
                  Gerar novo QR Code
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-6 mt-8">
          <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-3">
            Como conectar seu WhatsApp:
          </h3>
          <ol className="space-y-2 text-sm text-blue-800 dark:text-blue-300 list-decimal list-inside">
            <li>Digite seu número (opcional) ou deixe em branco para QR Code</li>
            <li>Clique no botão de conexão</li>
            <li>Abra o WhatsApp no seu telefone</li>
            <li>Vá para Configurações → Dispositivos Vinculados</li>
            <li>Clique em "Vincular um dispositivo"</li>
            <li>Escaneie o QR Code ou digite o Código de Pareamento</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
