"use client"

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function UazapiTestPage() {
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<any>(null)
    const [error, setError] = useState<string | null>(null)
    const [integration, setIntegration] = useState<any>(null)

    // Message sending state
    const [conversationId, setConversationId] = useState('')
    const [message, setMessage] = useState('Teste de mensagem via uazapi')

    // Instance management state
    const [instanceName, setInstanceName] = useState('')
    const [qrCode, setQrCode] = useState<string | null>(null)

    const SUPABASE_URL = 'https://vglhaxrdsvqbwvyywexd.supabase.co'
    const supabase = createClient()

    useEffect(() => {
        fetchIntegration()
    }, [])

    const fetchIntegration = async () => {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) return

        try {
            const response = await fetch(`${SUPABASE_URL}/functions/v1/uazapi-integration`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${session.access_token}`
                }
            })
            if (response.ok) {
                const data = await response.json()
                setIntegration(data)
            }
        } catch (err) {
            console.error('Error fetching integration:', err)
        }
    }

    const handleCreateInstance = async () => {
        setLoading(true)
        setError(null)
        setResult(null)

        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
            setError('Unauthorized')
            setLoading(false)
            return
        }

        try {
            const response = await fetch(`${SUPABASE_URL}/functions/v1/uazapi-integration?action=create_instance`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`
                },
                body: JSON.stringify({
                    instance_name: instanceName || undefined
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create instance')
            }

            setResult(data)
            await fetchIntegration() // Refresh integration details
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleGetQrCode = async () => {
        setError(err.message)
    } finally {
        setLoading(false)
    }
}

const handleCheckStatus = async () => {
    setLoading(true)
    setError(null)
    setResult(null)

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
        setError('Unauthorized')
        setLoading(false)
        return
    }

    try {
        const response = await fetch(`${SUPABASE_URL}/functions/v1/uazapi-integration?action=test`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${session.access_token}`
            }
        })

        const data = await response.json()
        setResult(data)
    } catch (err: any) {
        setError(err.message)
    } finally {
        setLoading(false)
    }
}

const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
        setError('Unauthorized')
        setLoading(false)
        return
    }

    try {
        const response = await fetch(`${SUPABASE_URL}/functions/v1/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.access_token}`
            },
            body: JSON.stringify({
                conversation_id: conversationId,
                content: message,
                type: 'text'
            }),
        })

        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.error || 'Failed to send message')
        }

        setResult('Mensagem enviada com sucesso!')
        console.log('Message sent:', data)
    } catch (err: any) {
        setError(err.message)
        console.error('Error sending message:', err)
    } finally {
        setLoading(false)
    }
}

return (
    <div className="p-8 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">uazapi Manager & Test</h1>

        {/* Integration Details */}
        <div className="bg-gray-100 p-4 rounded mb-6">
            <h2 className="font-bold mb-2">Current Integration</h2>
            {integration ? (
                <div className="text-sm">
                    <p><strong>Instance Token:</strong> {integration.instance_token || 'Not created yet'}</p>
                    <p><strong>Active:</strong> {integration.active ? 'Yes' : 'No'}</p>
                    <p className="text-xs text-gray-500 mt-2">
                        <em>Base URL and Admin Token are configured via Supabase Secrets</em>
                    </p>
                </div>
            ) : (
                <p>No integration found. Create an instance to get started.</p>
            )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Instance Management */}
            <div className="space-y-6">
                <div className="border p-4 rounded">
                    <h2 className="font-bold mb-4">1. Create Instance</h2>
                    <div className="space-y-2">
                        <input
                            type="text"
                            placeholder="Instance Name (optional)"
                            value={instanceName}
                            onChange={(e) => setInstanceName(e.target.value)}
                            className="w-full p-2 border rounded"
                        />
                        <button
                            onClick={handleCreateInstance}
                            disabled={loading}
                            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? 'Creating...' : 'Create Instance'}
                        </button>
                    </div>
                </div>

                <div className="border p-4 rounded">
                    <h2 className="font-bold mb-4">2. Connect (QR Code)</h2>
                    <button
                        onClick={handleGetQrCode}
                        disabled={loading || !integration?.instance_token}
                        className="w-full bg-purple-600 text-white p-2 rounded hover:bg-purple-700 disabled:opacity-50 mb-4"
                    >
                        {loading ? 'Loading...' : 'Get QR Code'}
                    </button>

                    {qrCode && (
                        <div className="text-center">
                            <img src={qrCode} alt="WhatsApp QR Code" className="mx-auto max-w-[250px]" />
                            <p className="text-xs text-gray-500 mt-2">Scan with WhatsApp</p>
                        </div>
                    )}
                </div>

                <div className="border p-4 rounded">
                    <h2 className="font-bold mb-4">3. Check Status</h2>
                    <button
                        onClick={handleCheckStatus}
                        disabled={loading || !integration?.instance_token}
                        className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 disabled:opacity-50"
                    >
                        {loading ? 'Checking...' : 'Check Connection Status'}
                    </button>
                </div>
            </div>

            {/* Right Column: Message Testing */}
            <div className="border p-4 rounded h-fit">
                <h2 className="font-bold mb-4">4. Test Message Sending</h2>
                <form onSubmit={handleSendMessage} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Conversation ID</label>
                        <input
                            type="text"
                            value={conversationId}
                            onChange={(e) => setConversationId(e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Use a valid conversation ID from your database.
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Message</label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full p-2 border rounded h-24"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white p-2 rounded hover:bg-gray-800 disabled:opacity-50"
                    >
                        {loading ? 'Sending...' : 'Send Message'}
                    </button>
                </form>
            </div>
        </div>

        {/* Results & Errors */}
        <div className="mt-8 space-y-4">
            {error && (
                <div className="p-4 bg-red-100 text-red-700 rounded border border-red-200">
                    <strong>Error:</strong> {error}
                </div>
            )}

            {result && (
                <div className="p-4 bg-gray-50 rounded border overflow-auto">
                    <h3 className="font-bold mb-2">Result:</h3>
                    <pre className="text-xs">{JSON.stringify(result, null, 2)}</pre>
                </div>
            )}
        </div>
    </div>
)
}
