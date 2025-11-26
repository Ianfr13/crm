"use client"

// Página de teste temporária para não quebrar o build
export default function UazapiTestPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Uazapi Test</h1>
      <p className="text-gray-600">
        Esta página de teste está simplificada apenas para permitir o deploy.
      </p>
    </div>
  )
}
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
