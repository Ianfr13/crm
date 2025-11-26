import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle } from "lucide-react";

export default function DeploymentPlan() {
    const selectedFunctions = [
        { name: "uazapi-admin", desc: "Create and manage instances" },
        { name: "uazapi-instance", desc: "Connect WhatsApp & Status" },
        { name: "uazapi-messages", desc: "Send Text, Audio, Photos" },
        { name: "uazapi-webhooks", desc: "Receive Messages" },
        { name: "uazapi-chats", desc: "Chat History" },
        { name: "uazapi-contacts", desc: "Contact Management" },
        { name: "uazapi-groups", desc: "Group Chats" },
        { name: "uazapi-message-actions", desc: "React, Reply, Delete" },
        { name: "uazapi-profile-calls", desc: "Profile & Calls" },
    ];

    const excludedFunctions = [
        "uazapi-blocks-labels",
        "uazapi-quick-crm",
        "uazapi-broadcast",
        "uazapi-chatwoot",
        "uazapi-proxy",
        "uazapi-chatbot",
    ];

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold">Deployment Plan: Essential Chat</h1>
                <p className="text-muted-foreground">
                    Focusing on core WhatsApp features for employee communication.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-green-200 bg-green-50/10">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-green-700">
                            <CheckCircle className="w-5 h-5" />
                            Selected for Deployment
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {selectedFunctions.map((func) => (
                            <div key={func.name} className="flex flex-col p-3 rounded-lg border bg-card">
                                <span className="font-semibold">{func.name}</span>
                                <span className="text-sm text-muted-foreground">{func.desc}</span>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card className="border-red-200 bg-red-50/10">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-red-700">
                            <XCircle className="w-5 h-5" />
                            Excluded (For Now)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {excludedFunctions.map((name) => (
                            <div key={name} className="p-3 rounded-lg border bg-card/50 text-muted-foreground">
                                {name}
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
