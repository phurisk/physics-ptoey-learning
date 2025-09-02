"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { SiLine } from "react-icons/si"
import { Loader2 } from "lucide-react"
import { signIn } from "next-auth/react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState<"line" | "credentials" | null>(null)
  const [error, setError] = useState<string | null>(null)
  const sp = useSearchParams()
  const msg = useMemo(() => sp?.get('msg'), [sp])
  const callbackUrl = useMemo(() => sp?.get('callbackUrl') || undefined, [sp])

  const doLine = async () => {
    if (loading) return
    try {
      setLoading('line')
      setError(null)
      await signIn('line', callbackUrl ? { callbackUrl } : undefined)
    } finally {
      setLoading(null)
    }
  }

  const doCredentials = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return
    try {
      setLoading('credentials')
      setError(null)
      const res = await signIn('credentials', callbackUrl ? { redirect: true, email, password, callbackUrl } : { redirect: false, email, password })
      if (res?.error) setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-md mx-auto px-4 py-10">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">เข้าสู่ระบบ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {msg === 'login_required' && (
              <div className="p-3 rounded-md bg-yellow-50 text-yellow-800 text-sm">กรุณาเข้าสู่ระบบหรือสมัครสมาชิกเพื่อดำเนินการต่อ</div>
            )}
            <Button onClick={doLine} disabled={!!loading} className="w-full bg-[#06C755] hover:bg-[#05b84f] text-white cursor-pointer">
              {loading === 'line' ? <Loader2 className="h-5 w-5 animate-spin" /> : <SiLine className="h-6 w-6 mr-2" />}
              เข้าสู่ระบบด้วย LINE
            </Button>

            <form onSubmit={doCredentials} className="space-y-3">
              <Input type="email" placeholder="อีเมล" value={email} onChange={(e) => setEmail(e.target.value)} />
              <Input type="password" placeholder="รหัสผ่าน" value={password} onChange={(e) => setPassword(e.target.value)} />
              {error && <p className="text-sm text-red-600">{error}</p>}
              <Button type="submit" variant="outline" disabled={!!loading} className="w-full cursor-pointer">
                {loading === 'credentials' ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
                <span className="ml-2">เข้าสู่ระบบด้วยอีเมล</span>
              </Button>
            </form>

            <div className="text-sm text-center text-gray-600">ยังไม่มีบัญชี? <Link className="underline" href={callbackUrl ? `/register?callbackUrl=${encodeURIComponent(callbackUrl)}` : '/register'}>สมัครสมาชิก</Link></div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
