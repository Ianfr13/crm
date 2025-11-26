import { createClient } from '@/lib/supabase/server'
import { InboxLayout } from '@/components/features/inbox/inbox-layout'

export default async function InboxPage() {
    return (
        <div className="h-[calc(100vh-4rem)]"> {/* Adjust height based on topbar/layout */}
            <InboxLayout />
        </div>
    )
}
