'use client'

import { useState } from 'react'
import { Contact } from '@/types'
import { Plus, Search, User } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export function ContactList({ initialContacts }: { initialContacts: Contact[] }) {
    const [contacts, setContacts] = useState(initialContacts)
    const [search, setSearch] = useState('')
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const filteredContacts = contacts.filter(contact =>
        contact.name.toLowerCase().includes(search.toLowerCase()) ||
        contact.email?.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="space-y-4">
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <input
                        placeholder="Search contacts..."
                        className="w-full rounded-md border border-gray-200 pl-9 py-2 text-sm outline-none focus:border-primary dark:bg-gray-800 dark:border-gray-700"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <button
                    onClick={() => setIsCreateOpen(true)}
                    className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
                >
                    <Plus className="h-4 w-4" />
                    New Contact
                </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredContacts.map(contact => (
                    <div key={contact.id} className="flex items-center gap-4 rounded-lg border bg-white p-4 shadow-sm dark:bg-gray-800 dark:border-gray-700 hover:border-primary/50 cursor-pointer transition-colors">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <User className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="truncate font-medium text-gray-900 dark:text-white">{contact.name}</p>
                            <p className="truncate text-sm text-gray-500 dark:text-gray-400">{contact.email}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Simple Modal for Create Contact */}
            {isCreateOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
                        <h2 className="text-lg font-semibold mb-4">Create New Contact</h2>
                        <form onSubmit={async (e) => {
                            e.preventDefault()
                            const formData = new FormData(e.currentTarget)
                            const name = formData.get('name') as string
                            const email = formData.get('email') as string

                            const { data, error } = await supabase.functions.invoke('contacts', {
                                method: 'POST',
                                body: { name, email }
                            })

                            if (error) {
                                console.error('Error creating contact:', error)
                                return
                            }

                            if (data) {
                                setContacts([data, ...contacts])
                                setIsCreateOpen(false)
                                router.refresh()
                            }
                        }}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Name</label>
                                    <input name="name" required className="w-full rounded-md border p-2 dark:bg-gray-700 dark:border-gray-600" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Email</label>
                                    <input name="email" type="email" className="w-full rounded-md border p-2 dark:bg-gray-700 dark:border-gray-600" />
                                </div>
                                <div className="flex justify-end gap-2 mt-6">
                                    <button type="button" onClick={() => setIsCreateOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md dark:text-gray-300 dark:hover:bg-gray-700">Cancel</button>
                                    <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-md">Create</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
