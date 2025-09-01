"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Loader2 } from "lucide-react"
import { signIn } from "next-auth/react"
import { Input } from "@/components/ui/input"
import { SiLine } from "react-icons/si"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login')
  const [loading, setLoading] = useState<"line" | "credentials" | "register" | null>(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [name, setName] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleLineLogin = async () => {
    if (loading) return
    try {
      setLoading("line")
      setError(null)
      await signIn('line')
    } finally {
      setLoading(null)
    }
  }

  const handleCredentialsLogin = async () => {
    if (loading) return
    try {
      setLoading("credentials")
      setError(null)
      const res = await signIn('credentials', { redirect: false, email, password })
      if (res?.error) {
        setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง")
      } else {
        onClose()
      }
    } finally {
      setLoading(null)
    }
  }

  const handleRegister = async () => {
    if (loading) return
    try {
      setLoading("register")
      setError(null)
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, confirmPassword })
      })
      const json = await res.json()
      if (!res.ok || !json.success) {
        setError(json.error || 'สมัครสมาชิกไม่สำเร็จ')
      } else {
        await signIn('credentials', { email, password })
        onClose()
      }
    } finally {
      setLoading(null)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="
          sm:max-w-[480px]
          rounded-xl
          border border-gray-200
          bg-white
          shadow-lg
          p-0 overflow-hidden
        "
      >
        <DialogHeader className="px-6 pt-6 pb-2 text-center">
          <DialogTitle className="text-xl font-semibold text-gray-900 text-center">
            เข้าสู่ระบบหรือสมัครสมาชิก
          </DialogTitle>
          <p className="mt-1 text-sm text-gray-500 text-center">
            เลือกแท็บเพื่อเข้าสู่ระบบหรือสร้างบัญชีใหม่
          </p>
        </DialogHeader>


        <div className="px-6">
          <ul className="mx-auto mt-3 grid grid-cols-1 gap-2 text-sm text-gray-600">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-gray-400" />
              บันทึกความคืบหน้าการเรียนอัตโนมัติ
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-gray-400" />
              ปลดล็อกแบบฝึกหัดและข้อสอบทั้งหมด
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-gray-400" />
              ซิงก์ได้ทุกอุปกรณ์
            </li>
          </ul>
        </div>


        <div className="px-6 pt-5 pb-6">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
            <TabsList className="w-full h-10 p-1 rounded-full">
              <TabsTrigger className="rounded-full" value="login">เข้าสู่ระบบ</TabsTrigger>
              <TabsTrigger className="rounded-full" value="register">สมัครสมาชิก</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="mt-5 space-y-4">
              <Button
                onClick={handleLineLogin}
                disabled={!!loading}
                className="w-full py-3 rounded-lg bg-[#06C755] hover:bg-[#05b84f] text-white font-medium shadow-sm transition-all flex items-center justify-center gap-3 cursor-pointer"
              >
                {loading === "line" ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <SiLine className="h-6 w-6" />
                )}
                เข้าสู่ระบบด้วย LINE
              </Button>

              <div className="flex items-center gap-3 text-xs text-gray-400">
                <div className="h-px bg-gray-200 flex-1" />
                หรือ
                <div className="h-px bg-gray-200 flex-1" />
              </div>

              <div className="grid gap-3">
                <Input type="email" placeholder="อีเมล" value={email} onChange={(e) => setEmail(e.target.value)} />
                <Input type="password" placeholder="รหัสผ่าน" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              {error && activeTab === 'login' && <p className="text-sm text-red-600">{error}</p>}
              <Button onClick={handleCredentialsLogin} disabled={!!loading} variant="outline" className="w-full py-3 rounded-lg cursor-pointer">
                {loading === "credentials" ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
                <span className="ml-2">เข้าสู่ระบบด้วยอีเมล</span>
              </Button>
            </TabsContent>

            <TabsContent value="register" className="mt-5 space-y-4">
              <div className="grid gap-3">
                <Input placeholder="ชื่อ" value={name} onChange={(e) => setName(e.target.value)} />
                <Input type="email" placeholder="อีเมล" value={email} onChange={(e) => setEmail(e.target.value)} />
                <Input type="password" placeholder="รหัสผ่าน" value={password} onChange={(e) => setPassword(e.target.value)} />
                <Input type="password" placeholder="ยืนยันรหัสผ่าน" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              </div>
              {error && activeTab === 'register' && <p className="text-sm text-red-600">{error}</p>}
              <Button onClick={handleRegister} disabled={!!loading} className="w-full py-3 rounded-lg cursor-pointer">
                {loading === "register" ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
                <span className="ml-2">สมัครสมาชิก</span>
              </Button>
            </TabsContent>
          </Tabs>

          <p className="pt-4 text-center text-xs text-gray-400">
            โดยการเข้าสู่ระบบ/สมัครสมาชิก คุณยอมรับ <a href="/terms" className="underline underline-offset-2 hover:text-gray-600">ข้อกำหนดการใช้งาน</a> และ <a href="/privacy" className="underline underline-offset-2 hover:text-gray-600">นโยบายความเป็นส่วนตัว</a>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}


function LineIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 36 36" aria-hidden="true" {...props}>
      <path
        fill="#06C755"
        d="M18 4C9.716 4 3 9.63 3 16.58c0 4.02 2.318 7.56 5.87 9.77l-.62 4.63c-.06.47.44.82.86.6l5.15-2.67c1.16.24 2.37.37 3.74.37 8.284 0 15-5.63 15-12.58S26.284 4 18 4Z"
      />
      <path
        fill="#fff"
        d="M10.4 12.8h1.9v7.1h-1.9v-7.1Zm3.2 0h1.9v5.2h3.2v1.9h-5.1v-7.1Zm7.5 0h-3.8v7.1h1.9v-2.1h1.4c1.9 0 3.1-1.1 3.1-2.5 0-1.4-1.2-2.5-2.6-2.5Zm-.3 3.4h-1.6v-1.6h1.6c.5 0 .9.36.9.8 0 .44-.4.8-.9.8Zm2.9-3.4h1.9v5.2h3.2v1.9h-5.1v-7.1Z"
      />
    </svg>
  )
}

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  )
}
