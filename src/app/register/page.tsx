"use client"

import { Suspense, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signIn } from "next-auth/react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

function RegisterContent() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const sp = useSearchParams()
  const callbackUrl = useMemo(() => sp?.get('callbackUrl') || undefined, [sp])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return
    setError(null)
    setSuccess(null)
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, confirmPassword })
      })
      const json = await res.json()
      if (!res.ok || !json.success) {
        setError(json.error || 'สมัครสมาชิกไม่สำเร็จ')
      } else {
        setSuccess('สมัครสมาชิกสำเร็จ กำลังเข้าสู่ระบบ...')
        // auto sign in
        await signIn('credentials', callbackUrl ? { email, password, callbackUrl } : { email, password, callbackUrl: '/' })
      }
    } catch (e: any) {
      setError('เกิดข้อผิดพลาด กรุณาลองใหม่')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-md mx-auto px-4 py-10">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">สมัครสมาชิก</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              <div>
                <Label htmlFor="name">ชื่อ</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="email">อีเมล</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="password">รหัสผ่าน</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="confirm">ยืนยันรหัสผ่าน</Label>
                <Input id="confirm" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              {success && <p className="text-sm text-green-600">{success}</p>}
              <Button type="submit" disabled={loading} className="w-full cursor-pointer">{loading ? 'กำลังสมัคร...' : 'สมัครสมาชิก'}</Button>
              <div className="text-sm text-center text-gray-600">มีบัญชีแล้ว? <Link className="underline" href={callbackUrl ? `/login?callbackUrl=${encodeURIComponent(callbackUrl)}` : '/login'}>เข้าสู่ระบบ</Link></div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterContent />
    </Suspense>
  )
}
