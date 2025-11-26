'use client'

import { useState, useEffect } from 'react'
import { uazapiClient } from '@/lib/api/uazapi-client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Loader2, RefreshCw, Smartphone } from 'lucide-react'

export function ConnectInstance({ onConnected }: { onConnected: () => void }) {
    const [status, setStatus] = useState<string>('checking')
    const [qrCode, setQrCode] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [debugData, setDebugData] = useState<any>(null)

    useEffect(() => {
        checkStatus()
        const interval = setInterval(checkStatus, 5000) // Poll every 5s
        return () => clearInterval(interval)
    }, [])

    const checkStatus = async () => {
        try {
            const res = await uazapiClient.instance.getInstanceStatus()
            setDebugData(res) // Save full response for debugging
            
            if (res.success) {
                console.log('ConnectInstance status response:', res.data)
                // Handle different response structures
                const rawStatus = res.data.status || res.data.instance?.status
                let statusString = rawStatus
                    ? (typeof rawStatus === 'object' ? (rawStatus.status || 'unknown') : rawStatus)
                    : (res.data.connected ? 'connected' : 'disconnected')

                if (typeof statusString === 'string') {
                    statusString = statusString.toLowerCase()
                }

                setStatus(statusString)

                if (statusString === 'open' || statusString === 'connected') {
                    onConnected()
                } else if (res.data.qrcode || res.data.base64 || res.data.instance?.qrcode) {
                    setQrCode(res.data.qrcode || res.data.base64 || res.data.instance?.qrcode)
                }
            } else {
                // Handle unsuccessful response
                setStatus('error')
            }
        } catch (error) {
            console.error('Error checking status:', error)
            setStatus('error')
        }
    }

    const handleConnect = async () => {
        try {
            setLoading(true)
            const res = await uazapiClient.instance.connectInstance('')
            if (res.success && res.data.qrcode) {
                setQrCode(res.data.qrcode)
            }
            checkStatus()
        } catch (error) {
            console.error('Error connecting:', error)
        } finally {
            setLoading(false)
        }
    }

    if (status === 'open') {
        return null // Already connected
    }

    return (
        <Card className="w-full max-w-md mx-auto mt-8">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Smartphone className="h-6 w-6 text-green-600" />
                    Conectar WhatsApp
                </CardTitle>
                <CardDescription>
                    Escaneie o QR Code para conectar sua instância e começar a usar o chat.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-6">
                {qrCode ? (
                    <div className="flex flex-col items-center space-y-4">
                        <div className="relative">
                            <img
                                src={qrCode}
                                alt="QR Code WhatsApp"
                                className="w-64 h-64 border-4 border-white shadow-lg rounded-lg"
                            />
                            {loading && (
                                <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                                    <Loader2 className="h-8 w-8 animate-spin text-green-600" />
                                </div>
                            )}
                        </div>
                        <p className="text-sm text-muted-foreground text-center">
                            Abra o WhatsApp no seu celular {'>'} Menu {'>'} Aparelhos conectados {'>'} Conectar aparelho
                        </p>
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="mb-4 text-muted-foreground">
                            Sua instância não está conectada.
                        </p>
                        <Button onClick={handleConnect} disabled={loading} className="bg-green-600 hover:bg-green-700">
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Gerando QR Code...
                                </>
                            ) : (
                                'Gerar QR Code'
                            )}
                        </Button>
                    </div>
                )}

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <RefreshCw className={`h-4 w-4 ${status === 'checking' ? 'animate-spin' : ''}`} />
                    Status: <span className="font-medium capitalize">{status}</span>
                </div>
                
                {/* Debug Info */}
                <div className="w-full mt-4 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono overflow-auto max-h-32">
                    <p className="font-bold mb-1">Debug Info:</p>
                    <pre>{JSON.stringify(debugData, null, 2)}</pre>
                </div>
            </CardContent>
        </Card>
    )
}
