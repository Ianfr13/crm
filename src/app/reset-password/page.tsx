'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Lock, CheckCircle2, ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CRMButton } from '@/components/ui/crm-button'
import { useCRMTheme } from '@/providers/crm-theme-provider'
import Link from 'next/link'

export default function ResetPasswordPage() {
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const router = useRouter()
    const supabase = createClient()
    const { isDark, themeColor } = useCRMTheme()

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        if (password !== confirmPassword) {
            setError('As senhas não coincidem.')
            setLoading(false)
            return
        }

        if (password.length < 6) {
            setError('A senha deve ter pelo menos 6 caracteres.')
            setLoading(false)
            return
        }

        try {
            const { error } = await supabase.auth.updateUser({ password: password })

            if (error) {
                throw error
            }

            setSuccess(true)
            // Redirect after a short delay
            setTimeout(() => {
                router.push('/dashboard')
            }, 3000)
        } catch (err: any) {
            setError(err.message || 'Erro ao atualizar a senha.')
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
               <h2 className={cn("text-xl font-bold", isDark ? "text-white" : "text-zinc-900")}>Definir Nova Senha</h2>
               <p className={cn("text-xs text-center", isDark ? "text-zinc-400" : "text-zinc-500")}>
                   Crie uma nova senha para sua conta.
               </p>
            </div>
            
            {success ? (
                <div className="space-y-6">
                    <div className="flex flex-col items-center text-center space-y-2 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                        <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                        <h3 className="text-sm font-bold text-emerald-500">Senha Atualizada!</h3>
                        <p className="text-xs text-zinc-500">
                            Sua senha foi alterada com sucesso. Redirecionando...
                        </p>
                    </div>
                    <Link href="/dashboard" className="block">
                        <CRMButton 
                            themeColor={themeColor} 
                            isDark={isDark} 
                            size="lg"
                            className="w-full"
                        >
                            Acessar Dashboard
                        </CRMButton>
                    </Link>
                </div>
            ) : (
                <form onSubmit={handleUpdatePassword} className="space-y-4">
                    <div className="space-y-1.5">
                        <label className={cn("text-xs font-bold ml-1 uppercase tracking-wider", isDark ? "text-zinc-500" : "text-zinc-400")}>Nova Senha</label>
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
                            required
                            minLength={6}
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className={cn("text-xs font-bold ml-1 uppercase tracking-wider", isDark ? "text-zinc-500" : "text-zinc-400")}>Confirmar Senha</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                            <input 
                            type="password" 
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={cn(
                                "w-full pl-10 pr-3 py-3 rounded-xl border text-sm outline-none transition-all focus:ring-2 shadow-sm",
                                isDark 
                                ? `bg-zinc-900 border-zinc-800 text-white focus:ring-${themeColor}-500/20 focus:border-${themeColor}-500 placeholder:text-zinc-600` 
                                : `bg-white border-zinc-200 text-zinc-900 focus:ring-${themeColor}-500/20 focus:border-${themeColor}-500 placeholder:text-zinc-400`
                            )}
                            placeholder="••••••••"
                            required
                            minLength={6}
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
                        {loading ? 'Atualizando...' : 'Atualizar Senha'}
                    </CRMButton>
                </form>
            )}
         </div>
      </div>
    )
}