'use client';

import { useState } from 'react';
import { uazapiClient } from '@/lib/api/uazapi-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function UazapiTestPage() {
    const [instanceName, setInstanceName] = useState('');
    const [status, setStatus] = useState<string>('Unknown');
    const [qrCode, setQrCode] = useState<string | null>(null);
    const [logs, setLogs] = useState<string[]>([]);
    const [targetNumber, setTargetNumber] = useState('');
    const [messageText, setMessageText] = useState('');

    const addLog = (msg: string) => setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev]);

    const checkStatus = async () => {
        addLog('Checking status...');
        try {
            const data = await uazapiClient.instance.getInstanceStatus();
            // Check structure based on response
            const instanceStatus = data?.instance?.status || data?.status || 'Unknown';
            setStatus(instanceStatus);
            addLog(`Status: ${instanceStatus}`);
            
            const qr = data?.qrcode || data?.instance?.qrcode;
            if (qr) {
                setQrCode(qr);
            }
        } catch (error: any) {
            addLog(`Error checking status: ${error.message || error}`);
        }
    };

    const createInstance = async () => {
        const name = `test_${Math.random().toString(36).substring(7)}`;
        addLog(`Creating instance: ${name}...`);
        try {
            const data = await uazapiClient.admin.createInstance(name);
            setInstanceName(name);
            addLog(`Instance created! ID: ${data?.instance?.id || 'Unknown'}`);
            // The client handles auth internally via Supabase session
        } catch (error: any) {
            addLog(`Error creating instance: ${error.message || error}`);
        }
    };

    const connectInstance = async () => {
        addLog('Connecting instance...');
        try {
            const data = await uazapiClient.instance.connectInstance();
            addLog('Connect command sent. Check status for QR Code.');
            
            const qr = data?.qrcode || data?.instance?.qrcode;
            if (qr) {
                setQrCode(qr);
            }
            checkStatus();
        } catch (error: any) {
            addLog(`Error connecting: ${error.message || error}`);
        }
    };

    const sendMessage = async () => {
        if (!targetNumber || !messageText) return;
        addLog(`Sending message to ${targetNumber}...`);
        try {
            await uazapiClient.messages.sendText(targetNumber, messageText);
            addLog('Message sent!');
        } catch (error: any) {
            addLog(`Error sending message: ${error.message || error}`);
        }
    };

    const handleDisconnect = async () => {
        addLog('Disconnecting instance...');
        try {
            await uazapiClient.instance.disconnectInstance();
            addLog('Disconnected.');
            setStatus('disconnected');
            setQrCode(null);
        } catch (error: any) {
            addLog(`Error disconnecting: ${error.message || error}`);
        }
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            <h1 className="text-3xl font-bold">Uazapi Integration Test (v2)</h1>

            <div className="grid md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Instance Management</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-2">
                            <Button onClick={createInstance}>Create New Instance</Button>
                            <Button onClick={checkStatus} variant="outline">Check Status</Button>
                        </div>

                        <div className="flex gap-2">
                            <Button onClick={connectInstance} className="bg-green-600 hover:bg-green-700">
                                Connect (Get QR)
                            </Button>
                            <Button onClick={handleDisconnect} variant="destructive">
                                Disconnect
                            </Button>
                        </div>

                        <div className="p-4 bg-slate-100 rounded-md">
                            <p><strong>Status:</strong> {status}</p>
                            {qrCode && (
                                <div className="mt-4">
                                    <p className="mb-2 text-sm text-muted-foreground">Scan this QR Code:</p>
                                    <img src={qrCode} alt="QR Code" className="w-64 h-64 border-4 border-white shadow-lg" />
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Send Message</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Phone Number (e.g., 5511999999999)</Label>
                            <Input
                                value={targetNumber}
                                onChange={(e) => setTargetNumber(e.target.value)}
                                placeholder="55..."
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Message</Label>
                            <Input
                                value={messageText}
                                onChange={(e) => setMessageText(e.target.value)}
                                placeholder="Hello world"
                            />
                        </div>
                        <Button onClick={sendMessage} disabled={!targetNumber || !messageText}>
                            Send Text
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Debug Data</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-2 flex-wrap">
                            <Button onClick={async () => {
                                try {
                                    addLog('Fetching Chats...');
                                    const res = await uazapiClient.chats.listChats();
                                    addLog(`Chats: ${JSON.stringify(res, null, 2)}`);
                                } catch (e: any) { addLog(`Error Chats: ${e.message}`); }
                            }} variant="secondary">
                                List Chats
                            </Button>
                            <Button onClick={async () => {
                                try {
                                    addLog('Syncing Chats...');
                                    const res = await uazapiClient.chats.syncChats();
                                    addLog(`Sync: ${JSON.stringify(res, null, 2)}`);
                                } catch (e: any) { addLog(`Error Sync: ${e.message}`); }
                            }} variant="secondary">
                                Sync Chats
                            </Button>
                            <Button onClick={async () => {
                                try {
                                    addLog('Fetching Profile...');
                                    const res = await uazapiClient.instance.getInstanceStatus();
                                    addLog(`Status Full: ${JSON.stringify(res, null, 2)}`);
                                } catch (e: any) { addLog(`Error Profile: ${e.message}`); }
                            }} variant="secondary">
                                Get Status Raw
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Logs</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-64 overflow-y-auto bg-black text-green-400 p-4 rounded-md font-mono text-sm">
                        {logs.map((log, i) => (
                            <div key={i}>{log}</div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
