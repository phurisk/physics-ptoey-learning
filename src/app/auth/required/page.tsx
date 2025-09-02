"use client"

import { useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Navigation } from '@/components/navigation'

export default function RequireLoginPage() {
  const sp = useSearchParams()
  const router = useRouter()

  // Ensure ?login=1 exists to open modal via Navigation
  useEffect(() => {
    if (sp?.get('login') !== '1') {
      const params = new URLSearchParams(sp?.toString() || '')
      params.set('login', '1')
      router.replace(`?${params.toString()}`, { scroll: false })
    }
  }, [sp, router])

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-xl mx-auto pt-28 px-4">
        <h1 className="text-2xl font-bold mb-2">ต้องเข้าสู่ระบบก่อน</h1>
        <p className="text-gray-600">โปรดเข้าสู่ระบบเพื่อดำเนินการต่อ</p>
      </div>
    </div>
  )
}

