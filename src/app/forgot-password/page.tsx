'use client'

import React, { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CRMButton } from '@/components/ui/crm-button'
import { useCRMTheme } from '@/providers/crm-theme-provider'
import Link from 'next/link'

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const router = useRouter()
    const supabase = createClient()
    const { isDark, themeColor } = useCRMTheme()

    const handleResetPassword = async (e?: React.FormEvent) => {
        if(e) e.preventDefault()
        setLoading(true)
        setError(null)
        setSuccess(false)

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
            })

            if (error) {
                throw error
            }

            setSuccess(true)
        } catch (err: any) {
            setError(err.message || 'Erro ao enviar email de recuperação.')
        } finally {
            setLoading(false)
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
                className={cn("h-20 w-auto object-contain drop-shadow-2xl", !isDark && "brightness-0 opacity-80")}
               />
               <h2 className={cn("text-xl font-bold", isDark ? "text-white" : "text-zinc-900")}>Recuperar Senha</h2>
               <p className={cn("text-xs text-center", isDark ? "text-zinc-400" : "text-zinc-500")}>
                   Digite seu email para receber as instruções de redefinição.
               </p>
            </div>
            
            {success ? (
                <div className="space-y-6">
                    <div className="flex flex-col items-center text-center space-y-2 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                        <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                        <h3 className="text-sm font-bold text-emerald-500">Email Enviado!</h3>
                        <p className="text-xs text-zinc-500">
                            Verifique sua caixa de entrada (e spam) para redefinir sua senha.
                        </p>
                    </div>
                    <Link href="/login" className="block">
                        <CRMButton 
                            themeColor={themeColor} 
                            isDark={isDark} 
                            size="lg"
                            variant="outline"
                            className="w-full"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" /> Voltar para Login
                        </CRMButton>
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    <form onSubmit={handleResetPassword} className="space-y-4">
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
                                required
                                />
                            </div>
                        </div>
                        
                        {error && (
                            <div className="text-red-500 text-xs text-center bg-red-500/10 p-2 rounded border border-red-500/20">{error}</div>
                        )}

                        <CRMButton 
                            themeColor={themeColor} 
                            isDark={isDark} 
                            size="lg"
                            className="w-full mt-6 shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all"
                            disabled={loading}
                            type="submit"
                        >
                            {loading ? 'Enviando...' : 'Enviar Email'}
                        </CRMButton>
                    </form>

                    <Link href="/login" className={cn("block text-center text-xs hover:underline mt-4", isDark ? "text-zinc-500 hover:text-zinc-300" : "text-zinc-400 hover:text-zinc-600")}>
                        Voltar para Login
                    </Link>
                </div>
            )}
         </div>
      </div>
    )
}