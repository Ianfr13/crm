import { uazapiClient } from '@/lib/api/uazapi-client'

export interface Contact {
  number: string
  name: string
  profilePicUrl?: string
  email?: string
}

const CACHE_KEY = 'uazapi_contacts_cache'
const CACHE_TTL = 60 * 60 * 1000 // 1 hour

interface CacheData {
  timestamp: number
  data: Contact[]
}

export const contactService = {
  async getContacts(forceRefresh = false): Promise<Contact[]> {
    if (!forceRefresh) {
      const cached = localStorage.getItem(CACHE_KEY)
      if (cached) {
        try {
          const { timestamp, data } = JSON.parse(cached) as CacheData
          if (Date.now() - timestamp < CACHE_TTL) {
            console.log('Returning cached contacts')
            return data
          }
        } catch (e) {
          console.error('Error parsing contacts cache', e)
        }
      }
    }

    return this.syncContacts()
  },

  async syncContacts(): Promise<Contact[]> {
    console.log('Fetching contacts from API...')
    try {
      const res = await uazapiClient.contacts.listContacts()
      
      let contactsList: any[] = []
      if (res.success) {
        if (Array.isArray(res.data)) {
            contactsList = res.data
        } else if (Array.isArray(res.data?.contacts)) {
            contactsList = res.data.contacts
        } else if (res.data && typeof res.data === 'object') {
            const possibleArray = Object.values(res.data).find(val => Array.isArray(val))
            if (possibleArray) {
                contactsList = possibleArray as any[]
            }
        }
      }

      // Parse and deduplicate
      const contactsMap = new Map<string, Contact>()
      
      contactsList.forEach((c: any) => {
        const rawId = c.id || c.phone || c.number || ''
        const number = typeof rawId === 'string' ? rawId.split('@')[0] : String(rawId)
        
        if (!number) return

        let name = c.name || c.pushName || c.wa_name || c.notifyName || c.shortName || c.verifiedName || number
        if (name === 'Desconhecido' || name === 'Unknown' || !name) {
            name = number
        }

        // If we already have this contact, only update if the new one has a better name (not just the number)
        if (contactsMap.has(number)) {
            const existing = contactsMap.get(number)!
            if (existing.name === number && name !== number) {
                contactsMap.set(number, {
                    number,
                    name,
                    profilePicUrl: c.profilePictureUrl || c.image || c.avatar || existing.profilePicUrl,
                    email: c.email
                })
            }
        } else {
            contactsMap.set(number, {
                number,
                name,
                profilePicUrl: c.profilePictureUrl || c.image || c.avatar,
                email: c.email
            })
        }
      })

      const parsedContacts = Array.from(contactsMap.values())
      
      // Save to cache
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        timestamp: Date.now(),
        data: parsedContacts
      }))

      return parsedContacts
    } catch (error) {
      console.error('Error syncing contacts:', error)
      return []
    }
  },

  getContactByPhone(contacts: Contact[], phone: string): Contact | undefined {
    // Try exact match
    let contact = contacts.find(c => c.number === phone)
    if (contact) return contact

    // Try removing/adding country code if needed (simple check)
    if (phone.length > 10) {
        // try without country code? difficult without lib, let's assume strict match for now
        // or fuzzy match endsWith
        contact = contacts.find(c => phone.endsWith(c.number) || c.number.endsWith(phone))
    }
    
    return contact
  }
}
