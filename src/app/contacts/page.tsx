import { createClient } from '@/lib/supabase/server'
import { ContactList } from '@/components/features/contacts/contact-list'
import { Contact } from '@/types'

export default async function ContactsPage() {
    const supabase = await createClient()

    // Note: In a real production env with Supabase CLI running locally, 
    // you might need to point to the local function URL explicitly if not using 'supabase start'.
    // For this MVP setup, we assume standard invocation.
    const { data: contacts, error } = await supabase.functions.invoke('contacts', {
        method: 'GET',
    })

    if (error) {
        console.error('Error fetching contacts:', error)
        // Handle error gracefully, maybe show empty list or error message
    }

    return (
        <div className="h-full flex flex-col">
            <div className="border-b p-4 flex items-center justify-between bg-white dark:bg-gray-900">
                <h1 className="text-xl font-semibold">Contacts</h1>
                {/* Add Contact Button will go here */}
            </div>
            <div className="flex-1 overflow-auto p-4">
                <ContactList initialContacts={(contacts as Contact[]) || []} />
            </div>
        </div>
    )
}
