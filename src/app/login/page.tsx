'use client'

import React, { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Mail, Lock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CRMButton } from '@/components/ui/crm-button'
import { useCRMTheme } from '@/providers/crm-theme-provider'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const supabase = createClient()
    const { isDark, themeColor } = useCRMTheme()

    const handleLogin = async (e?: React.FormEvent) => {
        if(e) e.preventDefault()
        setLoading(true)
        setError(null)

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            setError(error.message)
            setLoading(false)
        } else {
            router.push('/dashboard')
            router.refresh()
        }
    }

    return (
      <div className={cn("flex flex-col items-center justify-center h-screen w-full transition-colors duration-500", isDark ? "bg-zinc-950" : "bg-zinc-50")}>
         
         <div className="fixed inset-0 pointer-events-none overflow-hidden">
            <div className={cn("absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] opacity-10 transition-colors duration-700", `bg-${themeColor}-600`)} />
            <div className={cn("absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] opacity-10 transition-colors duration-700", isDark ? "bg-blue-600" : "bg-blue-400")} />
         </div>
  
         <div className="w-full max-w-[350px] p-8 space-y-8 relative z-10 animate-in fade-in zoom-in-95 duration-500">
            <div className="flex flex-col items-center justify-center gap-4">
               <img 
                src="https://i.postimg.cc/25tSrv5C/LOGO-19.png" 
                alt="UazAPI Logo" 
                className={cn("h-24 w-auto object-contain drop-shadow-2xl", !isDark && "brightness-0 opacity-80")}
               />
            </div>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                 <label className={cn("text-xs font-bold ml-1 uppercase tracking-wider", isDark ? "text-zinc-500" : "text-zinc-400")}>Email</label>
                 <div className="relative">
                     <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                     <input 
                       type="email" 
                       value={email}
                       onChange={(e) => setEmail(e.target.value)}
                       className={cn(
                         "w-full pl-10 pr-3 py-3 rounded-xl border text-sm outline-none transition-all focus:ring-2 shadow-sm",
                         isDark 
                           ? `bg-zinc-900 border-zinc-800 text-white focus:ring-${themeColor}-500/20 focus:border-${themeColor}-500 placeholder:text-zinc-600` 
                           : `bg-white border-zinc-200 text-zinc-900 focus:ring-${themeColor}-500/20 focus:border-${themeColor}-500 placeholder:text-zinc-400`
                       )}
                       placeholder="seu@email.com"
                     />
                 </div>
              </div>
              
              <div className="space-y-1.5">
                 <label className={cn("text-xs font-bold ml-1 uppercase tracking-wider", isDark ? "text-zinc-500" : "text-zinc-400")}>Senha</label>
                 <div className="relative">
                     <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                     <input 
                       type="password" 
                       value={password}
                       onChange={(e) => setPassword(e.target.value)}
                       className={cn(
                         "w-full pl-10 pr-3 py-3 rounded-xl border text-sm outline-none transition-all focus:ring-2 shadow-sm",
                         isDark 
                           ? `bg-zinc-900 border-zinc-800 text-white focus:ring-${themeColor}-500/20 focus:border-${themeColor}-500 placeholder:text-zinc-600` 
                           : `bg-white border-zinc-200 text-zinc-900 focus:ring-${themeColor}-500/20 focus:border-${themeColor}-500 placeholder:text-zinc-400`
                       )}
                       placeholder="••••••••"
                     />
                 </div>
              </div>
              
              {error && (
                  <div className="text-red-500 text-xs text-center">{error}</div>
              )}

              <CRMButton 
                themeColor={themeColor} 
                isDark={isDark} 
                size="lg"
                className="w-full mt-6 shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all"
                onClick={handleLogin}
                disabled={loading}
              >
                {loading ? 'Entrando...' : 'Entrar na Plataforma'}
              </CRMButton>
  
              <p className={cn("text-center text-[10px] mt-4", isDark ? "text-zinc-600" : "text-zinc-400")}>
                  Ao entrar, você concorda com os Termos de Uso.
              </p>
            </div>
         </div>
      </div>
    )
}
